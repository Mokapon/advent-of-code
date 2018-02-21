function Cell(x, y) {
  this.x = x;
  this.y = y;
  this.lit = false;

  this.draw = function() {
    stroke(55);
    if (this.lit) {
      fill(105);
    } else {
      noFill()
    }
    rect(this.x, this.y, cellSize, cellSize);
  }

  this.on = function() {
    this.lit = true;
  }
  this.off = function() {
    this.lit = false;
  }
}