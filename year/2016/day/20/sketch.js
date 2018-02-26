const EXAMPLE = 0;
const PART1 = 1;
const PART2 = 2;

// display constants
const MARGIN = 10;
const RANGE_HEIGHT = 10;
const RANGE_Y = 100;
const RANGE_DIAMETER = 15;
const TEXT_MARGIN = 5;
const TEXT_Y = RANGE_Y + RANGE_HEIGHT + TEXT_MARGIN;

let excludedColor;
let validColor;

let inputs = [];
let currentPuzzle;
// simulation status
let finished;

// simulation variables
let totalRange;
let validRanges;
let excludedRanges;
let currentRange;

function preload() {
  inputs[EXAMPLE] = loadStrings('input/example.txt');
  inputs[PART1] = loadStrings('input/part1.txt');
}

function setup() {
  let canvas = createCanvas(1000 + MARGIN * 2, 250);
  canvas.parent('sketch');

  textSize(15);
  textAlign(CENTER, TOP);

  excludedColor = color(35,35,105);
  validColor = color(0,155,255);
  //frameRate(10);
  loadPuzzle(EXAMPLE);
}

function draw() {
  background(230);

  // draw ranges
  fill(excludedColor);
  totalRange.draw();

  for (let range of validRanges) {
    fill(validColor);
    range.draw();
  }

  if (finished) {
    noLoop();
  } else {
    nextStep();
  }
}

function nextStep() {
  let toExclude = excludedRanges[currentRange];
  if (!toExclude) {
    console.log('[PART 1] Lowest value of unblocked IP: ' + validRanges[0].low);
    console.log('[PART 2] Number of allowed IPs: ' + countAllowed());
    finished = true;
    return;
  }

  // Look for valid range constaining at least part of the one to exclude
  let count = 0;
  for (let i=validRanges.length-1; i >=0; i--) {
    let validRange = validRanges[i];
    if (toExclude.high < validRange.low) {
      continue;
    } else if (toExclude.low > validRange.high) {
      break; // the following valid ranges will be even farther away
    }

    // We found an intersecting range
    let lowSideIncluded = toExclude.low >= validRange.low && toExclude.low <= validRange.high;
    let highSideIncluded = toExclude.high >= validRange.low && toExclude.high <= validRange.high;
    if (lowSideIncluded) {
      if (highSideIncluded) {
        // need to separate the current valid range in 2
        let newRange = new Range(toExclude.high+1, validRange.high);
        newRange.computePosition();
        if (newRange.low <= newRange.high) {
          validRanges.splice(i+1, 0, newRange);
        }
      }
      // need to reduce the valid range
      validRange.setHigh(toExclude.low-1);
      if (validRange.high<validRange.low) {
        validRanges.splice(i,1);
      }
    } else if (highSideIncluded) {
      // need to reduce the valid range
      validRange.setLow(toExclude.high+1);
      if (validRange.high<validRange.low) {
        validRanges.splice(i,1);
      }
    } else if (toExclude.high >= validRange.high && toExclude.low <= validRange.low) {
      // valid range is completely included in the range to exclude
      validRanges.splice(i,1);
    }
  }
  currentRange++;
}

function countAllowed() {
  let allowedIPs = 0;
  for (let range of validRanges) {
    allowedIPs += range.high - range.low + 1;
  }
  return allowedIPs;
}

function keyReleased() {
  if (key === 'R') {
    loadPuzzle(currentPuzzle);
  }
}

function loadPuzzle(puzzle) {
  currentPuzzle = puzzle;

  totalRange = createRange(inputs[puzzle][0]);
  totalRange.computePosition();
  validRanges = [createRange(inputs[puzzle][0])];

  currentRange = 0;
  excludedRanges = [];
  for (let i = 1; i < inputs[puzzle].length; i++) {
    excludedRanges.push(createRange(inputs[puzzle][i]))
  }
  
  if (finished) {
    finished = false;
    loop();
  }
}

function createRange(input) {
  let values = input.split('-');
  let range = new Range(int(values[0]), int(values[1]));
  if (totalRange) {
    range.computePosition();
  }
  return range;
}