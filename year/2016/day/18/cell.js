let TYPE_SAFE = '.';
let TYPE_TRAP = '^';
let TYPE_UNKNOWN = '?';

// used as default safe cell
let SAFE_CELL = new Cell(-1,-1, TYPE_SAFE);

let TRAP_CONDITIONS = [
  TYPE_TRAP + TYPE_TRAP + TYPE_SAFE, // Its left and center tiles are traps, but its right tile is not.
  TYPE_SAFE + TYPE_TRAP + TYPE_TRAP, // Its center and right tiles are traps, but its left tile is not.
  TYPE_TRAP + TYPE_SAFE + TYPE_SAFE, // Only its left tile is a trap.
  TYPE_SAFE + TYPE_SAFE + TYPE_TRAP  // Only its right tile is a trap.
  ];

function Cell(gridX, gridY, type) {
  this.x = margin + gridX*cellSize;
  this.y = margin + (gridY+1)*cellSize;
  this.pos = new Position(gridX, gridY);

  this.type = type;

  this.draw = function() {
    switch(this.type) {
      case TYPE_SAFE: fill(200); break;
      case TYPE_TRAP: fill(155,0,50); break;
      default: fill(100); break;
    }
    rect(this.x, this.y, cellSize, cellSize);
  }

  this.isSafe = function() {
    return this.type === TYPE_SAFE;
  }

  this.isTrap = function() {
    return this.type === TYPE_TRAP;
  }

  this.leftUp = function() {
    if (this.pos.x > 0 && this.pos.y > 0) {
      return grid[this.pos.y-1][this.pos.x-1];
    }
    return SAFE_CELL;
  }
  this.up = function() {
    if (this.pos.y > 0) {
      return grid[this.pos.y-1][this.pos.x];
    }
    return SAFE_CELL;
  }
  this.rightUp = function() {
    if(this.pos.y > 0 && this.pos.x<numColumns-1) {
      return grid[this.pos.y-1][this.pos.x+1];
    }
    return SAFE_CELL;
  }

  this.setType = function() {
    let aboveTiles = this.leftUp().type + this.up().type + this.rightUp().type;
    if (TRAP_CONDITIONS.indexOf(aboveTiles) !== -1) {
      this.type = TYPE_TRAP;
    } else {
      this.type = TYPE_SAFE;
    }
  }
}