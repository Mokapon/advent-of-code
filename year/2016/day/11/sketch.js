var inputs = [];
let currentInput = 2;

let DOWN = 'D';
let UP = 'U';
let eltSize = 50;
let eltGap = 10;
let elevatorWidth = 40;
let floorHeight = 70;
let floorWidth;
let floorGap = 10;
let margin = 10;
let infoWidth = 100;

let auto;
let done;
let numMoves;
let movesHistory;

let elevator;
let floors;
let elements;

function preload() {
  inputs.push(loadStrings('input_small.txt'));
  inputs.push(loadStrings('input11.txt'));
  inputs.push(loadStrings('input-p2.txt'));
}

function setup() {
  frameRate(4);
  reset();

  let w = floorWidth + infoWidth;
  let h = floorHeight * floors.length;
  createCanvas(w + margin * 2, h + margin * 2);
  strokeWeight(2);
  textSize(textSize()*2)
}

function draw() { 
  background(240);
  // Draw floors
  for (var i = 0; i < floors.length; i++) {
    floors[i].draw();
  }
  // Draw elevator
  elevator.draw();

  // Draw informations
  draw_info();

  if (auto && !done) {
    playNextMove();
  }
}

function draw_info() {
  fill(0);
  textAlign(CENTER);
  let lineHeight = margin * 4;
  let x = floorWidth + infoWidth / 2 - margin / 2 + margin *2;

  // Num of moves
  text('Moves:', x, lineHeight);
  text(numMoves, x, lineHeight * 2);

  // Status (Auto/Manual, Done)
  let modeText;
  if (auto) {
    modeText = 'AUTO';
  } else {
    modeText = 'MANUAL';
  }
  text(modeText, x, lineHeight * 4);
  if (done) {
    text('DONE!', x, lineHeight * 6);
  }
}

function keyReleased() {
  if (key === 'R') {
    reset();
  } else if (key === 'A') {
    auto = !auto;
  } else if (key === 'U' && !auto && movesHistory.length > 0) {
    undoMove();
  } else if (key === 'U' && done) {
    auto = false;
    undoMove();
  } else if (key >= 1 && key <=inputs.length) {
    currentInput = key - 1;
    reset();
  } else if (keyCode === ENTER  && !auto && !done) {
    playNextMove();
  }
}

function playNextMove() {
  let move = getNextMove();
  if (move) {
    numMoves++;
    movesHistory.push(move);
    applyMove(move);
    checkEnd();
  }
}

function undoMove() {
  if (movesHistory.length > 0) {
    let move = getOppositeMove(movesHistory[movesHistory.length-1]);
    numMoves--;
    movesHistory.pop();
    applyMove(move);
    done = false;
  }
}

function getNextMove() {
  let moves=[];
  let previousMove = movesHistory[movesHistory.length - 1];

  let currentFloor = floors[elevator.floor];

  let dirs = [];
  // If floor was empty before and it's not the last/first floor, keep same direction as last time
  if (previousMove && elevator.floor < floors.length -1 
    && currentFloor.getElements().length === previousMove.length -1) {
    dirs.push(previousMove[0]);
  } else if (previousMove && previousMove.length === 2 
    && elevator.floor > 0
    && currentFloor.getElements().length === 2
    && previousMove[0] === UP
    && ((floors[floors.length - 1].isStable()
      && previousMove[1]%2===0)
     || (previousMove[1]%2===1
      && floors[floors.length - 1].getElements().length===1 
      && floors[floors.length - 1].getElements()[0]%2===1))) {
    // If we put a single generator up, and there is only the associated chip here, keep going up
    // If we put a single chip up, and below is only a single chip, keep going up
      dirs.push(UP);
  } else {
    // push all possibilities
    if (elevator.floor < floors.length-1) {
      dirs.push(DOWN);
    }
    if (elevator.floor > 0) {
      dirs.push(UP);
    }
  }

  let elts = [];
  for (let i = 0; i<currentFloor.elements.length; i++) {
    if (currentFloor.elements[i]) {
      elts.push([i]);
      for (let j = i+1; j<currentFloor.elements.length; j++) {
        if(currentFloor.elements[j]) {
          elts.push([i,j]);
        }
      }
    }
  }

  for (let d=0; d<dirs.length; d++) {
    for (let e=0; e<elts.length; e++) {
      let move = [];
      move.push(dirs[d]);
      moves.push(move.concat(elts[e]));
    }
  }

  moves.sort(function(move1, move2) {
    let dir1 = move1[0];
    let elts1= move1.slice(1,move1.length);
    let dir2 = move2[0];
    let elts2= move2.slice(1,move2.length);
    if(dir1 === DOWN) {
      if (dir2 === DOWN) {
        // Both go down, priority to 2 generators
        if (elts2.length === elts1.length && elts2.length === 2) {
          if (elts2[0]%2===0 && elts2[1]%2===0) {
            return 1;
          } else if (elts1[0]%2===0 && elts1[1]%2===0) {
            return -1;
          }
        }
        return elts2.length - elts1.length;
      } else {
        // TODO not ok Priority to generators going up
        if (elts2.length === 1 && elts2[0]%2===0) {
          //return 1;
        }
        return -1;
      }
    } else {
      if (dir2 === UP) {
        // Both go up, priority to 1 generator
        if (elts2.length === elts1.length && elts2.length === 1) {
          if (elts2[0]%2===0) {
            return 1;
          } else if (elts1[0]%2===0) {
            return -1;
          }
        }
        return elts1.length - elts2.length;
      } else {
        // TODO not ok Priority to generators going up
        if (elts1.length === 1 && elts1[0]%2===0) {
          //return -1;
        }
        return 1;
      }
    }
  });

  for (let i = 0; i<moves.length;i++) {
    if (isMoveValid(moves[i])) {
      return moves[i];
    }
  }
  console.log('no move found, play opposite of previous (should not happen)');
  return getOppositeMove(movesHistory[movesHistory.length-1]);
}

