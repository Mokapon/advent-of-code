const EXAMPLE = 0;
const PART1 = 1;

// Status
let inputs = [];
let currentPuzzle;
let finished = false;

// Display
const MARGIN = 10;
const BASEMENT_X = 600;
const COUNT_X = 300;
const COUNT_Y = 30;
const WORD_Y = 60;
let charWidth;
let lineHeight;
let lineMaxChars;

// Simulation
let mappings;
let word;
let currentIndex;
let count;
let basementFirstIndex;

function preload() {
    inputs[EXAMPLE] = loadStrings('input/example.txt');
    inputs[PART1] = loadStrings('input/part1.txt');
}

function setup() {
    let canvas = createCanvas(900, 930);
    canvas.parent('sketch');

    noStroke();
    textAlign(CENTER);
    textSize(12);
    charWidth = textSize()/2;
    lineHeight = textSize()*1.5;
    lineMaxChars = floor((width - MARGIN*2)/charWidth);

    mappings = [];
    mappings['('] =  1;
    mappings[')'] = -1;

    loadPuzzle(EXAMPLE);
}

function draw() {
    push();
    fill(240);
    rect(0, 0, width, WORD_Y - lineHeight)
    fill(0);
    textSize(16);
    text('Floor: ' + count, COUNT_X, COUNT_Y);
    text('Basement: ' + ((basementFirstIndex < 0)? '?': basementFirstIndex), BASEMENT_X, COUNT_Y);
    pop();

    draw_current_char();

    if (finished) {
        noLoop();
    } else {
        nextStep();
    }
}

function draw_word() {
    let startIndex = 0;
    let y = WORD_Y;
    while(startIndex < word.length) {
        numToDisplay = min(word.length - startIndex, lineMaxChars);
        let x = MARGIN + charWidth/2 + (lineMaxChars - numToDisplay)/2*charWidth;
        for (let i = 0; i <numToDisplay; i++) {
            text(word.charAt(i+startIndex), x, y);
            x+=charWidth;
        }
        startIndex += numToDisplay;
        y += lineHeight;
    }
}

function draw_current_char() {
    push();
    let index = currentIndex -1;
    if (index < 0) {
        return;
    }
    let line = floor(index / lineMaxChars);
    let numToDisplay = lineMaxChars;
    if (line === floor(word.length / lineMaxChars)) {
        numToDisplay = word.length%lineMaxChars;
    }
    let y = WORD_Y + line * lineHeight;
    let x = MARGIN + charWidth/2 + (lineMaxChars - numToDisplay)/2*charWidth + index % lineMaxChars * charWidth;

    colorMode(HSB);
    let c = map(abs(count), 0, word.length/10, 0, 360);
    fill(c, 100, 100);
    text(word.charAt(index),x,y);
    pop();
}

function nextStep() {
    count += mappings[word.charAt(currentIndex)];
    currentIndex++;
    
    if (basementFirstIndex <0 && count<0) {
        basementFirstIndex = currentIndex;
    }

    if (currentIndex >= word.length) {
        finished = true;
    }
}

function loadPuzzle(puzzle) {
    currentPuzzle = puzzle;
    // Load the puzzle here
    currentIndex = 0;
    basementFirstIndex = -1;
    word = inputs[puzzle][0];
    count = 0;

    background(240);
    fill(0);
    draw_word();

    if (finished) {
        finished = false;
        loop();
    }
}
