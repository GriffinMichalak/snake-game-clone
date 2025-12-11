const LIGHT_GREEN = "#aad751" // google light green
const DARK_GREEN = "#a2d149" // google dark green
const OUTLINE_GREEN = "#578a34"
const MENU_GREEN = "#4a752c"
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
    this.ctx.fillStyle = LIGHT_GREEN;
    this.ctx.fillRect(margin, margin, this.width - 2 * margin, this.height - 2 * margin);
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

