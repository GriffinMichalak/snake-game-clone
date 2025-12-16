export const START_X = 3; // zero-indexed
export const START_Y = 7; // zero-indexed

let SPEED = 15;
let SNAKE_COLOR = "#4674ea";

let BOARD_HEIGHT = 15;
let BOARD_WIDTH = 17;

window.addEventListener("load", () => {
    const mainModal = document.getElementById('modal');

    const settingsBtn = document.getElementById('settings-btn');
    const settingsModal = document.getElementById('settings-modal');
    const settingsBack = document.getElementById('settings-back');
  
    settingsBtn!.addEventListener('click', () => {
      if (settingsModal instanceof HTMLDialogElement && mainModal instanceof HTMLDialogElement) {
        settingsModal.showModal();
        settingsModal.style.display = 'flex';

        mainModal.close();
        mainModal.style.display = 'none';
      }
    });

    settingsBack!.addEventListener('click', () => {
      if (settingsModal instanceof HTMLDialogElement && mainModal instanceof HTMLDialogElement) {
        settingsModal.close();
        settingsModal.style.display = 'none';

        mainModal.showModal();
        mainModal.style.display = 'flex';
      }
    });

    // speed updates
    const speedSelect = document.getElementById('speed-select') as HTMLSelectElement | null;
    const updateSpeed = () => {
      const selectedSpeed = speedSelect?.value;
      switch (selectedSpeed) {
          case 'slow':
            SPEED = 45;
            break;
          case 'normal':
            SPEED = 30;
            break;
          case 'fast':
            SPEED = 15;
            break;
      }
    };
    updateSpeed();
    speedSelect?.addEventListener('change', updateSpeed);

    // snake color updates
    const colorSelect = document.getElementById('color-select') as HTMLSelectElement | null;
    const updateColor = () => {
      const selectedColor = colorSelect?.value;
      switch (selectedColor) {
          case 'blue':
            SNAKE_COLOR = "#4674ea";
            break;
          case 'lightblue':
            SNAKE_COLOR = "#1ad7e6";
            break;
          case 'purple':
            SNAKE_COLOR = "#b449f2";
            break;
          case 'pink':
            SNAKE_COLOR = "#eb46b6";
            break;
          case 'redorange':
            SNAKE_COLOR = "#f24044";
            break;
          case 'orange':
            SNAKE_COLOR = "#f49c40";
            break;
          case 'yellow':
            SNAKE_COLOR = "#ead51d";
            break;
          case 'green':
            SNAKE_COLOR = "#37bc45";
            break;
          case 'gray':
            SNAKE_COLOR = "#6a6c6d";
            break;
          case 'white':
            SNAKE_COLOR = "#eaeced";
            break;
      }
    };
    updateColor();
    colorSelect?.addEventListener('change', updateColor);

    // grid size updates
    // const gridSelect = document.getElementById('grid-select') as HTMLSelectElement | null;
    // const updateGrid = () => {
    //   const selectedGrid = gridSelect?.value;
    //   switch (selectedGrid) {
    //       case 'small':
    //         BOARD_HEIGHT = 9;
    //         BOARD_WIDTH = 10;
    //         break;
    //       case 'medium':
    //         BOARD_HEIGHT = 15;
    //         BOARD_WIDTH = 17;
    //         break;
    //       case 'large':
    //         BOARD_HEIGHT = 21;
    //         BOARD_WIDTH = 24;
    //         break;
    //   }
    // };
    // updateGrid();
    // gridSelect?.addEventListener('change', updateGrid);
  });

  export { SPEED, SNAKE_COLOR, BOARD_HEIGHT, BOARD_WIDTH };