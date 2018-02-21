function Cell(gridX, gridY) {
  this.x = margin + (gridX+1)*cellSize;
  this.y = margin + (gridY+1)*cellSize;
  this.pos = new Position([gridX, gridY]);

  this.wall = isWall(gridX, gridY);

  // for A*
  this.heuristic = 0;
  this.cost = 0;
  this.cameFrom;

  // for display
  this.isClosed;
  this.isOpen;
  this.isPath;

  this.draw = function() {
    stroke(0);
    if (this.wall) {
      fill(105,0,75);
    } else if (this.isPath) {
      fill(0,199,0);
    } else if (this.isClosed) {
      if (currentPuzzle === PART2) {
        fill(0,0,200, this.cost*(255/maxCost));
      } else {
        fill(0,0,200, 100);
      }
    } else if (this.isOpen) {
      fill(0,0,200);
    }  else if (this.isCurrent) {
      fill(0,200,200);
    } else {
      fill(200);
    }
    rect(this.x, this.y, cellSize, cellSize);
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
}

function addIfDefined(list, element) {
  if (element) {
    list.push(element);
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
