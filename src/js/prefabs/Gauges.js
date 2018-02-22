import HealthBar from './HealthBar';
import Properties from '../Properties';

class Gauges {
  constructor(game, playState) {

    this.graphics = game.add.graphics(0, 0);

    const { score, level } = playState;

    // Gauges screen positioning
    const leftMargin = 20;
    const topMargin = 20;
    const fontHeight = 20;
    const spacing = 10;

    // Label styling
    this.labelStyle = Object.assign({}, Properties.textStyle);
    this.labelStyle.fontSize = fontHeight;
    this.labelStyle.strokeThickness = fontHeight / 10;

    // Colors
    this.dangerColor = '#ff5050';
    this.safeColor = '#ccffcc';
    this.neutralColor = '#666699';

    // Fuel gauge
    const fuelLabelTop = topMargin;
    const fuelWidth = 640;
    const fuelHeight = 20;
    const fuelTop = fuelLabelTop + spacing + fontHeight;
    const fuelBarConfig = {
      width: fuelWidth,
      height: fuelHeight,
      x: leftMargin,
      y: fuelTop,
      bg: {
        color: this.dangerColor
      },
      bar: {
        color: this.safeColor
      },
      animationDuration: 1,
      flipped: false
    };
    this.fuelBar = new HealthBar(game, fuelBarConfig);

    // Speedometer
    const speedoLabelTop = fuelTop + spacing + fontHeight;
    const speedoWidth = 640;
    const speedoHeight = 20;
    const speedoTop = speedoLabelTop + spacing + fontHeight;
    const speedoBarConfig = {
      width: speedoWidth,
      height: speedoHeight,
      x: leftMargin,
      y: speedoTop,
      bg: {
        color: this.neutralColor
      },
      bar: {
        color: this.speedSafeColor
      },
      animationDuration: 1,
      flipped: false
    };
    this.speedoBar = new HealthBar(game, speedoBarConfig);

    // Draw the fuel gauge frame and label
    this.fuelLable = game.add.text(leftMargin, fuelLabelTop, 'FUEL',
      this.labelStyle);

    // Draw the speedo frame and label
    this.speedoLable = game.add.text(leftMargin, speedoLabelTop, 'SPEED',
      this.labelStyle);

    // Draw the current score and level
    this.speedoLable = game.add.text(game.width * (3 / 5), fuelLabelTop,
      `SCORE ${score}`, this.labelStyle);
    this.speedoLable = game.add.text(game.width * (3 / 5), speedoLabelTop,
      `LEVEL ${level}`, this.labelStyle);
  }

  updateFuel(fuel, fuelMax) {
    this.fuelBar.setPercent(100 * (fuel / fuelMax));
  }

  updateSpeedo(speed, speedMax, safeLandingSpeed) {
    if (speed <= safeLandingSpeed) {
      this.speedoBar.setBarColor(this.safeColor);
    }
    else {
      this.speedoBar.setBarColor(this.dangerColor);
    }
    this.speedoBar.setPercent(100 * (speed / speedMax));
  }
}

export default Gauges;
