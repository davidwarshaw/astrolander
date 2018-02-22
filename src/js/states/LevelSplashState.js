import Phaser from 'phaser';

import Background from '../prefabs/Background';
import Ground from '../prefabs/Ground';
import Pad from '../prefabs/Pad';

import LevelParameters from '../LevelParameters';

import Properties from '../Properties';

class LevelSplashState extends Phaser.State {

  init(playState) {
    this.playState = playState;

    this.background = null;
    this.ground = null;
    this.launchingPad = null;
    this.landingPad = null;
  }

  create() {

    // Get the level info from the play state
    const { level, maxLevels } = this.playState;

    this.textStyle = Properties.textStyle;

    const levelParams = new LevelParameters(level, maxLevels);

    this.game.physics.startSystem(Phaser.Physics.P2JS);
    this.game.physics.p2.gravity.y = 100;
    this.game.physics.p2.restitution = 0.8;
    this.game.physics.p2.setBoundsToWorld(true, true, true, true, true);

    this.background = new Background(this.game, levelParams.backgroundOptions);
    this.ground = new Ground(this.game, levelParams.random,
      levelParams.groundOptions);

    this.launchingPad = new Pad(this.game, this.ground.launchingLocation,
      false);
    this.landingPad = new Pad(this.game, this.ground.landingLocation,
      true);


    const message = 'Level ' + level;
    const splashText = this.game.add.text(0, 0, message, this.textStyle);
    splashText.setTextBounds(0, 0, this.game.width, this.game.height);

    const theGame = () => this.state.start('GameState', true, false,
      this.playState);

    this.game.time.events.add(Phaser.Timer.SECOND * 2, theGame, this);
  }
}

export default LevelSplashState;
