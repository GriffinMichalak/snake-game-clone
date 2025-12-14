import { Renderer } from "./Renderer.js";
import { Input } from "./Input.js";


const BOARD_HEIGHT = 15;
const BOARD_WIDTH = 17;

const START_X = 3; // zero-indexed
const START_Y = 7; // zero-indexed

let BOARD: number[][] = Array.from({ length: BOARD_HEIGHT }, () => Array(BOARD_WIDTH).fill(0));
let SNAKE: any[][];

const directionChanges = new Map();

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
    SNAKE = [[START_Y, START_X, 'right']];
  }
  
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
    this.renderer.drawBoard(BOARD, SNAKE[0][1], SNAKE[0][0], SNAKE);
    document.addEventListener('keydown', (event) => {
      if (MOVE_KEYS.includes(event.key)) {
        requestAnimationFrame(this.loop);
      }
    });
  }

  moveSnake() {
    const newDirection = SNAKE[0][2];
    const headKey = `${SNAKE[0][0]},${SNAKE[0][1]}`;
    directionChanges.set(headKey, SNAKE[0][2]);

    const snakeOnEdge: boolean = (
      (newDirection == 'up' && !(SNAKE[0][0] > 0)) ||
      (newDirection == 'down' && !(SNAKE[0][0] < BOARD_HEIGHT - 1)) ||
      (newDirection == 'left' && !(SNAKE[0][1] > 0)) || 
      (newDirection == 'right' && !(SNAKE[0][1] < BOARD_WIDTH - 1))
    );

    if (snakeOnEdge) {
      return -1;
    }

    else {
      switch (SNAKE[0][2]) {
        case 'up':
          SNAKE[0][0] -= 0.25;
          break;
        case 'down':
          SNAKE[0][0] += 0.25;
          break;
        case 'left':
          SNAKE[0][1] -= 0.25;
          break;
        case 'right':
          SNAKE[0][1] += 0.25;
          break;
      }
      this.renderer.drawBoard(BOARD, SNAKE[0][1], SNAKE[0][0], SNAKE);
      return 1;
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
    if (this.timeElapsed > 20) {
      if (this.moveSnake() == 1){
        this.timeElapsed = 0;
      }
      else {
        this.renderer.drawGameOver();
        return;
      }
    }
    
    // --- Render the scene ---
    this.renderer.drawBoard(BOARD, SNAKE[0][1], SNAKE[0][0], SNAKE);

    requestAnimationFrame(this.loop);
  };
}