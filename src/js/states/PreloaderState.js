import Phaser from 'phaser';

import pad from '../../images/spritesheet/pad_sheet.png';
import lander from '../../images/spritesheet/lander_sheet.png';

class PreloaderState extends Phaser.State {
  init() {
    // Honestly, just about anything could go here.
    // It's YOUR game after all. Eat your heart out!
  }

  preload() {
    this.load.spritesheet('pad', pad, 42, 10);
    this.load.spritesheet('lander', lander, 48, 48);

    // HACK TO PRELOAD A CUSTOM FONT
    this.game.add.text(0, 0, 'dummy text',
      { font: '1px mob200', fill: '#ffffff' });
  }

  create() {
    this.state.start('MainMenuState');
  }
}

export default PreloaderState;
