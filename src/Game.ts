import { Renderer } from "./Renderer.js";
import { Input } from "./Input.js";


const BOARD_HEIGHT = 15;
const BOARD_WIDTH = 17;

const START_X = 3; // zero-indexed
const START_Y = 7; // zero-indexed

let BOARD: number[][] = Array.from({ length: BOARD_HEIGHT }, () => Array(BOARD_WIDTH).fill(0));
let SNAKE: any[][];

const directionChanges = new Map();
const MOVE_KEYS: string[] = ['ArrowUp', 'ArrowDown', 'ArrowLeft', 'ArrowRight', 'w', 'a', 's', 'd'];

export class Game {
  private lastTime = 0;
  private renderer: Renderer;
  private input: Input;
  private timeElapsed: number;
  private moveProgress: number = 0;
  private direction: string = 'right';
  private gameOver: boolean = false;
  private foodCoord = this.generateFood([[START_X, START_Y]]);

  constructor(
    private canvas: HTMLCanvasElement,
    private ctx: CanvasRenderingContext2D
  ) {
    this.renderer = new Renderer(ctx, canvas.width, canvas.height);
    this.input = new Input();
    this.timeElapsed = 0;
    BOARD[this.foodCoord[1]][this.foodCoord[0]] = 1;

    SNAKE = [[START_Y, START_X], [START_Y, START_X - 1], [START_Y, START_X - 2]];
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
    SNAKE.push([-10,-10]);
  }

  start() {
    this.renderer.drawBoard(BOARD, SNAKE[0][1], SNAKE[0][0], SNAKE);
    document.addEventListener('keydown', (event) => {
      if (MOVE_KEYS.includes(event.key)) {
        requestAnimationFrame(this.loop);
      }
    });
  }

  snakeOverlap(): boolean {
    for (let i = 1; i < SNAKE.length; i++) {
      const cell = SNAKE[i];
      if (SNAKE[0][0] == cell[0] && SNAKE[0][1] == cell[1]) {
        return true;
      }
    }
    return false;
  }

  moveSnake() {
    const snakeOnEdge: boolean = (
      (this.direction == 'up' && !(SNAKE[0][0] > 0)) ||
      (this.direction == 'down' && !(SNAKE[0][0] < BOARD_HEIGHT - 1)) ||
      (this.direction == 'left' && !(SNAKE[0][1] > 0)) || 
      (this.direction == 'right' && !(SNAKE[0][1] < BOARD_WIDTH - 1))
    );

    if (snakeOnEdge || this.snakeOverlap()) {
      return -1;
    }
    this.moveProgress += 0.25;

    if (this.moveProgress >= 1.0) {
      this.moveProgress -= 1.0; 
    }
    const headX = SNAKE[0][1];
    const headY = SNAKE[0][0];
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
    SNAKE.unshift(newHead); // add new head to the front of the array
    SNAKE.pop(); // remove the tail (unless growing, to be handled later)

    this.renderer.drawBoard(BOARD, newHead[1], newHead[0], SNAKE);
    return 1;
  }

  private loop = (timestamp: number) => {
    if (this.gameOver) {
      return;
    }

    const deltaTime = timestamp - this.lastTime;
    this.lastTime = timestamp;
    this.timeElapsed += deltaTime;

    const snakeOnGrid: boolean = SNAKE[0][0] % 1 == 0 && SNAKE[0][1] % 1 == 0;

    if (snakeOnGrid && SNAKE[0][0] == this.foodCoord[1] && SNAKE[0][1] == this.foodCoord[0]) {
      BOARD[this.foodCoord[1]][this.foodCoord[0]] = 0;
      this.growSnake();
      this.foodCoord = this.generateFood(SNAKE);
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

    // --- Update will go here later ---
    if (this.timeElapsed > 60) {
      if (this.moveSnake() == 1){
        this.timeElapsed = 0;
      }
      else {
        this.renderer.drawGameOver();
        this.gameOver = true;
        return;
      }
    }
    
    // --- Render the scene ---
    this.renderer.drawBoard(BOARD, SNAKE[0][1], SNAKE[0][0], SNAKE);

    requestAnimationFrame(this.loop);
  };
}