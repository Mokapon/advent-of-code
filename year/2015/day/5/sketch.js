const EXAMPLE = 0;
const PART1 = 1;
const PART2 = 2;

let inputs = [];
let currentPuzzle;
let finished = false;

const REGEXP_VOWELS = /[aeiou]/g;
const REGEXP_DOUBLE = /([a-z])\1/g;
const REGEXP_EXCLUSIONS = /ab|cd|pq|xy/;

const REGEXP_COUPLES = /([a-z][a-z]).*\1/;
const REGEXP_REPEAT = /([a-z]).\1/;

let inputStrings;
let naughtyStrings;
let niceStrings;
let currentIndex;

function preload() {
    inputs[EXAMPLE] = loadStrings('input/example.txt');
    inputs[PART1] = loadStrings('input/input.txt');
    inputs[PART2] = inputs[PART1];
}

function setup() {
    let canvas = createCanvas(500, 200);
    canvas.parent('sketch');

    textAlign(CENTER);

    loadPuzzle(EXAMPLE);
}

function draw() {
    background(240);

    text('Nice: ' + niceStrings, width*2/5, 40);
    text('Naughty: ' + naughtyStrings, width*3/5, 40);
    text(inputStrings[currentIndex], width/2, 80);

    if (finished) {
        noLoop();
    } else {
        nextStep();
    }
}

function nextStep() {
    if (isNice(inputStrings[currentIndex])) {
        niceStrings++;
    } else {
        naughtyStrings++;
    }

    if (currentIndex >= inputStrings.length -1) {
        finished = true;
    } else {
        currentIndex++;
    }
}

function isNice(string) {
    if (currentPuzzle === PART1) {
        let vowelsMatch = string.match(REGEXP_VOWELS);
        return   vowelsMatch && vowelsMatch.length >= 3 &&
                 string.match(REGEXP_DOUBLE) &&
                !string.match(REGEXP_EXCLUSIONS);
    } else {
        return string.match(REGEXP_COUPLES) &&
               string.match(REGEXP_REPEAT); 
    }
}

function loadPuzzle(puzzle) {
    currentPuzzle = puzzle;
    // Load the puzzle here

    inputStrings = inputs[puzzle];
    currentIndex = 0;
    naughtyStrings = 0;
    niceStrings = 0;

    if (finished) {
        finished = false;
        loop();
    }
}
