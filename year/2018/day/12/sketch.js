const PLANT = '#';
const NOTHING = '.';
const NUM_GENERATIONS_P1 = 20;
const NUM_GENERATIONS_P2 = 50000000000;
const BASE_OFFSET = 1;

const INITIAL_STATE_REGEXP = /initial state: (.*)/

const LEGEND_Y = 30;
const INDEX_X = 60;
const LIST_X = 70;
const LIST_Y = 50;
const LINE_HEIGHT = 20;

let rules;
let currentGeneration;
let states;
let offsets;
let offset;
let maxOffset;
let maxLength;

let listPrinter;

function initDisplay() {
    createCanvas(3000, 500).parent('sketch');
    // Initialize display elements that don't change (textAlign, colors, etc.)
    textAlign(CENTER, CENTER);
}

function updateDisplay() {
    background(240);

    textAlign(CENTER, CENTER);
    text(-maxOffset, LIST_X, LEGEND_Y);
    for (let i = 0; i< maxLength; i+=10) {
        text(i, LIST_X + (i+maxOffset)*10, LEGEND_Y);
    }

    listPrinter.printList(currentGeneration);
}

function displayGeneration(index, y) {
    textAlign(RIGHT, CENTER);
    text (index + ':', INDEX_X, y);

    textAlign(LEFT, CENTER);
    if (states[index]) {
        drawGeneration(states[index], offsets[index], y);
    }
}

function drawGeneration(generation, generationOffset, y) {
    let textToPrint = generation.map(function(a) { if(a === NOTHING) { a+=' '; } return a; }).join(' ');
    let offsetDiff = maxOffset - generationOffset;
    for (let i = 0; i < offsetDiff; i++) {
        textToPrint = NOTHING + '  ' + textToPrint;
    }
    let legnthDiff = maxLength - generation.length - offsetDiff;
    for (let i = 0; i < legnthDiff; i++) {
        textToPrint += ' ' + NOTHING + ' ';
    }

    text (textToPrint, LIST_X, y);
}

function updatePuzzle() {
    let currentState = states[currentGeneration];
    let newState = '';
    let potStatus;
    let prevOffset = offset;

    for (let i = 0; i < currentState.length; i++) {
        potStatus = applyRules(currentState, i);
        newState += potStatus;
        if (potStatus === PLANT) {
            if (i === 0) {
                newState = NOTHING + newState;
                offset++;
            } else if(i === currentState.length-1) {
                newState = newState + NOTHING;
            }
        }
    }
    if (newState.substring(0,2)=== '..') {
        newState = newState.substring(1);
        offset--;
    }
    maxOffset = max(maxOffset, offset);
    maxLength = max(maxLength, newState.length + max(0, -offset+2));
    states.push(newState.split(''));
    offsets.push(offset);

    if (newState === currentState.join('')) {
        // The pattern will always stay the same, exepct for an offset
        let diffOffset = offset - prevOffset;
        let generationsLeft = generations - currentGeneration - 1;
        offset += diffOffset * generationsLeft;
        console.log('From here on, the pattern stays the same, but moves ' + abs(diffOffset) + ' pots to the ' + (diffOffset > 0 ? 'left' : 'right') + ' everytime.')
        console.log('Value of generation ' + generations + ': ' + getValue(states[states.length-1]));
        puzzleSolved();
    }

    if (++currentGeneration >= generations) {
        console.log('Value of generation ' + generations + ': ' + getValue(states[states.length-1]));
        puzzleSolved();
    }
}

function getValue(state) {
    let v = -offset;
    let value = 0;
    for (let pot of state) {
        if (pot === PLANT) {
            value += v;
        }
        v ++;
    }
    return value;
}

function applyRules(state, index) {
    for (let rule of rules) {
        if (rule.match(state, index)) {
            return rule.result;
        }
    }
    return NOTHING;
}

function initPuzzle(input) {
    currentGeneration = 0;
    generations = isPart1() ? NUM_GENERATIONS_P1 : NUM_GENERATIONS_P2;

    offset = BASE_OFFSET;
    maxOffset = offset;
    let prefix = '';
    for (let i = 0; i < offset; i++) {
        prefix+= NOTHING;
    }
    states = [ ];
    states.push((prefix + input[0].match(INITIAL_STATE_REGEXP)[1] + prefix).split(''));
    offsets = [ offset ];
    maxLength = states[0].length;

    rules = [];
    for (let i=2; i < input.length; i++) {
        rules.push(new Rule(input[i]));
    }

    listPrinter = new ListPrinter(LIST_Y, height - LIST_Y, LINE_HEIGHT, generations+1, displayGeneration);
}
