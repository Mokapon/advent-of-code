const ELEMENT_HEIGHT = 25;
const ELEMENT_WIDTH = 35;

let steps;
let jumps;
let listPrinter;
let currentIndex;

let stepsPerFrame;

function initDisplay() {
    createCanvas(1300, 700).parent('sketch');
    // Initialize display elements that don't change (textAlign, colors, etc.)
    textAlign(CENTER, CENTER);
    noStroke();
}

function updateDisplay() {
    background(240);
    listPrinter.printList(currentIndex);
}

function displayElement(index, x, y) {
    let textToPrint = jumps[index];
    if (index === currentIndex) {
        //textToPrint = '(' + text + ')';
        fill(AOC_ACCENT_COLOR);
        ellipse(x, y, min(ELEMENT_HEIGHT, ELEMENT_WIDTH));
        textSize(15);
        textStyle(BOLD);
    } else {
        textSize(12);
        textStyle(NORMAL);
    }
    fill(0);
    text(textToPrint, x, y);
}

function updatePuzzle() {
    let newIndex;
    for (let i=0; i < stepsPerFrame; i++) {
        newIndex = currentIndex + jumps[currentIndex];
        if (isPart1() || jumps[currentIndex] < 3 ) {
            jumps[currentIndex] += 1;
        } else {
            jumps[currentIndex] -= 1;
        }
        currentIndex = newIndex;
        steps++;

        if (currentIndex >= jumps.length || currentIndex < 0) {
            console.log('Exit reached in ' + steps + ' steps.')
            puzzleSolved();
            return;
        }
    }
}

function initPuzzle(input) {
    steps = 0;
    currentIndex = 0;
    jumps = input.map(function(a) { return int(a) } );
    stepsPerFrame = jumps.length > 1000 ? 10000 : 1;

    listPrinter = new ListAsGridPrinter(createVector(ELEMENT_WIDTH/2,ELEMENT_HEIGHT/2), createVector(width,height), createVector(ELEMENT_WIDTH,ELEMENT_HEIGHT), jumps.length, displayElement);
}
