export class Renderer {
  constructor(
    private ctx: CanvasRenderingContext2D,
    private width: number,
    private height: number
  ) {}

  clear() {
    this.ctx.fillStyle = "black";
    this.ctx.fillRect(0, 0, this.width, this.height);
  }

  drawPlaceholder() {
    this.ctx.fillStyle = "#0f0";
    this.ctx.font = "20px Arial";
    this.ctx.fillText("Snake Game Placeholder", 20, 30);
  }
}

