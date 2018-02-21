let EXAMPLE = 0;
let PART1 = 1;
let PART2 = 2;

let inputs = [];
let currentPuzzle;

// simulation status
let finished = false;

// display constants
let cellSize = 15;
let margin = 5;

// simulation variables
let grid;
let gridWidth;
let gridHeight;
let targets;
let path;

let possiblePaths;
let currentPathIndex;
let shortestLength;
let shortestPathIndex;

let closedList;
let openList;

// used to improve perf
let numTestsPerIteration = 100;


function preload() {
  inputs[EXAMPLE] = loadStrings('input/example.txt');
  inputs[PART1] = loadStrings('input/part1.txt');
  inputs[PART2] = inputs[PART1];
}

function setup() {
  let canvas = createCanvas(2*margin, 2*margin);
  canvas.parent('sketch');

  //frameRate(10);
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

  // draw path
  drawPath();

  if (finished) {
    noLoop();
  } else {
    nextStep();
    if (currentPathIndex >= possiblePaths.length) {
      path = possiblePaths[shortestPathIndex];
      console.log('Found shortest path ' + path + ' of length ' + shortestLength);
      finished = true;
    }
  }
}

function drawPath() {
  push();
  stroke(0,125,200,100);
  strokeWeight(5);
  noFill();

  let fromCell;
  for (let i = 0; i < path.length -1; i++) {
    let fromTargetIndex = path[i];
    let toTargetIndex = path[i+1];

    fromCell = targets[fromTargetIndex];
    let subPath = fromCell.paths[toTargetIndex];

    beginShape();
    for (let j = 0; j < subPath.length; j++) {
      let toPosition = subPath[j];
      let toCell = grid[toPosition.x][toPosition.y];

      vertex(fromCell.x + cellSize/2, fromCell.y + cellSize/2);
      vertex(toCell.x + cellSize/2, toCell.y + cellSize/2);

      fromCell = toCell;
    }
    endShape();
  }
  pop();
}

function nextStep() {
  let numIterations = (currentPuzzle === EXAMPLE) ? 1 : numTestsPerIteration;
  numIterations = min(numIterations, possiblePaths.length - currentPathIndex);
  for (let i = 0; i < numIterations; i++) {
    testNextPath();
  }
}

function testNextPath() {
  path = possiblePaths[currentPathIndex];
  let pathLength = lengthOf(path);
  if (shortestLength===-1 || pathLength < shortestLength) {
    shortestLength = pathLength;
    shortestPathIndex = currentPathIndex;
  }
  currentPathIndex++;
}

function lengthOf(path) {
  let length = 0;
  for (let i = 0; i < path.length -1; i++) {
    let startingPoint = path[i];
    let endPoint = path[i+1];
    let subPath = targets[startingPoint].paths[endPoint];
    length += subPath.length;
  }
  return length;
}

function keyReleased() {
  if (key === 'R') {
    loadPuzzle(currentPuzzle);
  }
}

function loadPuzzle(puzzle) {
  currentPuzzle = puzzle;

  grid = [];
  targets = [];
  path = [];
  currentPathIndex = 0;
  shortestLength = -1;
  shortestPathIndex = -1;

  let lines = inputs[puzzle];

  for (let row = 0; row < lines.length; row++) {
    for (let col = 0; col < lines[row].length; col++) {
      let value = lines[row][col];
      if (value.match(/[0-9]+/)) {
        value = int(value);
      }

      if (!grid[col]) {
        grid[col] = []
      }
      grid[col][row] = new Cell(col, row, value);
      if (grid[col][row].isTarget) {
        targets[value] = grid[col][row];
      }
    }
  }

  gridWidth = grid.length;
  gridHeight = grid[0].length;

  initGraph();
  findPermutations();

  finished = false;
  loop();

  // call at the end because it will call draw()
  resizeCanvas(2*margin + (gridWidth+1)*cellSize, 2*margin + (gridHeight+1)*cellSize);
}

function initGraph() {
  for (let i = 0; i < targets.length; i++) {
    let fromTarget = targets[i];
    for (let j = i + 1; j < targets.length; j++) {
      let toTarget = targets[j];
      fromTarget.setPathTo(toTarget, findPath(fromTarget.pos, toTarget.pos));
      resetAStar();
    }
  }
}

function findPermutations() {
  possiblePaths = [];
  let singlePath = [];
  for (let i = 0; i < targets.length; i++) {
    singlePath.push(i);
  }

  // In part 2 we want to return to the begining
  if (currentPuzzle === PART2) {
    singlePath.push(0);
  }
  let endIndex = currentPuzzle === PART2 ? singlePath.length - 1 : singlePath.length;
  createPermutations(singlePath, 1, endIndex);
}

function createPermutations(path, startIndex, endIndex) {
  if (startIndex === endIndex) {
    possiblePaths.push(path);
  }
  for (let i = startIndex; i < endIndex; i++) {
    let newPath = swap(path.slice(), startIndex, i);
    createPermutations(newPath, startIndex + 1, endIndex);
  }
}

function swap(list, index1, index2) {
  let tmp = list[index1];
  list[index1] = list[index2];
  list[index2] = tmp;
  return list;
}

function resetAStar() {
  for (let row of grid) {
    for (let cell of row) {
      cell.resetAStar();
    }
  }
}

function findPath(startPos, targetPosition) {
  let closedList = [];
  let openList = [];

  let startCell = grid[startPos.x][startPos.y];
  startCell.heuristic = distance(startPos, targetPosition);
  openList.push(startCell);

  while (openList.length > 0) {
    let cell = openList.pop();
    cell.isOpen = false;
    cell.isCurrent = true;

    if (cell.pos.x === targetPosition.x && cell.pos.y === targetPosition.y) {
      // Found path
      return buildAStarPath(cell);;
    }

    for (let neighbor of cell.neighbors()) {
      if (neighbor.isWall || closedList.indexOf(neighbor)!==-1 ||
        openList.indexOf(neighbor) !== -1) {
        continue;
    }

    neighbor.cameFrom = cell;
    neighbor.cost = cell.cost + 1;
    neighbor.heuristic = neighbor.cost + distance(neighbor.pos, targetPosition);
    openList.push(neighbor);
  }
  openList.sort(compareCell);

  closedList.push(cell);
}

console.log('NO PATH FOUND. ' + closedList.length + ' cells visited.');
}

function buildAStarPath(cell) {
  let path = [];
  do {
    path.splice(0, 0, cell.pos);
    cell = cell.cameFrom;
  } while(cell && cell.cameFrom);
  return path;
}
