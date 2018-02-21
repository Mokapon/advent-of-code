function Disk(numPositions, initialPosition) {
  this.x = width/2;
  this.y = height/2;
  this.radius = 5*numPositions;

  this.numPositions = numPositions;
  this.initialPosition = initialPosition;
  this.currentPosition = initialPosition;

  this.wishedPosition;

  this.updatePosition = function() {
    this.currentPosition = (this.initialPosition+time)%this.numPositions;
  }

  this.draw = function() {
    push();

    translate(width/2, height/2);
    noFill();
    textAlign(CENTER, CENTER);

    ellipse (0, 0, this.radius*2);

    // rotation to have the current position aligned at the bottom
    let rotationAngle = (this.numPositions-this.currentPosition)*TAU/this.numPositions;

    // draw the different positions and hole
    for (let pos=0; pos < this.numPositions; pos++) {

      if (pos === this.currentPosition) {
        stroke(155,0,155);
      } else {
        stroke(0);
      }
      if (pos === 0) {
        fill(0);
      } else {
        noFill();
      }
      let x = (this.radius-holeRadius-5)*sin(pos*TAU/this.numPositions+rotationAngle);// - holeRadius/2;
      let y = (this.radius-holeRadius-5)*cos(pos*TAU/this.numPositions+rotationAngle);// - holeRadius/2;
      ellipse(x,y, holeRadius * 2);

      stroke(0);
      text(pos,x,y);
    }

    pop();
  }
}
