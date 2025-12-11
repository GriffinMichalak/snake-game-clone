const LIGHT_GREEN = "#aad751" // google light green
const DARK_GREEN = "#a2d149" // google dark green
const OUTLINE_GREEN = "#578a34"
const MENU_GREEN = "#4a752c"

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
    this.foodPos = [
      Math.floor(Math.random() * BOARD_HEIGHT), 
      Math.floor(Math.random() * BOARD_WIDTH)
    ]
  }

  private foodPos: number[]; 

  drawBoard() {
    // board outline
    this.ctx.fillStyle = OUTLINE_GREEN;
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
        if (row == this.foodPos[0] && col == this.foodPos[1]) {
          this.ctx.fillStyle = 'red';
          this.ctx.fillRect(x, y, cell_width, cell_height);
          continue;
        }
        this.ctx.fillStyle = isLightGreen ? LIGHT_GREEN : DARK_GREEN;
        this.ctx.fillRect(x, y, cell_width, cell_height);
        isLightGreen = !isLightGreen;
      }
    }
  }

  spawnFood() {
    const x = Math.floor(Math.random() * (BOARD_HEIGHT));
    const y = Math.floor(Math.random() * (BOARD_WIDTH));
    const grid_height = this.height - 2 * margin;
    const grid_width = this.width - 2 * margin;

    const cell_height = (grid_height) / BOARD_HEIGHT;
    const cell_width = (grid_width) / BOARD_WIDTH;

    this.ctx.fillStyle = 'red';
    const x_pos = margin + x * cell_width;
    const y_pos = margin + y * cell_height;
    this.ctx.fillRect(x_pos, y_pos, cell_width, cell_height);
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

