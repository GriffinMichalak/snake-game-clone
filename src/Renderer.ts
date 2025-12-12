import { Colors } from "./Colors.js";

const BOARD_HEIGHT = 15;
const BOARD_WIDTH = 17;

const START_X = 3; // zero-indexed
const START_Y = 7; // zero-indexed

const margin = 23;
export class Renderer {
  constructor(
    private ctx: CanvasRenderingContext2D,
    private width: number,
    private height: number,
  ) {
  }

  drawBoard(board: number[][], snake_x: number, snake_y:number) {
    // board outline
    this.ctx.fillStyle = Colors.OUTLINE_GREEN;
    this.ctx.fillRect(0, 0, this.width, this.height);

    // tiled board
    const grid_height = this.height - 2 * margin;
    const grid_width = this.width - 2 * margin;

    const cell_height = (grid_height) / BOARD_HEIGHT;
    const cell_width = (grid_width) / BOARD_WIDTH;

    let isLightGreen = true;

    // draw grid
    for (let row = 0; row < BOARD_HEIGHT; row++) {
      for (let col = 0; col < BOARD_WIDTH; col++) {
        const x = margin + col * cell_width;
        const y = margin + row * cell_height;
        isLightGreen = !isLightGreen;
        if (board[row][col] == 0) {
          // draw grid background
          this.ctx.fillStyle = isLightGreen ? Colors.LIGHT_GREEN : Colors.DARK_GREEN;
          this.ctx.fillRect(x, y, cell_width, cell_height);
        }
        else if (board[row][col] == 1) {
          // draw food
          this.ctx.fillStyle = Colors.FOOD_COLOR;
          this.ctx.fillRect(x, y, cell_width, cell_height);
        }
        this.drawSnake(margin + snake_x * cell_width, margin + snake_y * cell_height, cell_width, cell_height);
      }
    }
  }

  drawSnake(x: number, y: number, cell_width: number, cell_height: number) {
    this.ctx.fillStyle = Colors.SNAKE_COLOR;
    this.ctx.fillRect(x, y, cell_width, cell_height);
  }

  drawGameOver() {
    this.ctx.fillStyle = 'white';
    this.ctx.fillRect(100, 100, 100, 100);
  }

  clear() {
    this.ctx.fillStyle = Colors.LIGHT_GREEN;
    this.ctx.fillRect(0, 0, this.width, this.height);
  }

  drawPlaceholder() {
    this.ctx.fillStyle = 'white';
    this.ctx.fillRect(100, 100, 100, 100);
  }
}

