function Bunny() {
  this.pos = createVector(0,0);
  this.dir = 0;
  this.trace = [];
  
  this.forward = function() {
    this.trace.push(this.pos.copy());
    if (this.dir === 0) {
      this.pos.y -= 1
    } else if (this.dir === 1) {
      this.pos.x += 1
    } else if (this.dir === 2) {
      this.pos.y += 1
    } else if (this.dir === 3) {
      this.pos.x -= 1
    }
    for (var i = 0; i < this.trace.length ; i++) {
      if (this.trace[i].x === this.pos.x && this.trace[i].y === this.pos.y) {
        console.log("found " + this.pos);
      }
    }
  }
  this.right = function() {
    this.dir = (this.dir + 1) % 4;
  }
  this.left = function() {
    this.dir = this.dir > 0 ? (this.dir - 1) : 3;
  }
  
  this.draw = function() {
    var tdir, t2, t3;
    if (this.dir === 0) {
      tdir = createVector((this.pos.x + offset.x) * cellWidth, (this.pos.y + offset.y) * cellWidth - cellWidth / 2);
      t2 = createVector((this.pos.x + offset.x) * cellWidth - cellWidth / 2, (this.pos.y + offset.y) * cellWidth + cellWidth / 2);
      t3 = createVector((this.pos.x + offset.x) * cellWidth + cellWidth / 2, (this.pos.y + offset.y) * cellWidth + cellWidth / 2);
    } else if (this.dir === 1) {
      tdir = createVector((this.pos.x + offset.x) * cellWidth + cellWidth / 2, (this.pos.y + offset.y) * cellWidth);
      t2 = createVector((this.pos.x + offset.x) * cellWidth - cellWidth / 2, (this.pos.y + offset.y) * cellWidth + cellWidth / 2);
      t3 = createVector((this.pos.x + offset.x) * cellWidth - cellWidth / 2, (this.pos.y + offset.y) * cellWidth - cellWidth / 2);
    } else if (this.dir === 2) {
      tdir = createVector((this.pos.x + offset.x) * cellWidth, (this.pos.y + offset.y) * cellWidth + cellWidth / 2);
      t2 = createVector((this.pos.x + offset.x) * cellWidth - cellWidth / 2, (this.pos.y + offset.y) * cellWidth - cellWidth / 2);
      t3 = createVector((this.pos.x + offset.x) * cellWidth + cellWidth / 2, (this.pos.y + offset.y) * cellWidth - cellWidth / 2);
    } else if (this.dir === 3) {
      tdir = createVector((this.pos.x + offset.x) * cellWidth - cellWidth / 2, (this.pos.y + offset.y) * cellWidth);
      t2 = createVector((this.pos.x + offset.x) * cellWidth + cellWidth / 2, (this.pos.y + offset.y) * cellWidth - cellWidth / 2);
      t3 = createVector((this.pos.x + offset.x) * cellWidth + cellWidth / 2, (this.pos.y + offset.y) * cellWidth + cellWidth / 2);
    }
    triangle(tdir.x, tdir.y, t2.x, t2.y, t3.x, t3.y);
  }
}