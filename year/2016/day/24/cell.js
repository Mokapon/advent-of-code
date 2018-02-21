let VALUE_WALL = '#';
let VALUE_EMPTY = '.';

function Cell(gridX, gridY, value) {
  this.x = margin + (gridX+1)*cellSize;
  this.y = margin + (gridY+1)*cellSize;
  this.pos = new Position(gridX, gridY);

  this.value = value;
  this.isWall = (value === VALUE_WALL);
  this.isTarget = (str(value).match(/[0-9]+/));
  this.visited = this.isTarget && this.value === 0;

  this.paths = [];

  // for A*
  this.heuristic = 0;
  this.cost = 0;
  this.cameFrom;

  this.draw = function() {
    push();
    stroke(0);
    if (this.isWall) {
      fill(105,0,75);
    } else {
      fill(200);
    }
    rect(this.x, this.y, cellSize, cellSize);

    if (this.isTarget) {
      if (this.visited) {
        fill(200); 
      } else {
        fill(235);
      }
      rect(this.x+margin/2, this.y+margin/2, cellSize-margin, cellSize-margin);
      fill(0);
      textStyle(NORMAL);
      text(this.value, this.x+cellSize/2, this.y+cellSize/2);
    }
    pop();
  }

  this.setPathTo = function(cell, path) {
    this.paths[cell.value] = path;
    let pathCopy = path.slice(0, path.length-1);
    pathCopy.splice(0, 0, this.pos);
    cell.paths[this.value] = pathCopy.reverse();
  }

  this.neighbors = function() {
    let neighbors = [];
    if (this.pos.x>0)
      neighbors.push(grid[this.pos.x-1][this.pos.y]);
    if (this.pos.y>0)
      neighbors.push(grid[this.pos.x][this.pos.y-1]);
    if (this.pos.y<gridHeight-1)
      neighbors.push(grid[this.pos.x][this.pos.y+1]);
    if (this.pos.x<gridWidth-1)
      neighbors.push(grid[this.pos.x+1][this.pos.y]);
    return neighbors;
  }

  this.resetAStar = function() {
    this.cost = 0;
    this.heuristic = 0;
    this.cameFrom = null;
  }
}

function compareCell(cell1, cell2) {
  return cell2.heuristic - cell1.heuristic;
}

function isWall(x, y) {
  let value = x*x+3*x + 2*x*y + y + y*y;
  value += magicNumber;

  // ok bc positive
  let binaryRep = (value).toString(2);
  let onesCount = 0;
  for (let c = 0 ; c < binaryRep.length; c++) {
    if (binaryRep[c] === '1') {
      onesCount++;
    }
  }

  return onesCount%2 === 1;
}
