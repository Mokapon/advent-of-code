let EXAMPLE = 0;
let PART1 = 1;
let PART2 = 2;

let inputs = [];
let currentPuzzle;

let finished;
let requiredLength;
let initialState;
let data;
let checkSum;

function preload() {
  inputs[EXAMPLE] = loadStrings('input/example.txt');
  inputs[PART1] = loadStrings('input/part1.txt');
  inputs[PART2] = loadStrings('input/part2.txt');
}

function setup() {
  let canvas = createCanvas(1000, 250);
  canvas.parent('sketch');

  textAlign(CENTER,CENTER);
  textSize(15);

  frameRate(3);
  loadPuzzle(EXAMPLE);
}

function draw() {
  background(230);

  // draw
  text('Input: ' + initialState, width/3, 50);
  text('Data size: ' + data.length + '/' + requiredLength, width*2/3, 40);
  text('CheckSum length: ' + checkSum.length, width*2/3, 60);

  text(data, width/2, 150);
  text(checkSum, width/2, 200);

  // update string
  nextStep();

  if (finished) {
    noLoop();
  }
}

function nextStep() {
  if (data.length < requiredLength) {
    data = dragonCurve(data);
    if (data.length >= requiredLength) {
      data = data.slice(0, requiredLength);
      checkSum = generateChecksum(data);
    }
  } else if (checkSum.length % 2 === 0) {
    checkSum = generateChecksum(checkSum);
  } else {
    finished = true;
    console.log(checkSum);
  }
}

function dragonCurve(input) {
  let result = input + '0';
  for (let i=input.length-1; i>=0; i--) {
    let char = input[i];
    result += char==='0'? '1' : '0';
  }
  return result;
}

function generateChecksum(input) {
  let checkSum = '';
  for (let i = 0; i < input.length-1; i+=2) {
    if (input[i] === input[i+1]) {
      checkSum += '1';
    } else {
      checkSum += '0';
    }
  }
  return checkSum;
}

function keyReleased() {
  if (key === 'R') {
    loadPuzzle(currentPuzzle);
  }
}

function loadPuzzle(puzzle) {
  currentPuzzle = puzzle;

  initialState = inputs[puzzle][0];
  data = initialState;
  requiredLength = int(inputs[puzzle][1]);
  checkSum = '';

  if (finished) {
    finished = false;
    loop();
  }
}
