const EXAMPLE_P1 = 0;
const EXAMPLE_P2 = 1;
const PART1 = 2;
const PART2 = 3;

const inputs = [];
let currentPuzzle;
let finished = false;

function preload() {
    inputs[EXAMPLE_P1] = loadStrings('input/example1.txt');
    inputs[EXAMPLE_P2] = loadStrings('input/example2.txt');
    inputs[PART1] = loadStrings('input/part1.txt');
    inputs[PART2] = loadStrings('input/part2.txt');
}

function setup() {
    initDisplay();

    loadPuzzle(EXAMPLE_P1);
}

function draw() {
    updateDisplay();
    if (finished) {
        noLoop();
    } else {
        updatePuzzle();
    }
}

function loadPuzzle(puzzle) {
    currentPuzzle = puzzle;

    initPuzzle(inputs[currentPuzzle]);
    
    if (finished) {
        finished = false;
        loop();
    }
}

/*
 * --- UTIL FUNCTIONS ---
 */

function isPart1() {
    return currentPuzzle%2 === EXAMPLE_P1;
}

function isPart2() {
    return currentPuzzle%2 === EXAMPLE_P2;
}

function puzzleSolved() {
    finished = true;
}

