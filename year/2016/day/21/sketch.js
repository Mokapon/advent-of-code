let EXAMPLE = 0;
let PART1 = 1;
let PART2 = 2;

let inputs = [];
let currentPuzzle;

// display constants
let LINE_HEIGHT = 25;
let MARGIN = 20;
let PASSWORD_X = 500;

// simulation status
let finished = false;
let auto = false;
let fps = 10;

// simulation variables
let operations;
let currentOperation;
let password;

function preload() {
  inputs[EXAMPLE] = loadStrings('input/example.txt');
  inputs[PART1] = loadStrings('input/part1.txt');
  inputs[PART2] = loadStrings('input/part2.txt');
}

function setup() {
  let canvas = createCanvas(650, 2*MARGIN);
  canvas.parent('sketch');

  frameRate(fps);

  loadPuzzle(EXAMPLE);
}

function draw() {
  background('#0f0f23');
  textSize(16);
  noStroke();

  // print operations
  textAlign(LEFT, TOP);
  textFont('"Source Code Pro", monospace');
  
  for (let operation of operations) {
    if (operation) {
      operation.draw();
    }
  }

  // draw 'done' line
  if (currentOperation >= operations.length || currentOperation < 0) {
    fill('#00cc00');
    textStyle(BOLD);
  } else {
    fill('#cccccc');
    textStyle(NORMAL);
  }
  textAlign(LEFT, BOTTOM);
  text('> done <', MARGIN, height - MARGIN);
  
  textAlign(CENTER, CENTER);
  textStyle(NORMAL);
  fill('#cccccc');
  // reverse
  if (currentPuzzle === PART2) {
    text('**Reverse**', PASSWORD_X, 30);
  }

  // draw current password
  textSize(22);
  text(password, PASSWORD_X, min(200, height/2));

  // move to next
  if (finished) {
    noLoop();
  } else if (auto) {
    applyInstruction();
  }
}

function applyInstruction() {
  if (currentOperation >= operations.length || currentOperation < 0) {
    console.log('FINISHED: ' + password);
    finished = true;
  } else {
    let operation = operations[currentOperation];
    if (currentPuzzle !== PART2) {
      password = operation.apply(password);
      currentOperation++;
    } else {
      password = operation.reverse(password);
      currentOperation--;
    }
  }
}

function keyReleased() {
  if (keyCode === ENTER && currentOperation < operations.length) {
    if (auto) {
      auto = false;
    } else {
      applyInstruction();
    }
  } else if (key === 'R') {
    loadPuzzle(currentPuzzle);
  } else if (key === 'A') {
    auto = !auto;
  } else if (key === 'P') {
    fps = min(60, fps +5);
    frameRate(fps);
  } else if (key === 'M') {
    fps = max(5, fps -5);
    frameRate(fps);
  }
}

function loadPuzzle(puzzle) {
  currentPuzzle = puzzle;

  let numOperations = inputs[currentPuzzle].length - 1;
  
  // reset variables
  password = inputs[currentPuzzle][0];
  operations = [];
  currentOperation = currentPuzzle !== PART2? 0 : numOperations - 1;

  // parse data
  for (let l = 0; l < numOperations; l++) {
    let operation = new Operation(l, inputs[currentPuzzle][l+1]);
    operations.push(operation);
  }

  // restart loop
  if (finished) {
    finished = false;
    loop();
  }

  // set canvas height
  let codeHeight = (numOperations+1) * LINE_HEIGHT;
  resizeCanvas(width, 2 * MARGIN + codeHeight);
}