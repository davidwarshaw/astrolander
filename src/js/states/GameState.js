import Phaser from 'phaser';

import Background from '../prefabs/Background';
import Ground from '../prefabs/Ground';
import Pad from '../prefabs/Pad';
import Lander from '../prefabs/Lander';
import Gauges from '../prefabs/Gauges';

import LevelParameters from '../LevelParameters';

import Properties from '../Properties';

class GameState extends Phaser.State {

  init(playState) {
    this.playState = playState;

    this.background = null;
    this.ground = null;
    this.launchingPad = null;
    this.landingPad = null;
    this.lander = null;
    this.gauges = null;
  }

  create() {

    // Get the level info from the play state
    const { level, maxLevels } = this.playState;
    this.level = level;

    this.textStyle = Properties.textStyle;
    this.detailStyle = Properties.detailStyle;

    const levelParams = new LevelParameters(level, maxLevels);

    this.game.physics.startSystem(Phaser.Physics.P2JS);
    this.game.physics.p2.gravity.y = 100;
    this.game.physics.p2.restitution = 0.8;
    this.game.physics.p2.setBoundsToWorld(true, true, true, true, true);

    this.background = new Background(this.game, levelParams.backgroundOptions);
    this.gauges = new Gauges(this.game, this.playState);
    this.ground = new Ground(this.game, levelParams.random,
      levelParams.groundOptions);

    this.launchingPad = new Pad(this.game, this.ground.launchingLocation,
      false);
    this.landingPad = new Pad(this.game, this.ground.landingLocation,
      true);

    // Bind lander callbacks
    this.landerExplodes = this.landerExplodes.bind(this);
    this.landerLands = this.landerLands.bind(this);

    // Pass in gauges and lander explodes callbackn
    const landerStartingLocation = this.ground.launchingLocation;
    landerStartingLocation.y = landerStartingLocation.y - 25;
    landerStartingLocation.x = landerStartingLocation.x +
      (this.launchingPad.width / 2);
    this.lander = new Lander(this.game, levelParams.fuelMax,
      landerStartingLocation, this.gauges,
      this.landerExplodes, this.landerLands);

    // Lander and ground should collide with each other
    this.game.physics.p2.updateBoundsCollisionGroup(true);

    const collisionGroups = [
      this.lander.collisionGroup,
      this.ground.collisionGroup,
      this.launchingPad.collisionGroup,
      this.landingPad.collisionGroup];
    this.lander.body.collides(collisionGroups);
    this.ground.body.collides(collisionGroups);
    this.launchingPad.body.collides(collisionGroups);
    this.landingPad.body.collides(collisionGroups);
  }

  render() {
    const { showDebugSpriteInfo } = Properties;

    // Handle debug mode.
    if (__DEV__ && showDebugSpriteInfo) {
      this.game.debug.spriteInfo(this.lander, 35, 500);
    }
  }

  update() {
  }

  landerExplodes() {
    const message = 'MISSION FAILURE';
    const levelOverText = this.game.add.text(0, 0, message, this.textStyle);
    levelOverText.setTextBounds(0, 0, this.game.width, this.game.height);

    // Retry the level
    const retry = () => this.state.start('LevelSplashState', true, false,
      this.playState);
    this.game.time.events.add(Phaser.Timer.SECOND * 2, retry, this);
  }

  landerLands() {
    const message = 'MISSION SUCCESS';
    const levelOverText = this.game.add.text(0, 0, message, this.textStyle);
    levelOverText.boundsAlignV = 'bottom';
    levelOverText.setTextBounds(0, 0, this.game.width,
      this.game.height * (3 / 5));

    // Set the next level
    this.playState.level = this.playState.level + 1;

    // Uprightness of lander as percent
    const fuelRemaining = 1 - (this.lander.fuel / this.lander.fuelMax);
    const softLanding = 1 - (this.lander.v / this.lander.safeLandingVelocity);
    const twoPi = 2 * Math.PI;
    const uprightness = 1 - Math.abs(this.lander.body.rotation / twoPi);

    // Tally the score
    this.fuelRemainingScore = Math.round(this.level * 300.0 * fuelRemaining);
    this.softLandingScore = Math.round(this.level * 200.0 * softLanding);
    this.uprightnessScore = Math.round(this.level * 100.0 * uprightness);
    this.levelScore = this.fuelRemainingScore + this.softLandingScore +
      this.uprightnessScore;
    this.playState.score = this.playState.score + this.levelScore;

    // Save the score and the level in local storage
    localStorage.setItem('level', this.playState.level);
    localStorage.setItem('score', this.playState.score);

    // Show the score after a second
    this.game.time.events.add(Phaser.Timer.SECOND * 1.5, this.showScore, this);
  }

  showScore() {
    const scoreLabels = [['FUEL REMAINING BONUS'], ['SOFT LANDING BONUS'],
      ['UPRIGHT LANDER BONUS'], ['TOTAL SCORE']];
    const scoreValues = [[this.fuelRemainingScore], [this.softLandingScore],
      [this.uprightnessScore], [this.levelScore]];
    const scoreLabelsText = this.game.add.text(0, 0, '', this.detailStyle);
    const scoreValuesText = this.game.add.text(0, 0, '', this.detailStyle);
    const upperTextBound = (this.game.height * (1 / 2)) -
      this.textStyle.fontSize - 20;
    scoreLabelsText.boundsAlignH = 'right';
    scoreLabelsText.align = 'right';
    scoreLabelsText.setTextBounds(
      0, upperTextBound,
      (this.game.width * (5 / 8)) - 10, this.game.height);
    scoreValuesText.boundsAlignH = 'left';
    scoreValuesText.align = 'right';
    scoreValuesText.setTextBounds(
      (this.game.width * (5 / 8)) + 10, upperTextBound,
      this.game.width, this.game.height);
    scoreLabelsText.parseList(scoreLabels);
    scoreValuesText.parseList(scoreValues);

    // Go to the next level's splash screen after a few seconds
    this.game.time.events.add(Phaser.Timer.SECOND * 4, this.nextLevel, this);
  }

  nextLevel() {
    const nextState = this.playState.level <= this.playState.maxLevels ?
      'LevelSplashState' :
      'GameWinState';
    this.state.start(nextState, true, false, this.playState);
  }
}

export default GameState;
