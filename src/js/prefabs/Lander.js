import Phaser from 'phaser';

class Lander extends Phaser.Sprite {
  constructor(game, fuelMax, startingLocation, gauges,
    failureCallback, successCallback) {
    super(game, startingLocation.x, startingLocation.y, 'lander', 0);

    this.gauges = gauges;

    this.thrustSpeed = 200;
    this.rotationSpeed = 75;
    this.safeLandingVelocity = 50;
    this.bigBurnRate = 0.4;
    this.smallBurnRate = 0.8;

    this.fuelMax = fuelMax;
    this.fuel = this.fuelMax;
    this.vMax = 250;
    this.v = 0;

    this.stopped = false;

    this.anchor.setTo(0.5, 0);

    this.successCallback = successCallback;

    this.animations.add('still', [0], 1, true);
    this.animations.add('burn', [1], 1, true);
    this.animations.add('rotate', [2], 1, true);
    const explosionAnimation = this.animations.add('explode',
      [3, 4, 5, 6, 7, 8], 100, false);
    explosionAnimation.onComplete.add(failureCallback);

    this.animations.play('still');

    const scaleRatio = 1;
    this.scale.set(scaleRatio);

    game.add.existing(this);

    // Set up physics
    game.physics.enable(this, Phaser.Physics.P2JS, false);

    // Create the lander physics body
    this.body.clearShapes();
    this.body.addRectangle(16, 30, 0, 5);

    // The collision group
    this.collisionGroup = game.physics.p2.createCollisionGroup();
    this.body.setCollisionGroup(this.collisionGroup);
    this.body.onBeginContact.add(this.collideWithGround, this);

    this.cursors = game.input.keyboard.createCursorKeys();
  }

  update() {

    // Early exit if the lander has already stopped
    if (this.stopped) {
      return;
    }

    // Update the speedo with the speed of the lander
    this.v = new Phaser.Point(this.body.velocity.x, this.body.velocity.y)
      .getMagnitude();
    this.gauges.updateSpeedo(this.v, this.vMax, this.safeLandingVelocity);

    // Exit before controls if the lander is out of fuel
    if (this.fuel <= 0) {
      this.still();
      return;
    }

    // Set animation and reduce fuel based on lander controls
    if (this.cursors.up.isDown) {
      this.burn();
      this.gauges.updateFuel(this.fuel, this.fuelMax);
    }
    else if (this.cursors.left.isDown) {
      this.rotateLeft();
      this.gauges.updateFuel(this.fuel, this.fuelMax);
    }
    else if (this.cursors.right.isDown) {
      this.rotateRight();
      this.gauges.updateFuel(this.fuel, this.fuelMax);
    }
    else {
      this.still();
    }
  }

  rotateLeft() {
    this.fuel = this.fuel - this.smallBurnRate;

    this.body.rotateLeft(this.rotationSpeed);

    this.animations.play('rotate');
    if (this.scale.x < 0) {
      this.scale.x = this.scale.x * -1;
    }
  }

  rotateRight() {
    this.fuel = this.fuel - this.smallBurnRate;

    this.body.rotateRight(this.rotationSpeed);

    this.animations.play('rotate');
    if (this.scale.x > 0) {
      this.scale.x = this.scale.x * -1;
    }
  }

  burn() {
    this.fuel = this.fuel - this.bigBurnRate;

    this.body.setZeroRotation();
    this.body.thrust(this.thrustSpeed);

    this.animations.play('burn');
  }

  still() {
    this.body.setZeroRotation();

    this.animations.play('still');
  }

  land() {
    this.stopped = true;
    this.body.setZeroRotation();
    this.body.setZeroVelocity();

    this.animations.play('still');
  }

  explode() {
    this.stopped = true;
    this.body.setZeroRotation();
    this.body.setZeroVelocity();

    this.animations.play('explode');
  }

  collideWithGround(body) {
    // Early exit if the lander is already exploded
    if (this.stopped) {
      return;
    }

    // isLanding is null if the lander collides with a pad
    // If the lander doesn't collide with a pad, it explodes
    if (!body || !('isLanding' in body)) {
      this.explode();
      return;
    }

    // If the lander is going to fast and has not already exploded,
    // then explode it
    if (this.v >= this.safeLandingVelocity) {
      this.explode();
      return;
    }

    // If the lander is going slow enough and it collides with the
    // landing pad, then the game is over
    if (body.isLanding) {
      this.land();
      this.successCallback();
    }
  }

}

export default Lander;
