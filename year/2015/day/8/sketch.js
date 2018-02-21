const EXAMPLE = 0;
const PART1 = 1;
const PART2 = 2;

let inputs = [];
let currentPuzzle;
let finished = false;

const TOTAL_CHARS_Y = 25;
const DIFFERENCE_CHARS_Y = 45;

const STRINGS_Y = 80;
const LINE_HEIGHT = 20;

const STRING_WIDTH = 120
const STRING_X = 125;
const ACTUAL_X = 400;
const ESCAPED_X = 675;
let maxDisplayedStrings;
let displayScrollOffset;

const ESCAPE_REGEX = /\\(\\|")/g;
const HEXA_REGEX = /\\x([0-9a-f][0-9a-f])/g;

const TO_ESCAPE_REGEX = /(\\|")/g;

let currentIndex;

let strings;
let actualStrings;
let escapedStrings;

let totalAllChars;
let totalActualChars;
let totalEscapedChars;

function preload() {
    inputs[EXAMPLE] = loadStrings('input/example.txt');
    inputs[PART1] = loadStrings('input/part1.txt');
    inputs[PART2] = loadStrings('input/part2.txt');
}

function setup() {
    let canvas = createCanvas(850, 500);
    canvas.parent('sketch');

    textAlign(CENTER);
    maxDisplayedStrings = floor((height - STRINGS_Y)/LINE_HEIGHT);
    displayScrollOffset = floor(maxDisplayedStrings*2/3);

    loadPuzzle(EXAMPLE);
}

function draw() {
    background(240);

    textSize(13);
    textStyle(NORMAL);
    text('Total characters: ' + totalAllChars, width*1/4, TOTAL_CHARS_Y);
    text('Actual characters: ' + totalActualChars, width*2/4, TOTAL_CHARS_Y);
    text('Escaped characters: ' + totalEscapedChars, width*3/4, TOTAL_CHARS_Y);
    text('Total - Actual: ' + (totalAllChars - totalActualChars), width*1/3, DIFFERENCE_CHARS_Y);
    text('Escaped - Total: ' + (totalEscapedChars - totalAllChars), width*2/3, DIFFERENCE_CHARS_Y);

    textSize(12);
    displayList(currentIndex, strings.length, maxDisplayedStrings, STRINGS_Y, LINE_HEIGHT, displayScrollOffset, displayString);

    if (finished) {
        noLoop();
    } else {
        nextStep();
    }
}

function nextStep() {
    let string = strings[currentIndex];
    actualStrings[currentIndex] = getActualString(string);
    escapedStrings[currentIndex] = getEscapedString(string);

    totalAllChars += string.length;
    totalActualChars += actualStrings[currentIndex].length;
    totalEscapedChars += escapedStrings[currentIndex].length;

    currentIndex++;
    if (currentIndex >= strings.length) {
        finished = true;
    }
}

function getActualString(string) {
    let actualString = string.slice(1, string.length - 1);
    
    actualString = actualString.replace(ESCAPE_REGEX, '$1');
    actualString = actualString.replace(HEXA_REGEX, function(match, offset, string) {
            return String.fromCharCode(offset);
        });

    return actualString;
}

function getEscapedString(string) {
    let escapedString = string;
    escapedString = escapedString.replace(TO_ESCAPE_REGEX, '\\$1')
    escapedString = '"' + escapedString + '"';
    return escapedString;
}

function displayString(index, y) {
    let string = strings[index];
    text(string, STRING_X, y);
    if (currentIndex > index) {
        text(string.length, STRING_X + STRING_WIDTH, y);
        text(actualStrings[index], ACTUAL_X, y);
        text(actualStrings[index].length, ACTUAL_X + STRING_WIDTH, y);
        text(escapedStrings[index], ESCAPED_X, y);
        text(escapedStrings[index].length, ESCAPED_X + STRING_WIDTH, y);
    }
}

function loadPuzzle(puzzle) {
    currentPuzzle = puzzle;

    strings = inputs[puzzle];
    actualStrings = [];
    escapedStrings = [];

    currentIndex = 0;
    totalAllChars = 0;
    totalActualChars = 0;
    totalEscapedChars = 0;

    if (finished) {
        finished = false;
        loop();
    }
}
