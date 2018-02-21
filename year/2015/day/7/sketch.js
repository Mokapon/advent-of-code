const EXAMPLE = 0;
const PART1 = 1;
const PART2 = 2;

let inputs = [];
let currentPuzzle;
let finished = false;

const DELTA_Y = 15;
const DELTA_X = 5;

const GATE_SIZE = 10;

const TOP_MARGIN = 15;
const LEFT_MARGIN = 50;
const RIGHT_MARGIN = 150;
const LABEL_MARGIN = 15;
const VALUE_MARGIN = 35;
let wireEnd;
let labelX;
let valueX;
let startingX;
let startingY;

let wires;
let gates;
let currentIndex;

function preload() {
    inputs[EXAMPLE] = loadStrings('input/example.txt');
    inputs[PART1] = loadStrings('input/part1.txt');
    inputs[PART2] = loadStrings('input/part2.txt');
}

function setup() {
    let canvas = createCanvas(500, 500);
    canvas.parent('sketch');

    textAlign(LEFT, CENTER);
    textStyle(BOLD);
    strokeWeight(2);

    loadPuzzle(EXAMPLE);
}

function draw() {
    background(240);

    for (let gate of gates) {
        gate.draw();
    }
    for (let wireId of Object.keys(wires)) {
        wires[wireId].draw();
    }

    if (finished) {
        noLoop();
    } else {
        nextStep();
    }
}

function nextStep(){
    gates[currentIndex].apply();
    currentIndex++;

    if (currentIndex >= gates.length) {
        finished = true;
        if (wires['a']) {
            console.log('a: ' + wires['a'].value)
        }
    }
}

function loadPuzzle(puzzle) {
    currentPuzzle = puzzle;
    // Load the puzzle here

    wires = [];
    gates = [];
    currentIndex = 0;

    parseInput(inputs[currentPuzzle].slice());
    
    if (finished) {
        finished = false;
        loop();
    }
}

/*
 * The board is created line by line, making sure that for each gate
 * the required input exists, otherwise, it is created first, recursively
 */
function parseInput(toParse) {
    startingX = LEFT_MARGIN;
    startingY = TOP_MARGIN + DELTA_Y / 2;
    
    let toParseMap = [];
    for (let line of toParse) {
        let elements = line.split (' -> ');
        toParseMap[elements[1]] = elements[0];
    }

    for (let wireId of Object.keys(toParseMap)) {
        if (!wires[wireId]) {
            parseLine(wireId, toParseMap);
        }
    }

    wireEndX = startingX;
    labelX = wireEndX + LABEL_MARGIN;
    valueX = labelX + VALUE_MARGIN;
    resizeCanvas(startingX + RIGHT_MARGIN, startingY);
}

function parseLine(wireId, toParseMap) {
    // Look at logic gate
    let gateElements = toParseMap[wireId].split(' ');
    
    let gateInputs = [];
    let gateType;
    switch(gateElements.length) {
        case 1:
        gateType = GATE_VALUE;
        gateInputs.push(getInput(gateElements[0], toParseMap));
        break;
        case 2:
        gateType = gateElements[0];
        gateInputs.push(getInput(gateElements[1], toParseMap));
        break;
        case 3:
        gateType = gateElements[1];
        gateInputs.push(getInput(gateElements[0], toParseMap));
        gateInputs.push(getInput(gateElements[2], toParseMap));
        break;
    }

    let gateX = startingX;
    if (gateType === GATE_VALUE && !gateInputs[0].id) {
        // If we're receiving some value, align with previous gate
        gateX = max(LEFT_MARGIN, gateX - GATE_SIZE - DELTA_X);
    }

    // Find proper X location for the gate
    for (let input of gateInputs) {
        if (input.id) {
            gateX += DELTA_X;
        }
    }
    // Create the gate object
    let gate = new Gate(gateType, gateX, startingY, gateInputs);
    gates.push(gate);

    gateX += GATE_SIZE;

    // Create the wire
    let wire = new Wire(wireId, gateX, startingY);
    wires[wireId] = wire;

    gate.output = wire;

    gateX += DELTA_X;
    startingX = max(startingX, gateX);
    startingY += DELTA_Y;
}

function getInput(id, toParseMap) {
    if (id.match(/^[0-9]+$/)) {
        return int(id);
    } else if (!wires[id]) {
        parseLine(id, toParseMap);
    }
    return wires[id];
}

