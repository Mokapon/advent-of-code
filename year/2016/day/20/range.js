function Range(low, high) {
  this.low = low;
  this.high = high;
  this.x;
  this.y;
  this.width;

  this.setLow = function(newLow) {
    this.low = newLow;
    this.computePosition();
  }

  this.setHigh = function(newHigh) {
    this.high = newHigh;
    this.computePosition();
  }

  this.computePosition = function() {
    this.x = map(this.low, totalRange.low, totalRange.high, MARGIN, width-MARGIN);
    if (this.low !== this.high) {
      this.y = RANGE_Y;
      this.width = map(this.high - this.low, 0, totalRange.high-totalRange.low, 1, width-MARGIN*2);
    } else {
      this.y = RANGE_Y + RANGE_HEIGHT/2;
      this.width = RANGE_DIAMETER;
    }
  }

  this.draw = function() {
    if (this.low !== this.high) {
      noStroke();
      rect(this.x, this.y, this.width, RANGE_HEIGHT);
      fill(0);
      text(this.low, this.x, TEXT_Y);
      text(this.high, this.x+this.width, TEXT_Y);
    } else {
      stroke(0);
      ellipse(this.x, this.y, this.width);
      fill(0);
      text(this.low, this.x, TEXT_Y);
    }
  }

}