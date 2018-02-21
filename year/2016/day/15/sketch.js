let EXAMPLE = 0;
let PART1 = 1;
let PART2 = 2;

let inputs = [];
let currentPuzzle;

// constants
let numbersRegex = /[0-9]+/g;
let minRadius = 50;
let maxRadius = 280;
let holeRadius = 10;

// simulation variables
let finished;

let disks;
let time;

// used to speed up the execution
let numDisksToLock;
let timeStep;
let numLockedElements;
let sizeSortedDisks;


function preload() {
  inputs[EXAMPLE] = loadStrings('input/example.txt');
  inputs[PART1] = loadStrings('input/part1.txt');
  inputs[PART2] = loadStrings('input/part2.txt');
}

function setup() {
  let canvas = createCanvas(600, 600);
  canvas.parent('sketch');

  loadPuzzle(EXAMPLE);
}

function draw() {
  background(230);

  for (disk of disks) {
    disk.draw();
  }

  if (finished) {
    console.log('Found starting time: ' + time);
    noLoop();
  } else {
    nextStep();
  }
}

function increaseTime() {
  if (numLockedElements === elementsToLock) {
    // step by step
    time += timeStep;
  } else {
    let nextToLock = sizeSortedDisks[numLockedElements];
    if (nextToLock.wishedPosition !== nextToLock.currentPosition) {
      // not correctly placed, move on
      time+= timeStep;
    } else {
      // Correctly placed, lock it
      numLockedElements++;
      timeStep*=nextToLock.numPositions;
      console.log('Locking disk '+ numLockedElements + ' in place. New time increments: ' + timeStep+ '.')
    }
  }
}

function nextStep() {
  increaseTime();

  for (disk of disks) {
    disk.updatePosition();
  }

  finished = isFinished();
}

function isFinished() {
  let done = true;
  for (let i = 0; i < disks.length; i++) {
    if (disks[i].currentPosition !== disks[i].wishedPosition) {
      done = false;
    }
  }
  return done;
}

function keyReleased() {
  if (key === 'R') {
    loadPuzzle(currentPuzzle);
  }
}

function loadPuzzle(puzzle) {
  currentPuzzle = puzzle;

  disks = []
  sizeSortedDisks = []
  time = 0;
  timeStep = 1;
  numLockedElements = 0;

  switch(puzzle) {
    case EXAMPLE: elementsToLock = 0; break;
    case PART1: elementsToLock = 2; break;
    case PART2: elementsToLock = 3; break;
  }

  for (let line of inputs[puzzle]) {
    let values = line.match(numbersRegex);
    let disk = new Disk(int(values[1]), int(values[3]));
    disks.push(disk);
  }

  sizeSortedDisks = disks.slice();
  sizeSortedDisks.sort(compareDiskPositions);
  for (let i = 0; i < disks.length; i++) {
    let disk = disks[i];
    disk.radius = map(i, 0, disks.length, minRadius, maxRadius);
    disk.wishedPosition = ((i+1)*disk.numPositions-(i+1))%disk.numPositions;
  }

  if (finished) {
    finished = false;
    loop();
  }
}

function compareDiskPositions(disk1, disk2) {
  return disk2.numPositions - disk1.numPositions;
}