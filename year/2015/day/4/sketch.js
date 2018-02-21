const EXAMPLE = 0;
const PART1 = 1;
const PART2 = 2;

let inputs = [];
let currentPuzzle;
let finished = false;

const CHECKS_PER_ITER = 1000;
let key;
let match;
let currentIndex;
let hash;

function preload() {
    inputs[EXAMPLE] = loadJSON('input/example.json');
    inputs[PART1] = loadJSON('input/part1.json');
    inputs[PART2] = loadJSON('input/part2.json');
}

function setup() {
    let canvas = createCanvas(500, 200);
    canvas.parent('sketch');

    textAlign(CENTER);
    loadPuzzle(EXAMPLE);
}

function draw() {
    background(240);

    text('Key: '  + fullKey, width/2, 40);
    text('Hash: ' + hash,    width/2, 70);

    if (finished) {
        noLoop();
    } else {
        nextStep();
    }
}

function nextStep() {
    for (let i = 0; i < CHECKS_PER_ITER; i++) {
        fullKey = key + currentIndex;
        hash = md5(fullKey);

        if (hash.slice(0,match.length) === match) {
            console.log('Found hash at index ' + currentIndex);
            finished = true;
            break;
        } else {
            currentIndex ++;
        }
    }
}

function loadPuzzle(puzzle) {
    currentPuzzle = puzzle;
    // Load the puzzle here
    key = inputs[puzzle].key;
    match = inputs[puzzle].match;
    currentIndex = 1;
    fullKey = '';
    hash = '';

    if (finished) {
        finished = false;
        loop();
    }
}
