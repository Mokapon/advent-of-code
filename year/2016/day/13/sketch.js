let EXAMPLE = 0;
let PART1 = 1;
let PART2 = 2;

let inputs = [];
let currentPuzzle;

// simulation status
let finished = false;

// display constants
let cellSize = 25;
let margin = 5;

// simulation variables
let magicNumber;
let maxCost;
let grid;
let gridWidth;
let gridHeight;
let startPosition;
let targetPosition;
let path;

let closedList;
let openList;

function preload() {
  inputs[EXAMPLE] = loadStrings('input/example.txt');
  inputs[PART1] = loadStrings('input/part1.txt');
  inputs[PART2] = loadStrings('input/part2.txt');
}

function setup() {
  let canvas = createCanvas(2*margin, 2*margin);
  canvas.parent('sketch');

  frameRate(10);
  loadPuzzle(EXAMPLE);
}

function draw() {
  background(230);
  textAlign(CENTER, CENTER);

  // print grid
  for (let i=0; i<gridWidth; i++) {
    fill(0);
    text(i, margin + (i+1)*cellSize + cellSize/2, margin + cellSize/2);
    for (let j=0; j<gridHeight; j++) {
      if (i === 0) {
        fill(0);
        text(j, margin + cellSize/2, margin + (j+1)*cellSize + cellSize/2);
      }
      grid[i][j].draw();
    }
  }

  // draw start
  stroke(0);
  fill(145,125,0);
  ellipse(margin+(startPosition.x+1)*cellSize + cellSize/2, margin+(startPosition.y+1)*cellSize+ cellSize/2, cellSize -5)

  // draw target
  stroke(0);
  fill(75,15,195);
  rect(margin+(targetPosition.x+1)*cellSize + 5/2, margin+(targetPosition.y+1)*cellSize+ 5/2, cellSize -5, cellSize -5)

  if (finished) {
    noLoop();
  } else {
    nextStep();
  }
}

function keyReleased() {
  if (key === 'R') {
    loadPuzzle(currentPuzzle);
  }
}

function loadPuzzle(puzzle) {
  currentPuzzle = puzzle;

  grid = [];
  magicNumber = int(inputs[puzzle][0]);
  startPosition = new Position(inputs[puzzle][1].split(','));
  targetPosition = new Position(inputs[puzzle][2].split(','));
  maxCost = inputs[puzzle][3];

  // todo not correct bc will rule out some possible ways
  gridWidth = targetPosition.x + 1 + 5;
  gridHeight = targetPosition.y + 1 + 5;

  for (let x = 0; x < gridWidth; x++) {
    grid[x] = [];
    for (let y = 0; y < gridHeight; y++) {
      grid[x][y] = new Cell(x,y);
    }
  }

  initAlgorithm();

  finished = false;
  loop();

  // call at the end because it will call draw()
  resizeCanvas(2*margin + (gridWidth+1)*cellSize, 2*margin + (gridHeight+1)*cellSize);
}

function initAlgorithm() {
  closedList = [];
  openList = [];

  let startCell = grid[startPosition.x][startPosition.y];
  startCell.heuristic = distance(startPosition, targetPosition);
  openList.push(startCell);
  startCell.isOpen = true;
}

function nextStep() {
  if (openList.length > 0) {
    let cell = openList.pop();
    cell.isOpen = false;
    cell.isCurrent = true;

    if (currentPuzzle === PART2 && cell.cost>=50) {
      closedList.push(cell);
      cell.isClosed = true;
      return;
    }

    if (currentPuzzle !== PART2 && 
      cell.pos.x === targetPosition.x && cell.pos.y === targetPosition.y) {
      // Found path
      cell.isCurrent = false;
      buildPath(cell);
      console.log('SHORTEST PATH FOUND: ' + path.length);
      finished = true;
      return;
    }

    for (let neighbor of cell.neighbors()) {
      if (neighbor.wall || closedList.indexOf(neighbor)!==-1
        || openList.indexOf(neighbor) !== -1) {
        continue;
      }
      
      neighbor.cameFrom = cell;
      neighbor.cost = cell.cost + 1;
      neighbor.heuristic = neighbor.cost + distance(neighbor.pos, targetPosition);
      openList.push(neighbor);

      neighbor.isOpen = true;
    }
    openList.sort(compareCell);

    closedList.push(cell);
    cell.isCurrent = false;
    cell.isOpen = false;
    cell.isClosed = true;

    // build current shortest path
    buildPath(cell);
  } else {
    console.log('NO PATH FOUND. ' + closedList.length + ' cells visited.');
    resetPath();
    finished = true;
  }
}

function buildPath(cell) {
  resetPath();
  do {
    cell.isPath = true;
    path.push(cell);
    cell = cell.cameFrom;
  } while(cell && cell.cameFrom);
}

function resetPath() {
  path = [];
  for (let row of grid) {
    for (let cell of row) {
      cell.isPath = false;
    }
  }
}