function Room(gridX, gridY) {
  this.x = doorSize + gridX*(roomSize+doorSize);
  this.y = doorSize + gridY*(roomSize+doorSize);
  this.pos = new Position(gridX, gridY);

  this.doors=[];

  this.draw = function() {
    stroke(0);
    fill(200);
    rect(this.x, this.y, roomSize, roomSize);

    // draw top and left doors
    if (this.doors[DIR_UP]) {
      this.doors[DIR_UP].draw();
    }
    if (this.doors[DIR_LEFT]) {
      this.doors[DIR_LEFT].draw();
    }
  }

  this.initDoors = function() {
    // Create the door down + right door, add top and left if exist
    if (this.pos.y<gridHeight-1) {
      let doorId = this.pos.x + '_' + (this.pos.y + 0.5);
      let newDoor = new Door(this.x + doorGap, this.y+roomSize, roomSize-doorGap*2, doorSize);
      doors[doorId] = newDoor;
      this.doors[DIR_DOWN] = newDoor;
      newDoor.rooms[DIR_UP] = this;
    }
    if (this.pos.x<gridWidth-1) {
      let doorId = (this.pos.x + 0.5) + '_' + this.pos.y;
      let newDoor = new Door(this.x + roomSize, this.y + doorGap, doorSize, roomSize - doorGap*2);
      doors[doorId] = newDoor;
      this.doors[DIR_RIGHT] = newDoor;
      newDoor.rooms[DIR_LEFT] = this;
    }

    // add ref to top and left door
    if (this.pos.x>0) {
      let doorId = (this.pos.x -0.5) + '_' + this.pos.y;
      this.doors[DIR_LEFT] = doors[doorId];
      doors[doorId].rooms[DIR_RIGHT] = this;
    }
    if (this.pos.y>0) {
      let doorId = this.pos.x + '_' + (this.pos.y - 0.5);
      this.doors[DIR_UP] = doors[doorId];
      doors[doorId].rooms[DIR_DOWN] = this;
    }
  }

  this.setDoorsStatus = function(values) {
    if (this.doors[DIR_UP]) {
      this.doors[DIR_UP].setStatus(values[0]);
    }
    if (this.doors[DIR_DOWN]) {
      this.doors[DIR_DOWN].setStatus(values[1]);
    }
    if (this.doors[DIR_LEFT]) {
      this.doors[DIR_LEFT].setStatus(values[2]);
    }
    if (this.doors[DIR_RIGHT]) {
      this.doors[DIR_RIGHT].setStatus(values[3]);
    }
  }

  this.getAvailableMoves = function() {
    let availableMoves = [];
    for (let dir of Object.keys(this.doors)) {
      if (this.doors[dir].status === STATUS_OPEN) {
        availableMoves.push(dir);
      }
    }
    return availableMoves;
  }

  this.neighbor = function(dir) {
    return this.doors[dir].rooms[dir];
  }
}

