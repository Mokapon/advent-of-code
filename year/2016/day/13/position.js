function Position(coordinates) {
  this.x = int(coordinates[0]);
  this.y = int(coordinates[1]);
}

function distance(pos1, pos2) {
  return abs(pos2.x - pos1.x) + abs(pos2.y - pos1.y);
}