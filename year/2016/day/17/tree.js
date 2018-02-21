function Node(room, parent, parentMove) {
  this.pos = room.pos;
  this.room = room;
  this.parent = parent;
  this.parentMove = parentMove;
  this.moves = [];
  this.visited = false;
  this.path = parent ? parent.path + parentMove : '';
}

function Tree(startingRoom) {
  this.root = new Node(startingRoom);
}