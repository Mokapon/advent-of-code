// Override to load only two files
toLoad = [ EXAMPLE_P1, PART1 ];

// display
const Y_RESULTS = 20;
const Y_LEGEND = 50;
const Y_LIST = 100;
const LINE_HEIGHT = 20;
let xRow;
let xMin, xMax, xDiff;
let xNum, xDenom, xDiv;
let listPrinter;

// puzzle data
let rows;
let currentIndex;
let checksumP1;
let checksumP2;

function initDisplay() {
    createCanvas(1000, 500).parent('sketch');
    
    xRow = width*2.5/11;
    xMin = width*6/12;
    xMax = width*7/12;
    xDiff = width*8/12;
    xNum = width*9.5/12;
    xDenom = width*10.5/12;
    xDiv = width*11.5/12;

    textAlign(CENTER, CENTER);
}

function updateDisplay() {
    background(240);

    listPrinter.printList(currentIndex);

    // legend
    text('Min value', xMin, Y_LEGEND);
    text('Max value', xMax, Y_LEGEND);
    text('Difference', xDiff, Y_LEGEND);
    text('Numerator', xNum, Y_LEGEND);
    text('Denominator', xDenom, Y_LEGEND);
    text('Division', xDiv, Y_LEGEND);

    // results
    text('(P1) Checksum: ' + checksumP1, xMax, Y_RESULTS);
    text('(P2) Checksum: ' +checksumP2, xDenom, Y_RESULTS);
}

function displayRow(index, y) {
    let row = rows[index];
    text(row.values.join(' '), xRow, y);

    text(row.min, xMin, y);
    text(row.max, xMax, y);
    text(row.diff, xDiff, y);
    text(row.num, xNum, y);
    text(row.denom, xDenom, y);
    text(row.div, xDiv, y);
}

function updatePuzzle() {
    let row = rows[currentIndex];
    let values = row.values;
    
    // Part 1: min & max. Array is sorted
    row.min = values[0];
    row.max = values[values.length - 1];
    row.diff = row.max - row.min;
    checksumP1 += row.diff;

    // Part 2: evenly divisible
    for (let i=0; i < values.length; i++) {
        for (let j=i+1; j < values.length; j++) {
            let div = values[j] / values[i];
            if (div - int(div) === 0) {
                row.num = values[j];
                row.denom = values[i];
                row.div = div;
            }
        }    
    }
    checksumP2 += row.div;

    if (++currentIndex >= rows.length) {
        puzzleSolved();
    }
}

function initPuzzle(input) {
    currentIndex = 0;
    checksumP1 = 0;
    checksumP2 = 0;

    rows = [];
    for (let row of input) {
        let values = row.replace(/ +/g, ' ').split(' ');
        values.sort(compareValues);
        rows.push( { values: values } );
    }

    listPrinter = new ListPrinter(Y_LIST, height - Y_LIST, LINE_HEIGHT, rows.length, displayRow);
}
