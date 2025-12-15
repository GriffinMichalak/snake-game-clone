import { Renderer } from "./Renderer.js";
import { Input } from "./Input.js";
import { BOARD_HEIGHT, BOARD_WIDTH, START_X, START_Y, MOVE_KEYS } from "./Constants.js";

let BOARD: number[][] = Array.from({ length: BOARD_HEIGHT }, () => Array(BOARD_WIDTH).fill(0));
export class Game {
  private renderer: Renderer;
  private input: Input;
  private snake: number[][];
  private direction: string;
  private foodCoord: number[];
  private gameOver: boolean;
  private score: number;
  private highScore: number;
  private lastTime: number;
  private timeElapsed: number;
  private moveProgress: number;

  constructor(private canvas: HTMLCanvasElement, private ctx: CanvasRenderingContext2D) {
    this.renderer = new Renderer(ctx, canvas.width, canvas.height);
    this.input = new Input();
    this.snake = [[START_Y, START_X], [START_Y, START_X - 1], [START_Y, START_X - 2]];
    this.direction = 'right';
    this.foodCoord = this.generateFood([[START_X, START_Y]]);
    this.gameOver = false;
    this.score = 0;
    this.highScore = 0;
    this.lastTime = 0;
    this.timeElapsed = 0;
    this.moveProgress = 0;

    BOARD[this.foodCoord[1]][this.foodCoord[0]] = 1;
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
    this.snake.push([-10,-10]);
  }

  increaseScore() {
    this.score += 1;
    const menu = document.getElementById('score')!;
    menu.textContent = `${this.score}`
  }

  start() {
    this.renderer.drawBoard(BOARD, this.snake[0][1], this.snake[0][0], this.snake);
    document.addEventListener('keydown', (event) => {
      if (MOVE_KEYS.includes(event.key)) {
        requestAnimationFrame(this.loop);
      }
    });
  }

  reset() {
    BOARD[this.foodCoord[1]][this.foodCoord[0]] = 0;
    this.renderer = new Renderer(this.ctx, this.canvas.width, this.canvas.height);
    this.input = new Input();
    this.snake = [[START_Y, START_X], [START_Y, START_X - 1], [START_Y, START_X - 2]];
    this.direction = 'right';
    this.foodCoord = this.generateFood([[START_X, START_Y]]);
    this.gameOver = false;
    this.score = 0;
    this.lastTime = 0;
    this.timeElapsed = 0;
    this.moveProgress = 0;

    BOARD[this.foodCoord[1]][this.foodCoord[0]] = 1;
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

  moveSnake() {
    const snakeOnEdge: boolean = (
      (this.direction == 'up' && !(this.snake[0][0] > 0)) ||
      (this.direction == 'down' && !(this.snake[0][0] < BOARD_HEIGHT - 1)) ||
      (this.direction == 'left' && !(this.snake[0][1] > 0)) || 
      (this.direction == 'right' && !(this.snake[0][1] < BOARD_WIDTH - 1))
    );

    if (snakeOnEdge || this.snakeOverlap()) {
      return -1;
    }
    this.moveProgress += 0.25;

    if (this.moveProgress >= 1.0) {
      this.moveProgress -= 1.0; 
    }
    const headX = this.snake[0][1];
    const headY = this.snake[0][0];
    let dx = 0, dy = 0;

    switch (this.direction) {
      case 'up':
        dx = 0, dy = -1;
        break;
      case 'down':
        dx = 0, dy = 1;
        break;
      case 'left':
        dx = -1, dy = 0;
        break;
      case 'right':
        dx = 1, dy = 0;
        break;
    }

    const newHead = [headY + dy, headX + dx];
    this.snake.unshift(newHead); // add new head to the front of the array
    this.snake.pop(); // remove the tail (unless growing, to be handled later)

    this.renderer.drawBoard(BOARD, newHead[1], newHead[0], this.snake);
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
      BOARD[this.foodCoord[1]][this.foodCoord[0]] = 0;
      this.growSnake();
      this.increaseScore();
      this.foodCoord = this.generateFood(this.snake);
      BOARD[this.foodCoord[1]][this.foodCoord[0]] = 1;
    }

    if ((this.input.isPressed('ArrowUp') || this.input.isPressed('w')) && snakeOnGrid && this.direction != 'down') {
      this.direction = 'up';
    }
    if ((this.input.isPressed('ArrowDown') || this.input.isPressed('s')) && snakeOnGrid && this.direction != 'up') {
      this.direction = 'down';
    }
    if ((this.input.isPressed('ArrowLeft') || this.input.isPressed('a')) && snakeOnGrid && this.direction != 'right') {
      this.direction = 'left';
    }
    if ((this.input.isPressed('ArrowRight') || this.input.isPressed('d')) && snakeOnGrid && this.direction != 'left') {
      this.direction = 'right';
    }

    if (this.timeElapsed > 60) {
      if (this.moveSnake() == 1){
        this.timeElapsed = 0;
      }
      else {
        // game end logic 
        this.renderer.drawGameOver();
        this.gameOver = true;
        this.highScore = Math.max(this.score, this.highScore);
        const menu = document.getElementById('highscore')!;
        menu.textContent = `${this.highScore}`
        window.addEventListener('keydown', (e) => {
          if (e.key === 'r') {
            this.reset();
            this.start();
          }
        }, { once: true });
        return;
      }
    }
    
    this.renderer.drawBoard(BOARD, this.snake[0][1], this.snake[0][0], this.snake);

    requestAnimationFrame(this.loop);
  };
}