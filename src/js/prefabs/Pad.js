import Phaser from 'phaser';

class Pad extends Phaser.Sprite {
  constructor(game, location, isLanding) {
    super(game, location.x + (location.width / 2), location.y, 'pad', 0);

    this.animations.add('still', [0], 1, true);
    this.animations.play('still');

    this.width = location.width;

    game.add.existing(this);

    // Set up physics
    game.physics.enable(this, Phaser.Physics.P2JS, false);

    // The collision group
    this.collisionGroup = game.physics.p2.createCollisionGroup();
    this.body.setCollisionGroup(this.collisionGroup);
    this.body.kinematic = true;

    this.body.isLanding = isLanding;
  }

}

export default Pad;
