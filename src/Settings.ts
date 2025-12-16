export const BOARD_HEIGHT = 15;
export const BOARD_WIDTH = 17;

export const START_X = 3; // zero-indexed
export const START_Y = 7; // zero-indexed

// speeds
const SLOW_SPEED = 20;
const NORMAL_SPEED = 30;
const FAST_SPEED = 15;

let SPEED = 15;

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
  });

  export { SPEED };