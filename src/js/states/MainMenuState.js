import Phaser from 'phaser';

import Background from '../prefabs/Background';
import Properties from '../Properties';

class MainMenuState extends Phaser.State {
  init() {
    this.background = null;
  }

  create() {
    // Reset the play state
    const playState = {
      level: localStorage.getItem('level') || 1,
      maxLevels: 80,
      score: localStorage.getItem('score') || 0,
      totalTime: 0
    };

    this.playState = playState;
    console.log(this.playState);

    this.textStyle = Properties.textStyle;
    this.detailStyle = Properties.detailStyle;

    // Randomize the the hue of the main screen
    this.random = new Phaser.RandomDataGenerator([1]);
    const h = this.random.between(0, 360);
    const backgroundOptions = {
      topColor: `hsl(${h}, 90%, 50%)`,
      middleColor: `hsl(${h}, 90%, 70%)`,
      bottomColor: `hsl(${h}, 90%, 90%)`
    };
    this.background = new Background(this.game, backgroundOptions);

    const message = 'ASTRO LANDER';
    const splashText = this.game.add.text(0, 0, message, this.textStyle);
    splashText.setTextBounds(0, 0, this.game.width, this.game.height * (1 / 3));

    const firstLevel = () => this.state.start('LevelSplashState', true, false,
      playState);
    this.game.input.keyboard.onPressCallback = firstLevel;

    this.game.time.events.add(Phaser.Timer.SECOND * 2, this.showHelpText,
      this);

  }

  showHelpText() {
    const helpPreamble = `
      UP FOR THRUST
      LEFT AND RIGHT TO ROTATE
      LAND SOFTLY
      WATCH YOUR FUEL

    `;
    const helpMessage = this.playState.level === 1 ?
      helpPreamble + 'PRESS ANY KEY TO BEGIN' :
      helpPreamble + `PRESS ANY KEY TO CONTINUE LEVEL ${this.playState.level}`;
    const helpText = this.game.add.text(0, 0, helpMessage, this.detailStyle);
    const upperTextBound = (this.game.height * (1 / 3)) -
      this.textStyle.fontSize - 10;
    helpText.setTextBounds(-40, upperTextBound, this.game.width,
      this.game.height);
  }
}

export default MainMenuState;
