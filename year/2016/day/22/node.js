function Node(position, used, avail) {
  this.pos = position;

  // display
  this.x = margin + position.x*nodeSize + nodeSize;
  this.y = margin + position.y*nodeSize + nodeSize;
  this.totalBoxSize;
  this.usedBoxSize;

  // content of the node
  this.used = used;
  this.avail = avail;
  this.total = used + avail;

  // for A*
  this.heuristic = 0;
  this.cost = 0;
  this.cameFrom;

  this.setUsed = function(newValue) {
    this.used = newValue;
    this.avail = this.total - newValue;
    this.updateSize();
  }

  this.setAvail = function(newValue) {
    this.avail = newValue;
    this.used = this.total - newValue;
    this.updateSize();
  }

  this.updateSize = function() {
    this.totalBoxSize = map(this.total, 0, biggestNodeSize, 0, nodeSize);
    this.usedBoxSize = map(this.used, 0, biggestNodeSize, 0, nodeSize);
  }

  this.draw = function() {
    if (!this.totalBoxSize) {
      this.updateSize();
    }
    stroke(0);
    fill(105);
    rect(this.x, this.y, nodeSize, nodeSize);

    noStroke();
    fill(255);
    rect(this.x+1, this.y+1,this.totalBoxSize, this.totalBoxSize);

    noStroke();
    fill(0,0,155);
    rect(this.x+1, this.y+1, this.usedBoxSize, this.usedBoxSize);
  }

  this.isEmpty = function () {
    return this. used === 0;
  }

  this.viableNeighbors = function() {
    let neighbors = [];
    if (this.pos.x>0 && this.canContain(grid[this.pos.x-1][this.pos.y]))
      neighbors.push(grid[this.pos.x-1][this.pos.y]);
    if (this.pos.y>0 && this.canContain(grid[this.pos.x][this.pos.y-1]))
      neighbors.push(grid[this.pos.x][this.pos.y-1]);
    if (this.pos.y<grid[0].length-1 && this.canContain(grid[this.pos.x][this.pos.y+1]))
      neighbors.push(grid[this.pos.x][this.pos.y+1]);
    if (this.pos.x<grid.length-1 && this.canContain(grid[this.pos.x+1][this.pos.y]))
      neighbors.push(grid[this.pos.x+1][this.pos.y]);
    return neighbors;
  }

  this.potentialyAccessibleNeighbors = function() {
    let neighbors = [];
    if (this.pos.x>0 && grid[this.pos.x-1][this.pos.y].canContain(this))
      neighbors.push(grid[this.pos.x-1][this.pos.y]);
    if (this.pos.y>0 && grid[this.pos.x][this.pos.y-1].canContain(this))
      neighbors.push(grid[this.pos.x][this.pos.y-1]);
    if (this.pos.y<grid[0].length-1 && grid[this.pos.x][this.pos.y+1].canContain(this))
      neighbors.push(grid[this.pos.x][this.pos.y+1]);
    if (this.pos.x<grid.length-1 && grid[this.pos.x+1][this.pos.y].canContain(this))
      neighbors.push(grid[this.pos.x+1][this.pos.y]);
    return neighbors;
  }

  this.canContain = function(node) {
    return !node.isEmpty() && this.total >= node.used;
  }

  this.moveContentTo = function(node) {
    node.setUsed(node.used + this.used);
    this.setUsed(0);
  }

  this.resetAStar = function() {
    this.heuristic = 0;
    this.cost = 0;
    this.cameFrom = undefined;
  }
}

function compareHeuristic(node1, node2) {
  return node2.heuristic - node1.heuristic;
}