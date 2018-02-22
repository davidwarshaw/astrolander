import Phaser from 'phaser';

import Background from '../prefabs/Background';
import Properties from '../Properties';

class MainMenuState extends Phaser.State {

  init(playState) {
    this.playState = playState;
    this.background = null;
  }

  create() {
    // Get the level info from the play state
    this.score = this.playState.score;

    this.textStyle = Properties.textStyle;
    this.detailStyle = Properties.detailStyle;

    // Randomize the the hue of the main screen
    this.random = new Phaser.RandomDataGenerator([this.score]);
    const h = this.random.between(0, 360);
    const backgroundOptions = {
      topColor: `hsl(${h}, 90%, 50%)`,
      middleColor: `hsl(${h}, 90%, 70%)`,
      bottomColor: `hsl(${h}, 90%, 90%)`
    };
    this.background = new Background(this.game, backgroundOptions);

    const message = 'ALL MISSIONS\nSUCCESSFUL';
    const splashText = this.game.add.text(0, 0, message, this.textStyle);
    splashText.setTextBounds(0, 0, this.game.width, this.game.height * (2 / 3));

    // Reset the score and the level in local storage
    localStorage.setItem('level', 1);
    localStorage.setItem('score', 0);

    // Set the new high score if necessary
    this.highScore = localStorage.getItem('highScore') || 0;
    if (this.score > this.highScore) {
      this.newHighScore = true;
      localStorage.setItem('highScore', this.score);
    }

    const backToMainMenu = () => this.state.start('MainMenuState', true, false);
    this.game.input.keyboard.onPressCallback = backToMainMenu;

    this.game.time.events.add(Phaser.Timer.SECOND * 1, this.showScoreText,
      this);

  }

  showScoreText() {
    const scoreMessage = this.newHighScore ?
      `${this.score}\nNEW HIGH SCORE` :
      `SCORE ${this.score}\nHIGH SCORE ${this.highScore}`;
    const scoreText = this.game.add.text(0, 0, scoreMessage, this.detailStyle);
    const upperTextBound = this.game.height * (1 / 4);
    scoreText.setTextBounds(0, upperTextBound, this.game.width,
      this.game.height);
  }

}

export default MainMenuState;
