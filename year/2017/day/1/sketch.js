const EXAMPLE = 0;
const PART1 = 1;

let inputs = [];
let input;
let currentPuzzle;
let finished = false;

// display
const P1_COLOR = '#2132ed';
const P2_COLOR = '#ed2114';
const MIX_COLOR = '#882188';
const MARGIN = 40;
const LINE_HEIGHT = 20;
const TEXT_Y = 50;
const RESPONSE_Y_OFFSET = 50;

let textPrinter;

// results
let resultPart1;
let resultPart2;

// iteration elements
let currentIndex;
let part2Delta;

// display information
let lines;
let lineLength;


function preload() {
    inputs[EXAMPLE] = loadStrings('input/example.txt');
    inputs[PART1] = loadStrings('input/part1.txt');
}

function setup() {
    createCanvas(1000, 600).parent('sketch');

    loadPuzzle(EXAMPLE);
    
    fill(0);
    textSize(15);
}

function draw() {
    background(240);

    textPrinter.printBlock();

    if (!finished) {
        textPrinter.changeCharStyle(currentIndex, MIX_COLOR, BOLD);
        textPrinter.changeCharStyle((currentIndex+1)%input.length, P1_COLOR, BOLD);
        textPrinter.changeCharStyle((currentIndex+part2Delta)%input.length, P2_COLOR, BOLD);
    }

    push();
    textAlign(CENTER);
    textSize(20);

    let y = textPrinter.endingY + RESPONSE_Y_OFFSET;
    fill(MIX_COLOR);
    text('Progress: ' + currentIndex + ' characters of ' + input.length, width/2, y);
    
    y+= LINE_HEIGHT*2;
    fill(P1_COLOR);
    text('(P1) Captcha: ' + resultPart1, width/3, y);
    fill(P2_COLOR);
    text('(P2) Captcha: ' + resultPart2, width*2/3, y);

    pop();

    if (finished) {
        noLoop();
    } else {
        nextStep();
    }
}

function nextStep() {
    let len = input.length;
    let currentDigit = int(input.charAt(currentIndex));
    
    if (currentDigit === int(input.charAt((currentIndex+1)%len))) {
        resultPart1 += currentDigit;
    }
    if (currentDigit === int(input.charAt((currentIndex+part2Delta)%len))) {
        resultPart2 += currentDigit;
    }

    if (++currentIndex >= input.length) {
        finished = true;
    }
}

function loadPuzzle(puzzle) {
    currentPuzzle = puzzle;
    input = inputs[currentPuzzle][0];

    currentIndex = 0;
    part2Delta = input.length/2;
    textPrinter = new TextBlockPrinter(MARGIN, TEXT_Y, width - MARGIN*2, LINE_HEIGHT, input);

    resultPart1 = 0;
    resultPart2 = 0;
    // Load the puzzle here

    if (finished) {
        finished = false;
        loop();
    }
}
