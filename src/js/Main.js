import 'pixi';
import 'p2';
import Phaser from 'phaser';
import Stats from 'stats.js';
import '../css/game.css';
import '../css/fontLoader.css';

import Properties from './Properties';
import BootState from './states/BootState';
import PreloaderState from './states/PreloaderState';
import MainMenuState from './states/MainMenuState';
import LevelSplashState from './states/LevelSplashState';
import GameState from './states/GameState';
import GameWinState from './states/GameWinState';

class Game extends Phaser.Game {

  constructor() {
    const {
      gameWidth,
      gameHeight,
      showStats
    } = Properties;

    // Create your Phaser game and inject it into the `#game-container` div.
    super(gameWidth, gameHeight, Phaser.CANVAS, 'game-container');

    // Add the States your game has.
    this.state.add('BootState', BootState);
    this.state.add('PreloaderState', PreloaderState);
    this.state.add('MainMenuState', MainMenuState);
    this.state.add('LevelSplashState', LevelSplashState);
    this.state.add('GameState', GameState);
    this.state.add('GameWinState', GameWinState);

    // Now start the Boot state.
    this.state.start('BootState');

    // Handle debug mode.
    if (__DEV__ && showStats) {
      this.setupStats();
    }
  }

  /**
   * Display the FPS and MS using Stats.js.
   */
  setupStats() {
    // Setup the new stats panel.
    const stats = new Stats();

    document.body.appendChild(stats.dom);

    // Monkey-patch the update loop so we can track the timing.
    const updateLoop = this.update;

    this.update = (...args) => {
      stats.begin();
      updateLoop.apply(this, args);
      stats.end();
    };
  }

}

window.game = new Game();
