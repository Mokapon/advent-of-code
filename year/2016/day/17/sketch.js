// Tree structure to store the possible paths.
// We use a depth-first search, to search for the shortest path.
// When a path runs longer than the shortest we have, stop the branch.
// Breadth first search would probably be more efficient but would make the animation hard to follow.

let EXAMPLE = 0;
let PART1 = 1;
let PART2 = 2;

let inputs = [];
let currentPuzzle;

// display constants
let roomSize = 25;
let doorGap = 5;
let doorSize = 3;

// simulation constants
let DIR_UP = 'U';
let DIR_DOWN = 'D';
let DIR_RIGHT = 'R';
let DIR_LEFT = 'L';
let STATUS_UNKNOWN = 0;
let STATUS_OPEN = 1;
let STATUS_CLOSED = 2;
let openDoorRegex = /^[b-f]$/;

let gridWidth = 4;
let gridHeight = 4;
let startingPosition = new Position(0,0);
let targetPosition = new Position(gridWidth-1,gridHeight-1);

// simulation status
let finished = false;

// simulation variables
let grid;
let doors;
let passCode;
let bestPathNode;

let tree;
let currentNode;

function preload() {
  inputs[EXAMPLE] = loadStrings('input/example.txt');
  inputs[PART1] = loadStrings('input/part1.txt');
  inputs[PART2] = loadStrings('input/part2.txt');
}

function setup() {
  let canvas = createCanvas(doorSize + (doorSize + roomSize)*gridWidth, doorSize + (doorSize + roomSize)*gridHeight);
  canvas.parent('sketch');

  //frameRate(10);
  loadPuzzle(EXAMPLE);
}

function loadPuzzle(puzzle) {
  currentPuzzle = puzzle;

  passCode = inputs[puzzle][0];
  bestPathNode = null;

  doors = [];
  grid = [];
  for (let x = 0; x < gridWidth; x++) {
    grid[x] = [];
    for (let y = 0; y < gridHeight; y++) {
      grid[x][y] = new Room(x,y);
      grid[x][y].initDoors();
    }
  }

  tree = new Tree(grid[startingPosition.x][startingPosition.y]);
  currentNode = tree.root;
  updateDoorsStatus();

  if (finished) {
    finished = false;
    loop();
  }

  // TODO did not find a better way to not kill the browser with computations
  if (currentPuzzle === PART2) {
    while (!finished) {
      nextStep();
    }
  }
}


function draw() {
  background(230);

  drawGrid();

  if (finished) {
    noLoop();
  } else {
    nextStep();
  }
}

function drawGrid() {
  // print grid
  for (let row of grid) {
    for (let room of row) {
      room.draw();
    }
  }

  // draw target
  stroke(0);
  fill(75,15,195);
  rect(doorSize+targetPosition.x*(roomSize+doorSize) + 5/2,
   doorSize+targetPosition.y*(roomSize+doorSize)+ 5/2, roomSize -5, roomSize -5)

  // draw path
  push();
  stroke(155,0,155, 100);
  strokeWeight(5);
  let node = currentNode;
  while (node && node.parent) {
    // we want to see the superposition of paths -> draw line by line
    beginShape();
    let start = node.pos;
    let end = node.parent.pos;
    vertex( doorSize + start.x * (roomSize+doorSize) + roomSize/2,
      doorSize + start.y * (roomSize+doorSize) + roomSize/2)
    vertex( doorSize + end.x * (roomSize+doorSize) + roomSize/2,
      doorSize + end.y * (roomSize+doorSize) + roomSize/2)
    endShape();
    node = node.parent;
  }
  pop();

  // draw current position
  noStroke();
  fill(145,0,175);
  ellipse(doorSize+currentNode.pos.x*(roomSize+doorSize) + roomSize/2, 
    doorSize+currentNode.pos.y*(roomSize+doorSize)+ roomSize/2, roomSize -5)
}


function nextStep() {
  let possibleMoves = [];
  for (let direction of Object.keys(currentNode.moves)) {
    if (!currentNode.moves[direction].visited) {
      possibleMoves.push(direction);
    }
  }
  if (possibleMoves.length === 0 || currentNode.visited ||
    (bestPathNode && currentPuzzle !== PART2 &&
      currentNode.path.length>=bestPathNode.path.length)) {
    // if no possible move, or path longer than current best when relevant, stop.
    // for part 2 we look for the longest path, so no stopping if short, but stop if the node is already visited
    currentNode.visited = true;
    if (currentNode.parent) {
      undoMove()
    } else {
      console.log('Search done. Best Path: ' + bestPathNode.path);
      currentNode = bestPathNode; // move to display the path
      finished = true;
    }
  } else {
    move(possibleMoves[0]);
  }
}

function move(direction) {
  let newNode = currentNode.moves[direction];
  if (newNode) {
    currentNode = newNode;
    
    updateDoorsStatus();

    checkTarget();
  }
}

function undoMove() {
  if (currentNode.parent) {
    cleanDoorStatus(currentNode);
    currentNode = currentNode.parent;
  }
}

function updateDoorsStatus() {
  if (currentNode.parent) {
    cleanDoorStatus(currentNode.parent);
  }

  let hash = md5(passCode + currentNode.path);
  currentNode.room.setDoorsStatus(hash.slice(0,4));
  for (let dir of currentNode.room.getAvailableMoves()) {
    currentNode.moves[dir] = new Node(currentNode.room.neighbor(dir), currentNode, dir);
  }
}


function cleanDoorStatus(node) {
  let room = node.room;
  for (let dir of Object.keys(room.doors)) {
    room.doors[dir].status = STATUS_UNKNOWN;
  }
}

function checkTarget() {
  if (currentNode.pos.x === targetPosition.x && currentNode.pos.y === targetPosition.y) {
    console.log('Found better path: ' + currentNode.path);
    // don't want to come back anymore!
    currentNode.visited = true;
    if (bestPathNode) {
      if (currentPuzzle !== PART2 && currentNode.path.length<bestPathNode.path.length) {
        //new shortest Path!!
        bestPathNode = currentNode;
      } else if (currentPuzzle === PART2 && currentNode.path.length>bestPathNode.path.length) {
        //new longest Path!!
        bestPathNode = currentNode;
      }
    } else {
      bestPathNode = currentNode;
    }
  }
}

function keyReleased() {
  if (key === 'R') {
    loadPuzzle(currentPuzzle);
  } else if (keyCode === UP_ARROW) {
    move(DIR_UP);
  } else if (keyCode === DOWN_ARROW) {
    move(DIR_DOWN);
  } else if (keyCode === LEFT_ARROW) {
    move(DIR_LEFT);
  } else if (keyCode === RIGHT_ARROW) {
    move(DIR_RIGHT);
  }
}
