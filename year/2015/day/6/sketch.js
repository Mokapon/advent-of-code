const EXAMPLE = 0;
const PART1 = 1;
const PART2 = 2;

let inputs = [];
let currentPuzzle;
let finished = false;

const COLS = 1000;
const ROWS = 1000;
let lightOnColor;
let lightOffColor;

let grid;
let instructions;
let currentLine;

function preload() {
    inputs[EXAMPLE] = loadStrings('input/example.txt');
    inputs[PART1] = loadStrings('input/part1.txt');
    inputs[PART2] = inputs[PART1];
}

function setup() {
    let canvas = createCanvas(COLS, ROWS);
    canvas.parent('sketch');

    lightOnColor = color('#00cc00')
    lightOffColor = color('#0f0f23')

    pixelDensity(1);

    loadPuzzle(EXAMPLE);
}

function draw() {
    if (finished) {
        noLoop();
    } else {
        nextStep();
    }
}

function nextStep() {
    instructions[currentIndex].apply();
    currentIndex++;

    if (currentIndex >= instructions.length) {
        finished = true;
        countLit();
        countTotalBrightness();
    }
}

function countLit() {
    let count = 0;
    for (let row of grid) {
        for (let light of row) {
            if (light.isOn) {
                count++;
            }
        }
    }
    console.log(count + ' lights on.');
}

function countTotalBrightness() {
    let totalBrightness = 0;
    for (let row of grid) {
        for (let light of row) {
            totalBrightness += light.brightness;
        }
    }
    console.log('total brightness: ' + totalBrightness);
}

function loadPuzzle(puzzle) {
    currentPuzzle = puzzle;
    // Load the puzzle here

    currentIndex = 0;
    instructions = [];
    for (let line of inputs[puzzle]) {
        instructions.push(createInstruction(line));
    }

    let index = 0;
    grid = [];
    for (let col = 0; col < COLS; col++) {
        grid[col] = [];
        for (let row = 0; row < ROWS; row++) {
            grid[col][row] = new Light(index++);
        }
    }

    background(lightOffColor);

    if (finished) {
        finished = false;
        loop();
    }
}
