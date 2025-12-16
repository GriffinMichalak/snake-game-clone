import { Renderer } from "./Renderer.js";
import { Input } from "./Input.js";
import { BOARD_HEIGHT, BOARD_WIDTH, START_X, START_Y, START_MOVE_KEYS } from "./Constants.js";

let BOARD: number[][] = Array.from({ length: BOARD_HEIGHT }, () => Array(BOARD_WIDTH).fill(0));

export class Game {
  private renderer: Renderer;
  private input: Input;
  private snake: any[][];
  private foodCoord: number[];
  private gameOver: boolean;
  public gameStarted: boolean;
  private score: number;
  private highScore: number;
  private lastTime: number;
  private timeElapsed: number;
  private moveProgress: number;
  private volumeOn: boolean;
  private pivots: Map<string, any[]>;
  private pendingDir: string | null;

  constructor(private canvas: HTMLCanvasElement, private ctx: CanvasRenderingContext2D) {
    this.renderer = new Renderer(ctx, canvas.width, canvas.height);
    this.input = new Input();
    this.snake = [[START_Y, START_X, 'right'], [START_Y, START_X - 1, 'right'], [START_Y, START_X - 2, 'right']];
    this.foodCoord = this.generateFood([[START_X, START_Y]]);
    this.gameOver = false;
    this.gameStarted = false;
    this.score = 0;
    this.highScore = 0;
    this.lastTime = 0;
    this.timeElapsed = 0;
    this.moveProgress = 0;
    this.volumeOn = true;
    this.pivots = new Map<string, any[]>();
    this.pendingDir = null;

    BOARD[this.foodCoord[1]][this.foodCoord[0]] = 1;

    const volumeButton = document.getElementById("volume-icon")!;
    volumeButton.addEventListener("click", () => {
      this.volumeToggle();
    });
  }

  volumeToggle() {
    const volumeIcon = document.getElementById('volume-icon') as HTMLImageElement;
    this.volumeOn = !this.volumeOn;
    if (volumeIcon) {
      if (this.volumeOn) {
        volumeIcon.src = "media/icons/volume_up.svg";
      } else {
        volumeIcon.src = "media/icons/volume_off.svg";
      }
      volumeIcon.style.display = "inline";
    }
  }
  
  generateFood(exclude: Array<number[]>): [number, number] {
    let x = Math.floor(Math.random() * BOARD_WIDTH);
    let y = Math.floor(Math.random() * BOARD_HEIGHT);

    while (exclude.some(coord => coord[0] === x && coord[1] === y)) {
      x = Math.floor(Math.random() * BOARD_WIDTH);
      y = Math.floor(Math.random() * BOARD_HEIGHT);
    }
    return [x, y];
  }

  growSnake() {
    const snakeEnd = this.snake[this.snake.length - 1];
    const endDir = snakeEnd[2];
    let newX: number = snakeEnd[1], newY: number = snakeEnd[0];
    let newDir: string = endDir;
    switch (endDir) {
      case 'up':
        newX = snakeEnd[1];
        newY = snakeEnd[0] + 1;
        break;
      case 'down':
        newX = snakeEnd[1];
        newY = snakeEnd[0] - 1;
        break;
      case 'left':
        newX = snakeEnd[1] + 1;
        newY = snakeEnd[0];
        break;
      case 'right':
        newX = snakeEnd[1] - 1;
        newY = snakeEnd[0];
        break;
    }
    this.snake.push([newY, newX, newDir]);
  }

  increaseScore() {
    this.score += 1;
    let menu = document.getElementById('score')!;
    menu.textContent = `${this.score}`

    menu = document.getElementById('score-start')!;
    menu.textContent = `${this.score}`
  }

  start() {
    this.renderer.drawBoard(BOARD, this.snake);
    document.addEventListener('keydown', (event) => {
      if (START_MOVE_KEYS.includes(event.key) && this.gameStarted) {
        requestAnimationFrame(this.loop);
      }
    });
  }

  reset() {
    BOARD[this.foodCoord[1]][this.foodCoord[0]] = 0;
    this.renderer = new Renderer(this.ctx, this.canvas.width, this.canvas.height);
    this.input = new Input();
    this.snake = [[START_Y, START_X, 'right'], [START_Y, START_X - 1, 'right'], [START_Y, START_X - 2, 'right']];
    this.foodCoord = this.generateFood([[START_X, START_Y]]);
    this.gameOver = false;
    this.score = 0;
    this.lastTime = 0;
    this.timeElapsed = 0;
    this.moveProgress = 0;
    this.gameStarted = false;
    this.pendingDir = null;

    BOARD[this.foodCoord[1]][this.foodCoord[0]] = 1;

    let menu = document.getElementById('score')!;
    menu.textContent = `${this.score}`

    menu = document.getElementById('score-start')!;
    menu.textContent = `${this.score}`
  }

  snakeOverlap(): boolean {
    for (let i = 1; i < this.snake.length; i++) {
      const cell = this.snake[i];
      if (this.snake[0][0] == cell[0] && this.snake[0][1] == cell[1]) {
        return true;
      }
    }
    return false;
  }

