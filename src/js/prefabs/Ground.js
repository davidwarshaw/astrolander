import Phaser from 'phaser';

class Ground {
  constructor(game, random, options) {

    const {
      color = 0xffffff,
      numSegments = 100,
      meanHeight = 100
    } = options;
    let {
      roughness = 50
    } = options;

    // Roughness can't exceed mean height
    if (roughness > meanHeight) {
      roughness = meanHeight;
    }

    const meanY = game.height - meanHeight;
    const segmentWidth = game.width / numSegments;
    const launchingSegmentLeft = 2;
    const landingSegmentLeft = numSegments - 3;

    // Vary the heights of the pads
    const padOffset = roughness;
    const launchingOffset = random.between(0, padOffset);
    const launchingSegmentHeight = meanY - launchingOffset;
    const landingSegmentHeight = meanY - (padOffset - launchingOffset);

    this.graphics = game.add.graphics(0, 0);

    // Create the ground path
    const path = [...Array(numSegments).keys()].map(i => {

      const x = i * segmentWidth;

      // The first, third from first, third from last,
      // and last segments should be at mean y
      const firstSegment = i === 0;
      const launchingSegment = i === launchingSegmentLeft ||
        i === launchingSegmentLeft + 1;
      const landingSegment = i === landingSegmentLeft ||
        i === landingSegmentLeft + 1;

      let y = 0;
      if (firstSegment) {
        y = meanY;
      }
      else if (launchingSegment) {
        y = launchingSegmentHeight;
      }
      else if (landingSegment) {
        y = landingSegmentHeight;
      }
      else {
        const middleness = numSegments - Math.abs((numSegments / 2) - i);
        const heightFactor = middleness * roughness;
        y = meanY + random.between(-0.03 * heightFactor, 0.003 * heightFactor);
      }
      return [x, y];
    });

    // Set the lauching and landing locations
    // Launching is the third segment
    this.launchingLocation = {
      x: path[launchingSegmentLeft][0], y: path[launchingSegmentLeft][1],
      width: segmentWidth
    };

    // Landing is the third from last segment
    this.landingLocation = {
      x: path[landingSegmentLeft][0], y: path[landingSegmentLeft][1],
      width: segmentWidth
    };

    // Add last segment at mean y
    path.push([game.width, meanY]);

    // Add the two bottom corners to finish the polygon
    path.push([game.width, game.height]);
    path.push([0, game.height]);

    // Finally, flatten to phaser array of alternating x and y
    this.points = [].concat.apply([], path);

    // Create the physics body with the polygon
    this.body = new Phaser.Physics.P2.Body(game);
    this.body.clearShapes();
    this.body.addPolygon({}, this.points.slice());

    // Ground is immovable
    this.body.kinematic = true;

    this.body.debug = false;

    game.physics.p2.addBody(this.body);

    // The collision group
    this.collisionGroup = game.physics.p2.createCollisionGroup();
    this.body.setCollisionGroup(this.collisionGroup);

    // Draw the ground
    this.graphics.beginFill(color);
    this.graphics.drawPolygon(this.points);
    this.graphics.endFill();
  }

}

export default Ground;
