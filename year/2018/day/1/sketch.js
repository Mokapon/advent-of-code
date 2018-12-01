const EXAMPLE = 0;
const PART1 = 1;

let inputs = [];
let currentPuzzle;
let finished = false;

const TOTAL_Y = 25;
const RESULT_PART1_Y = 45;
const RESULT_PART2_Y = 65;
const LIST_Y = 95;
const LINE_HEIGHT = 20;

let listPrinter;
let values;
let currentIndex;
let total;
let resultPart1;
let frequencies;
let firstReachedTwice;
let loops;
let i;

function preload() {
    inputs[EXAMPLE] = loadStrings('input/example.txt');
    inputs[PART1] = loadStrings('input/part1.txt');
}

function setup() {
    createCanvas(200, 500).parent('sketch');

    textAlign(CENTER, CENTER);

    loadPuzzle(EXAMPLE);
}

function draw() {
    background(240);

    // Print result
    text('Total: ' + total + ' (loop ' + loops + ')' , width/2, TOTAL_Y);
    text('(P1) Sum of frequencies: ' + (resultPart1 || total), width/2, RESULT_PART1_Y);
    text('(P2) First reached twice: ' + firstReachedTwice, width/2, RESULT_PART2_Y);

    listPrinter.printList(currentIndex);

    if (finished) {
        noLoop();
    } else {
        nextStep();
    }
}

function nextStep() {
    let repeats = loops > 1 ? values.length : 1;

    for (let i = 0; i < repeats; i++) {
        addNextValue();

        if (finished) {
            return;
        }
    }
}

function addNextValue() {
    total += int(values[currentIndex++]);
    if (firstReachedTwice < 0) {
        if(frequencies.indexOf(total) === -1) {
            frequencies.push(total);
        } else {
            firstReachedTwice = total;
            finished = true;
            return;
        }
    }
    if (currentIndex >= values.length) {
        if (loops++ === 1) {
            resultPart1 = total;
        }
        if (firstReachedTwice === -1) {
            currentIndex = 0;
        } else {
            finished = true;
        }
    }
}

function displayNumber(index, position) {
    if (index < currentIndex) {
        textStyle(BOLD);
    } else {
        textStyle(NORMAL);
    }
    text(values[index], width/2, position);
}

function loadPuzzle(puzzle) {
    currentPuzzle = puzzle;
    
    values = inputs[currentPuzzle];
    currentIndex = 0;
    total = 0;
    loops = 1;
    resultPart1 = undefined;
    // part 2
    frequencies = [total];
    firstReachedTwice = -1;

    listPrinter = new ListPrinter(LIST_Y, height - LIST_Y, LINE_HEIGHT, values.length, displayNumber);
    
    if (finished) {
        finished = false;
        loop();
    }
}
