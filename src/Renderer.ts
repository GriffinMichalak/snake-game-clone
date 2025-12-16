import { Colors } from "./Constants.js";
import { BOARD_HEIGHT, BOARD_WIDTH, SNAKE_COLOR } from "./Settings.js";

const MARGIN = 23;
export class Renderer {
  constructor(
    private ctx: CanvasRenderingContext2D,
    private width: number,
    private height: number,
  ) {
  }

  drawBoard(board: number[][], snake: number[][]) {
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
        this.ctx.fillStyle = isLightGreen ? Colors.LIGHT_GREEN : Colors.DARK_GREEN;
        this.ctx.fillRect(x, y, cell_width, cell_height);
        // draw grid background
        if (board[row][col] == 1) {
          // draw food
          const img = new Image();
          img.src = "media/images/apple.png";
          if (img.complete) {
            const w = cell_width * 0.75;
            const h = cell_height * 0.9;
            this.ctx.drawImage(img, x + (cell_width - w)/2, y + (cell_height - h)/2, w, h);
          } else {
            img.onload = () => {
              this.ctx.drawImage(img, x, y, cell_width, cell_height);
            };
            this.ctx.fillStyle = Colors.FOOD_COLOR;
            this.ctx.fillRect(x, y, cell_width, cell_height);
          }
        }
      }
    }

    this.drawSnake(cell_width, cell_height, snake);
  }

  drawSnake(cell_width: number, cell_height: number, snake: any[][]) {
    this.ctx.fillStyle = SNAKE_COLOR;

    snake.forEach((cell) => {
      this.ctx.fillRect(MARGIN + cell[1] * cell_width, MARGIN + cell[0] * cell_height, cell_width, cell_height);
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

