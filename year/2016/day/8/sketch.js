var input;

var grid = [];
var rows = 6;
var cols = 50;

var input_regex = /(\d+)(?:x| by )(\d+)/;

// display specs
var cellSize = 20;

// progress in the input
var index = 0;


function preload() {
  input = loadStrings('input8.txt');
}

function setup() {
  createCanvas((cols + 1) * cellSize, (rows + 2) * cellSize).parent('sketch');
  for (var i = 0; i < rows; i++) {
    grid[i] = [];
    for (var j = 0; j < cols; j++) {
      grid[i][j] = new Cell(j * cellSize, i * cellSize);
    }
  }
}

function draw() {
  if (index < input.length) {
    parseInstruction(input[index++]);

    // draw screen
    background(250);
    translate(cellSize / 2, cellSize / 2);
    for (var i = 0; i < rows; i++) {
      for (var j = 0; j < cols; j++) {
        grid[i][j].draw();
      }
    }
    text(countLit(), width/2,height - cellSize)
  }
}

function parseInstruction(instr) {
  var res = input_regex.exec(instr);
  
  console.log(res);
  var i = int(res[1]);
  var j = int(res[2]);
  
  if (instr.indexOf('rect') === 0) {
    light(i,j);
  } else if (instr.indexOf('rotate row') === 0) {
    shiftRow(i,j);
  } else if (instr.indexOf('rotate col') === 0) {
    shiftCol(i,j);
  }
}

function light(r, c) {
  for (var y = 0; y < r; y++) {
    for (var x = 0; x < c; x++) {
      grid[x][y].on();
    }
  }
}

function shiftRow(row, offset) {
  var prev = [];
  for (var y = 0; y < cols + offset; y++) {
    var col = y % cols;
    var cell = grid[row][col];
    var id = (col + offset) % cols;
    prev[(col + offset) % cols] = cell.lit;
    if (prev[col]) {
      cell.on();
    } else {
      cell.off();
    }
  }
}

function shiftCol(col, offset) {
  var prev = [];
  for (var x = 0; x < rows + offset; x++) {
    var row = x % rows;
    var cell = grid[row][col];
    prev[(row + offset) % rows] = cell.lit;
    if (prev[row]) {
      cell.on();
    } else {
      cell.off();
    }
  }
}

function countLit() {
  var c = 0;
   for (var y = 0; y < cols; y++) {
    for (var x = 0; x < rows; x++) {
      if(grid[x][y].lit) c++;
    }
  }
  return c;
}