const EXAMPLE_P1 = 0;
const EXAMPLE_P2 = 1;
const PART1 = 2;
const PART2 = 3;
const INPUT_FILES = [];
INPUT_FILES[EXAMPLE_P1] = 'input/example1.txt';
INPUT_FILES[EXAMPLE_P2] = 'input/example2.txt';
INPUT_FILES[PART1] = 'input/part1.txt';
INPUT_FILES[PART2] = 'input/part2.txt';

const inputs = [];
let currentPuzzle;
let finished = false;

let toLoad = [EXAMPLE_P1, EXAMPLE_P2, PART1, PART2];

function preload() {
    for (let element of toLoad) {
        inputs[element] = loadStrings(INPUT_FILES[element]);
    }
}

function setup() {
    initDisplay();

    loadPuzzle(toLoad[0]);
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

