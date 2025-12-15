import { Colors, BOARD_HEIGHT, BOARD_WIDTH } from "./Constants.js";

const MARGIN = 23;
export class Renderer {
  constructor(
    private ctx: CanvasRenderingContext2D,
    private width: number,
    private height: number,
  ) {
  }

  drawBoard(board: number[][], snake_x: number, snake_y: number, snake: number[][]) {
    // board outline
    this.ctx.fillStyle = Colors.OUTLINE_GREEN;
    this.ctx.fillRect(0, 0, this.width, this.height);

    // tiled board
    const grid_height = this.height - 2 * MARGIN;
    const grid_width = this.width - 2 * MARGIN;

    const cell_height = (grid_height) / BOARD_HEIGHT;
    const cell_width = (grid_width) / BOARD_WIDTH;

    let isLightGreen = false;

    // draw grid
    for (let row = 0; row < BOARD_HEIGHT; row++) {
      for (let col = 0; col < BOARD_WIDTH; col++) {
        const x = MARGIN + col * cell_width;
        const y = MARGIN + row * cell_height;
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
        this.drawSnake(snake_x, snake_y, cell_width, cell_height, MARGIN, snake);
      }
    }
  }

  drawSnake(x: number, y: number, cell_width: number, cell_height: number, margin: number, snake: number[][]) {
    this.ctx.fillStyle = Colors.SNAKE_COLOR;

    snake.forEach((cell) => {
      this.ctx.fillRect(MARGIN + cell[1] * cell_height, MARGIN + cell[0] * cell_width, cell_width, cell_height);
    })
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