  playAudio(name: string) {
    const x = document.getElementById(`${name}-audio`); 
    if (this.volumeOn && x instanceof HTMLAudioElement) {
      x.play();
    }
  }

  moveSnake() {
    const snakeOnGrid: boolean = this.snake[0][0] % 1 == 0 && this.snake[0][1] % 1 == 0;
    if (snakeOnGrid && this.pendingDir) {
      this.snake[0][2] = this.pendingDir;
      this.playAudio(this.snake[0][2]);
      this.pendingDir = null;
      this.pivots.set(`${this.snake[0][1]},${this.snake[0][0]}`, [this.snake[0][2], 0]);
    }
    const dir = this.snake[0][2];
    const snakeOnEdge: boolean = (
      (dir == 'up' && (this.snake[0][0] <= 0)) ||
      (dir == 'down' && (this.snake[0][0] >= BOARD_HEIGHT - 1)) ||
      (dir == 'left' && (this.snake[0][1] <= 0)) || 
      (dir == 'right' && (this.snake[0][1] >= BOARD_WIDTH - 1))
    );

    if (snakeOnEdge || this.snakeOverlap()) {
      this.playAudio('gameover');
      return -1;
    }
    this.moveProgress += 0.25;

    if (this.moveProgress >= 1.0) {
      this.moveProgress -= 1.0; 
    }

    for (let i = 0; i < this.snake.length; i++) {
      const curr = this.snake[i];
      const pieceX = curr[1];
      const pieceY = curr[0];

      const key = `${curr[1]},${curr[0]}`;
      if (this.pivots.has(key)) {
        const value = this.pivots.get(key);
        if (Array.isArray(value) && typeof value[0] === "string" && typeof value[1] === "number") {
          const dir: string = value[0];
          const visits: number = value[1];
          curr[2] = dir;
          this.pivots.set(key, [dir, visits + 1]);
          if (visits + 1 == this.snake.length) { 
            this.pivots.delete(key);
          }
        }
      }

      let dx = 0, dy = 0;

      switch (curr[2]) {
        case 'up':
          dx = 0, dy = -0.25;
          break;
        case 'down':
          dx = 0, dy = 0.25;
          break;
        case 'left':
          dx = -0.25, dy = 0;
          break;
        case 'right':
          dx = 0.25, dy = 0;
          break;
      }

      curr[0] = pieceY + dy;
      curr[1] = pieceX + dx;
    }

    return 1;
  }

  private loop = (timestamp: number) => {
    if (this.gameOver) {
      return;
    }

    const deltaTime = timestamp - this.lastTime;
    this.lastTime = timestamp;
    this.timeElapsed += deltaTime;

    const snakeOnGrid: boolean = this.snake[0][0] % 1 == 0 && this.snake[0][1] % 1 == 0;

    if (snakeOnGrid && this.snake[0][0] == this.foodCoord[1] && this.snake[0][1] == this.foodCoord[0]) {
      this.increaseScore();
      this.playAudio('chomp');
      BOARD[this.foodCoord[1]][this.foodCoord[0]] = 0;
      this.growSnake();
      this.foodCoord = this.generateFood(this.snake);
      BOARD[this.foodCoord[1]][this.foodCoord[0]] = 1;
    }


    const wantDir =
      (this.input.isPressed('ArrowUp') || this.input.isPressed('w')) ? 'up' :
      (this.input.isPressed('ArrowDown') || this.input.isPressed('s')) ? 'down' :
      (this.input.isPressed('ArrowLeft') || this.input.isPressed('a')) ? 'left' :
      (this.input.isPressed('ArrowRight') || this.input.isPressed('d')) ? 'right' :
      null;

    if (wantDir &&
      wantDir !== this.snake[0][2] &&
      !((wantDir === 'up' && this.snake[0][2] === 'down') ||
        (wantDir === 'down' && this.snake[0][2] === 'up') ||
        (wantDir === 'left' && this.snake[0][2] === 'right') ||
        (wantDir === 'right' && this.snake[0][2] === 'left'))) {
      this.pendingDir = wantDir;
    }

    if (this.timeElapsed > 30) {
      if (this.moveSnake() == 1){
        this.timeElapsed = 0;
      }
      else {
        // game end logic 
        this.gameOver = true;
        this.highScore = Math.max(this.score, this.highScore);
        let menu = document.getElementById('highscore')!;
        menu.textContent = `${this.highScore}`;

        menu = document.getElementById('highscore-start')!;
        menu.textContent = `${this.highScore}`;

        const modal = document.getElementById('modal');
        setTimeout(() => {
          if (modal instanceof HTMLDialogElement) {
            modal.showModal();
            modal.style.display = 'flex';
          }
        }, 1200);
        const playBtn = document.getElementById('play-btn');
        playBtn!.addEventListener('click', () => {
          if (modal instanceof HTMLDialogElement) {
              modal.close();
              modal.style.display = 'none';
              this.reset();
              this.gameStarted = true;
              this.start();
          }
      });
        return;
      }
    }
    
    this.renderer.drawBoard(BOARD, this.snake);

    requestAnimationFrame(this.loop);
  };
}