function getOppositeMove(baseMove) {
  let oppositeMove = baseMove;
  if (baseMove[0]===DOWN) {
    oppositeMove[0] = UP;
  } else {
    oppositeMove[0] = DOWN;
  }
  return oppositeMove;
}

function isMoveValid(move) {
  if(move.length<2 || move.length>3) {
    return false;
  }

  let previousMove = movesHistory[movesHistory.length-1]
  if (previousMove && move[0] !== previousMove[0]) {
    if (move.slice(1,move.length) === previousMove.slice(1,previousMove.length)) {
      return false;
    }
  }

  let currentFloorNum = elevator.floor;
  let currentFloor = floors[currentFloorNum];

  let modifier;
  if (move[0] === DOWN) {
    modifier = 1
  } else {
    modifier = -1
  }
  let newFloorNum = currentFloorNum;
  let newFloor;
  do {
    newFloorNum += modifier;
    if (newFloorNum < 0 || newFloorNum >= floors.length) {
      // No need to go in this direction there is nothing more
      return false;
    }
    // look at the following floor constraints
    newFloor = floors[newFloorNum];
  } while(newFloor.getElements().length === 0 && newFloorNum !== floors.length -1) 
  
  let currentGens = [];
  let currentChips = [];
  for (var i = 0; i < currentFloor.elements.length; i++) {
    if (currentFloor.elements[i] && move.indexOf(i)===-1) {
      if (currentFloor.elements[i].type === 'G') {
        currentGens.push(i);
      } else {
        currentChips.push(i);
      }
    }
  }
  if (!isFloorValid(currentGens, currentChips)) {
    return false;
  }

  let newGens = [];
  let newChips = [];
  for (var i = 0; i < newFloor.elements.length; i++) {
    if (newFloor.elements[i]) {
      if (newFloor.elements[i].type === 'G') {
        newGens.push(i);
      } else {
        newChips.push(i);
      }
    }
  }

  for (var i=1; i <move.length; i++) {
    if (move[i]%2===0) {
      newGens.push(int(move[i]));
    } else {
      newChips.push(int(move[i]));
    }
  }
  if (!isFloorValid(newGens, newChips)) {
    return false;
  }

  return true;
}

function isFloorValid(gens, chips) {
  for (let i=0; i<chips.length;i++) {
    if (gens.length > 0 && gens.indexOf(chips[i] - 1)===-1) {
      return false;
    }
  }
  return true;
}

function checkEnd() {
  if (floors[floors.length-1].getElements().length === elements.length) {
    done = true;
    console.log(movesHistory);
  }
}

function applyMove(move) {
  let currentFloorNum = elevator.floor;
  if (move[0] === DOWN) {
    newFloorNum = currentFloorNum + 1
  } else {
    newFloorNum = currentFloorNum - 1
  }
  let currentFloor = floors[currentFloorNum];
  let newFloor = floors[newFloorNum];

  for(let i=1; i<move.length; i++) {
    let index = move[i];
    elements[index].setFloor(newFloorNum);
    currentFloor.removeElement(index);
    newFloor.addElement(index, elements[index]);
  }

  elevator.setFloor(newFloorNum);
}

function reset() {
  auto = false;
  done = false;
  numMoves = 0;
  movesHistory = [];

  elevator = new Elevator();
  floors = [];
  elements = [];

  parseInput();

  floorWidth = elements.length * (eltSize + eltGap) + elevatorWidth + eltGap;
}

function parseInput() {
  let input = inputs[currentInput];

  for (let i = 0; i < input.length; i++) {
    let floor = new Floor(i);
    floors[i] = floor;

    let elts = input[i].split(' ');
    for (let j=1; j < elts.length; j++) {
      let element = new Element(elts[j][0], elts[j][1], elements.length);
      element.setFloor(i);
      elements.push(element);
    }
  }

  elements.sort(function(elt1, elt2) {
    return elt1.name > elt2.name ? 1 : -1;
  });
  for (let i = 0; i < elements.length; i++) {
    let elt = elements[i];
    elt.setColumn(i);
    floors[elt.floor].addElement(i, elt);
  }
}