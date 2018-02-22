class LevelParameters {
  constructor(level, maxLevels) {

    this.random = new Phaser.RandomDataGenerator([level]);

    // Hue of level is based on level number
    const h = (30 * level) % 360;

    this.backgroundOptions = {
      topColor: `hsl(${h}, 90%, 50%)`,
      middleColor: `hsl(${h}, 90%, 70%)`,
      bottomColor: `hsl(${h}, 90%, 90%)`
    };

    const hComplement = (h + 180) % 360;
    const hcRgb = Phaser.Color.HSLtoRGB(hComplement / 360, 1.0, 0.8);
    this.groundOptions = {
      color: hcRgb.color,
      numSegments: 8 + Math.round((level / maxLevels) * 100),
      roughness: level * 10
    };

    // Lander max fuel is based on level number
    this.fuelMax = 150 + ((100 - level) * 5);

  }
}

export default LevelParameters;
