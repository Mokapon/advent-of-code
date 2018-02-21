const EXAMPLE = 0;
const PART1 = 1;

let inputs = [];
let currentPuzzle;
let finished = false;

const TOTAL_AREA_Y = 25;
const TOTAL_RIBBON_Y = 45;
const BOXES_Y = 80;
const LINE_HEIGHT = 20;
const BOXES_X = 150;
const AREA_X = 250;
const RIBBON_X = 355;
let maxDisplayedBoxes;

let boxes;
let currentIndex;
let totalArea;
let totalRibbon;

function preload() {
    inputs[EXAMPLE] = loadStrings('input/example.txt');
    inputs[PART1] = loadStrings('input/input.txt');
}

function setup() {
    let canvas = createCanvas(500, 500);
    canvas.parent('sketch');

    textAlign(CENTER);
    maxDisplayedBoxes = floor((height - BOXES_Y)/LINE_HEIGHT);

    loadPuzzle(EXAMPLE);
}

function draw() {
    background(240);

    textSize(13);
    text('Area required: ' + totalArea + ' square feet', width/2, TOTAL_AREA_Y);
    text('Ribbon required: ' + totalRibbon + ' feet', width/2, TOTAL_RIBBON_Y);

    textSize(12);
    let y = BOXES_Y;

    let startIndex = max(0, currentIndex - maxDisplayedBoxes);
    for (let i = 0; i<min(boxes.length, maxDisplayedBoxes); i++) {
        let box = boxes[startIndex + i];
        text(box.description, BOXES_X, y);
        if (box.requiredArea) {
            text(box.requiredArea, AREA_X, y);
            text(box.requiredRibbon, RIBBON_X, y);
        }
        y += LINE_HEIGHT;
    }

    if (finished) {
        noLoop();
    } else {
        // Update the state here
        boxes[currentIndex].computeArea();
        boxes[currentIndex].computeRibbon();
        totalArea += boxes[currentIndex].requiredArea;
        totalRibbon += boxes[currentIndex].requiredRibbon;

        currentIndex++;
        if (currentIndex >= boxes.length) {
            finished = true;
        }
    }
}

function loadPuzzle(puzzle) {
    currentPuzzle = puzzle;

    // Load the puzzle here
    totalArea = 0;
    totalRibbon = 0;
    currentIndex = 0;
    boxes = [];
    for (let input of inputs[puzzle]) {
        boxes.push(new Box(input));
    }

    if (finished) {
        finished = false;
        loop();
    }
}
