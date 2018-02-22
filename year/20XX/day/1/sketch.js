const EXAMPLE = 0;
const PART1 = 1;
const PART2 = 2;

let inputs = [];
let currentPuzzle;
let finished = false;

function preload() {
    inputs[EXAMPLE] = loadStrings('input/example.txt');
    inputs[PART1] = loadStrings('input/part1.txt');
    inputs[PART2] = loadStrings('input/part2.txt');
}

function setup() {
    let canvas = createCanvas(500, 200);
    canvas.parent('sketch');

    loadPuzzle(EXAMPLE);
}

function draw() {
    background(240);

    if (finished) {
        noLoop();
    } else {
        // Update the state here
    }
}

function loadPuzzle(puzzle) {
    currentPuzzle = puzzle;
    // Load the puzzle here

    if (finished) {
        finished = false;
        loop();
    }
}
