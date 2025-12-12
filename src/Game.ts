import { Renderer } from "./Renderer.js";
import { Input } from "./Input.js";


const BOARD_HEIGHT = 15;
const BOARD_WIDTH = 17;

const START_X = 3; // zero-indexed
const START_Y = 7; // zero-indexed

let BOARD: number[][] = Array.from({ length: BOARD_HEIGHT }, () => Array(BOARD_WIDTH).fill(0));
let SNAKE: any[][];

const MOVE_KEYS: string[] = ['ArrowUp', 'ArrowDown', 'ArrowLeft', 'ArrowRight', 'w', 'a', 's', 'd']

export class Game {
  private lastTime = 0;
  private renderer: Renderer;
  private input: Input;
  private timeElapsed: number;

  constructor(
    private canvas: HTMLCanvasElement,
    private ctx: CanvasRenderingContext2D
  ) {
    this.renderer = new Renderer(ctx, canvas.width, canvas.height);
    this.input = new Input();
    this.timeElapsed = 0;

    const foodCoord = this.generateFood([[START_X, START_Y]])
    BOARD[foodCoord[1]][foodCoord[0]] = 1;
    SNAKE = [[this.SNAKE_HEAD_Y, this.SNAKE_HEAD_X, 'right'], [this.SNAKE_HEAD_Y, this.SNAKE_HEAD_X - 1, 'right'], [this.SNAKE_HEAD_Y, this.SNAKE_HEAD_X - 2, 'right']];
  }
  SNAKE_HEAD_X: number = START_X;
  SNAKE_HEAD_Y: number = START_Y;
  
  generateFood(exclude: Array<number[]>): [number, number] {
    let x = Math.floor(Math.random() * BOARD_WIDTH);
    let y = Math.floor(Math.random() * BOARD_HEIGHT);

    while (exclude.some(coord => coord[0] === x && coord[1] === y)) {
      x = Math.floor(Math.random() * BOARD_WIDTH);
      y = Math.floor(Math.random() * BOARD_HEIGHT);
    }
    return [x, y]
  }

  start() {
    this.renderer.drawBoard(BOARD, this.SNAKE_HEAD_X, this.SNAKE_HEAD_Y, SNAKE);
    document.addEventListener('keydown', (event) => {
      if (MOVE_KEYS.includes(event.key)) {
        requestAnimationFrame(this.loop);
      }
    });
  }

  moveSnake() {
    if (SNAKE[0][2] == 'up' && (this.SNAKE_HEAD_Y > 0)) {
      SNAKE.forEach((cell) => {
        if (cell[2] == 'up') {
          cell[0] -= 0.25;
        }
      });

      this.SNAKE_HEAD_Y -= 0.25;
      return 1;
    }
    if (SNAKE[0][2] == 'down' && (this.SNAKE_HEAD_Y < BOARD_HEIGHT - 1)) {
      SNAKE.forEach((cell) => {
        if (cell[2] == 'down') {
          cell[0] += 0.25;
        }
      });

      this.SNAKE_HEAD_Y += 0.25;
      this.renderer.drawBoard(BOARD, this.SNAKE_HEAD_X, this.SNAKE_HEAD_Y, SNAKE);
      return 1;
    }
    if (SNAKE[0][2] == 'left' && (this.SNAKE_HEAD_X > 0)) {
      SNAKE.forEach((cell) => {
        if (cell[2] == 'left') {
          cell[1] -= 0.25;
        }
      });

      this.SNAKE_HEAD_X -= 0.25;
      return 1;
    }
    if (SNAKE[0][2] == 'right' && (this.SNAKE_HEAD_X < BOARD_WIDTH - 1)) {
      SNAKE.forEach((cell) => {
        if (cell[2] == 'right') {
          cell[1] += 0.25;
        }
      });

      this.SNAKE_HEAD_X += 0.25;
      return 1;
    }
    else {
      return -1;
    }
  }

  private loop = (timestamp: number) => {
    const deltaTime = timestamp - this.lastTime;
    this.lastTime = timestamp;
    this.timeElapsed += deltaTime;

    const snakeOnGrid: boolean = SNAKE[0][0] % 1 == 0 && SNAKE[0][1] % 1 == 0;

    if ((this.input.isPressed('ArrowUp') || this.input.isPressed('w')) && snakeOnGrid && SNAKE[0][2] != 'down') {
      SNAKE[0][2] = 'up';
    }
    if ((this.input.isPressed('ArrowDown') || this.input.isPressed('s')) && snakeOnGrid && SNAKE[0][2] != 'up') {
      SNAKE[0][2] = 'down';
    }
    if ((this.input.isPressed('ArrowLeft') || this.input.isPressed('a')) && snakeOnGrid && SNAKE[0][2] != 'right') {
      SNAKE[0][2] = 'left';
    }
    if ((this.input.isPressed('ArrowRight') || this.input.isPressed('d')) && snakeOnGrid && SNAKE[0][2] != 'left') {
      SNAKE[0][2] = 'right';
    }

    // --- Update will go here later ---
    if (this.timeElapsed > 25) {
      if (this.moveSnake() == 1){
        this.timeElapsed = 0;
      }
      else {
        this.renderer.drawGameOver();
        return;
      }
    }
    
    // --- Render the scene ---
    this.renderer.drawBoard(BOARD, this.SNAKE_HEAD_X, this.SNAKE_HEAD_Y, SNAKE);

    requestAnimationFrame(this.loop);
  };
}