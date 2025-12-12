import { Renderer } from "./Renderer.js";
import { Input } from "./Input.js";


const BOARD_HEIGHT = 15;
const BOARD_WIDTH = 17;

const START_X = 3; // zero-indexed
const START_Y = 7; // zero-indexed

let BOARD: number[][] = Array.from({ length: BOARD_HEIGHT }, () => Array(BOARD_WIDTH).fill(0));

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
  }
  SNAKE_X = START_X
  SNAKE_Y = START_Y

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
    this.renderer.drawBoard(BOARD, this.SNAKE_X, this.SNAKE_Y);
    document.addEventListener('keydown', (event) => {
      if (MOVE_KEYS.includes(event.key)) {
        requestAnimationFrame(this.loop);
      }
    });
  }

  moveRight() {
    if (this.SNAKE_X < BOARD_WIDTH) {
      this.SNAKE_X += 0.25;
      this.renderer.drawBoard(BOARD, this.SNAKE_X, this.SNAKE_Y);
    }
  }

  private loop = (timestamp: number) => {
    const deltaTime = timestamp - this.lastTime;
    this.lastTime = timestamp;
    this.timeElapsed += deltaTime;

    // --- Update will go here later ---
    if (this.timeElapsed > 50) {
      this.moveRight();
      this.timeElapsed = 0;
    }
    
    // --- Render the scene ---
    this.renderer.drawBoard(BOARD, this.SNAKE_X, this.SNAKE_Y);

    requestAnimationFrame(this.loop);
  };
}