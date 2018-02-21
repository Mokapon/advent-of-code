function Position(x, y) {
  this.x = x;
  this.y = y;
}

function distance(pos1, pos2) {
  return abs(pos2.x - pos1.x) + abs(pos2.y - pos1.y);
}