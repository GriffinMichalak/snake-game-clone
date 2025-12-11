const LIGHT_GREEN = "#aad751" // google light green
const DARK_GREEN = "#a2d149" // google dark green
const OUTLINE_GREEN = "#578a34"
const MENU_GREEN = "#4a752c"

const BOARD_HEIGHT = 15;
const BOARD_WIDTH = 17;

const START_X = 3; // zero-indexed
const START_Y = 7; // zero-indexed
export class Renderer {
  constructor(
    private ctx: CanvasRenderingContext2D,
    private width: number,
    private height: number
  ) {}

  drawBoard() {
    // board outline
    this.ctx.fillStyle = OUTLINE_GREEN;
    this.ctx.fillRect(0, 0, this.width, this.height);

    // tiled board
    const margin = 23;

    const grid_height = this.height - 2 * margin;
    const grid_width = this.width - 2 * margin;

    const cell_height = (grid_height) / BOARD_HEIGHT;
    const cell_width = (grid_width) / BOARD_WIDTH;

    let isLightGreen = true;

    // draw grid
    for (let row = 0; row < BOARD_HEIGHT; row++) {
      for (let col = 0; col < BOARD_WIDTH; col++) {
        this.ctx.fillStyle = isLightGreen ? LIGHT_GREEN : DARK_GREEN;
        const x = margin + col * cell_width;
        const y = margin + row * cell_height;
        this.ctx.fillRect(x, y, cell_width, cell_height);
        isLightGreen = !isLightGreen;
      }
    }
  }

  clear() {
    this.ctx.fillStyle = LIGHT_GREEN;
    this.ctx.fillRect(0, 0, this.width, this.height);
  }

  drawPlaceholder() {
    this.ctx.fillStyle = "black";
    this.ctx.font = "20px Arial";
    this.ctx.fillText("Snake Game Placeholder", 20, 30);
  }
}

