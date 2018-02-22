
class Background {
  constructor(game, options) {
    const {
      topColor,
      middleColor,
      bottomColor
    } = options;

    const bitmap = game.add.bitmapData(game.width, game.height);
    const gradient = bitmap.context.createLinearGradient(
      0, 0, // Start gradient
      0, game.height // Stop gradient
    );
    gradient.addColorStop(0.00, topColor);
    gradient.addColorStop(0.30, middleColor);
    gradient.addColorStop(1.00, bottomColor);
    bitmap.context.fillStyle = gradient;
    bitmap.context.fillRect(0, 0, game.width, game.height);

    game.add.sprite(0, 0, bitmap);
  }
}

export default Background;
