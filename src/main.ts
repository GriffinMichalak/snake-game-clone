import { Game } from "./Game.js";

window.addEventListener("load", () => {
  const canvas = document.getElementById("gameCanvas") as HTMLCanvasElement;
  const ctx = canvas.getContext("2d");

  if (!ctx) {
    throw new Error("Could not get canvas context");
  }

  const game = new Game(canvas, ctx);

  const playBtn = document.getElementById('play-btn');
  const modal = document.getElementById('modal');
  if (modal instanceof HTMLDialogElement) {
    modal.showModal();
    modal.style.display = 'flex';
  }

  playBtn!.addEventListener('click', () => {
      if (modal instanceof HTMLDialogElement) {
          modal.close();
          modal.style.display = 'none';
      }
  });

  game.start();
});

