function Door(x, y, w, h) {
  this.x = x;
  this.y = y;
  this.width = w;
  this.height = h;

  this.status = STATUS_UNKNOWN;
  this.rooms = [];

  this.draw = function() {
    stroke(0);
    switch(this.status) {
      case STATUS_UNKNOWN: noFill(); break;
      case STATUS_OPEN: fill(200); break;
      case STATUS_CLOSED: fill(0); break;
    }
    rect(this.x, this.y, this.width, this.height);
  }

  this.setStatus = function(value) {
    if (value.match(openDoorRegex)) {
      this.status = STATUS_OPEN;
    } else {
      this.status = STATUS_CLOSED;
    }
  }
}

