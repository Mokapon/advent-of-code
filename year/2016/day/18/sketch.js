let EXAMPLE = 0;
let PART1 = 1;
let PART2 = 2;

let inputs = [];
let currentPuzzle;

// display constants
let cellSize = 10;
let margin = 5;

// simulation status
let finished = false;

// used to allow display for bigger problems
let MAX_SIMUL_ROWS = 60;

// simulation variables
let numRows;
let numColumns;
let grid;
let currentRow;

// simulation info display
let numTraps;
let numSafe;

function preload() {
  inputs[EXAMPLE] = loadJSON('input/example.json');
  inputs[PART1] = loadJSON('input/part1.json');
  inputs[PART2] = loadJSON('input/part2.json');
}

function setup() {
  let canvas = createCanvas(2*margin, 2*margin);
  canvas.parent('sketch');

  textAlign(CENTER, CENTER);
  //frameRate(10);

  loadPuzzle(EXAMPLE);
}

function draw() {
  background(230);

  // print grid
  for (let row of grid) {
    for (let cell of row) {
      cell.draw();
    }
  }

  // print # of traps
  fill(0);
  text('Row: ' + currentRow + '/' + numRows, width*1/4, (margin + cellSize)/2);
  text('Safe tiles: ' + numSafe, width*2/4, (margin + cellSize)/2);
  text('Traps: ' + numTraps, width*3/4, (margin + cellSize)/2);

  if (finished) {
    console.log(numSafe);
    console.log(numTraps);
    noLoop();
  } else {
    checkEnd();
    nextStep();
  }
}

function checkEnd() {
  if (currentRow + 1 >= numRows) {
    finished = true;
  } else if (currentRow > 0 && (currentRow % MAX_SIMUL_ROWS) === 0) {
    let leftRows = min(numRows - currentRow, MAX_SIMUL_ROWS);
    let lastRow = '';
    for (let cell of grid[grid.length-1]) {
      lastRow+= cell.type;
    }
    createGrid(leftRows + 1, numColumns, lastRow);
  }
}

function nextStep() {
  do {
    computeNextRow();
  } while (currentPuzzle === PART2 && currentRow < numRows - 1 &&
    (currentRow === 0 || (currentRow % MAX_SIMUL_ROWS) !== 0))
}

function computeNextRow() {
  let rowToExamine = currentRow % MAX_SIMUL_ROWS;
  if (currentRow >= MAX_SIMUL_ROWS) {
    rowToExamine++;
  }
  for (let cell of grid[rowToExamine]) {
    cell.setType();
    if (cell.isTrap()) {
      numTraps++;
    } else {
      numSafe++;
    }
  }
  currentRow++;
}

function keyReleased() {
  if (key === 'R') {
    loadPuzzle(currentPuzzle);
  }
}

function loadPuzzle(puzzle) {
  currentPuzzle = puzzle;

  let firstRow = inputs[puzzle].firstRow;
  numColumns = firstRow.length;
  numRows = inputs[puzzle].numRows;

  numTraps = firstRow.match(new RegExp('\\'+TYPE_TRAP, 'g')).length;
  numSafe = firstRow.match(new RegExp('\\'+TYPE_SAFE, 'g')).length;;
  
  createGrid(min(numRows, MAX_SIMUL_ROWS), numColumns, firstRow);

  currentRow = 1;

  if (finished) {
    finished = false;
    loop();
  }

  // resize at the end because it will call draw()
  resizeCanvas(2*margin + numColumns*cellSize, 2*margin + (grid.length+2)*cellSize);
}

function createGrid(numRows, numColumns, firstRow) {
  grid = [];
  for (let y = 0; y < numRows; y++) {
    grid[y] = [];
    for (let x = 0; x < numColumns; x++) {
      if (y === 0) {
        grid[y][x] = new Cell(x, y, firstRow[x]);
      } else {
        grid[y][x] = new Cell(x, y, TYPE_UNKNOWN);
      }
    }
  }
}