import { Renderer } from "./Renderer.js";
import { Input } from "./Input.js";

export class Game {
  private lastTime = 0;
  private renderer: Renderer;
  private input: Input;

  constructor(
    private canvas: HTMLCanvasElement,
    private ctx: CanvasRenderingContext2D
  ) {
    this.renderer = new Renderer(ctx, canvas.width, canvas.height);
    this.input = new Input();
  }

  start() {
    requestAnimationFrame(this.loop);
  }

  private loop = (timestamp: number) => {
    const deltaTime = timestamp - this.lastTime;
    this.lastTime = timestamp;

    // --- Update will go here later ---
    
    // --- Render the scene ---
    this.renderer.drawBoard()

    requestAnimationFrame(this.loop);
  };
}

