const GRID_SIZE = 300;
const CELL_SIZE = 6;

const STARTING_SIZE = 3;

let serialNumber;
let grid;
let currentPosition;
let bestPosition;
let bestPowerValue;
let numIterations;

function initDisplay() {
    createCanvas(2000, 2000).parent('sketch');
    // Initialize display elements that don't change (textAlign, colors, etc.)
    textAlign(CENTER, CENTER);
    textSize(4);
}

function updateDisplay() {
    updatePixels(); // reset the view to the grid alone
    highlightZone(); // highlight current zone that is being analyzed
}

function drawGrid() {
    for (let x = 0; x < GRID_SIZE; x++) {
        for (let y = 0; y < GRID_SIZE; y++) {
            //rect(x*CELL_SIZE, y*CELL_SIZE, CELL_SIZE, CELL_SIZE);
            text(grid[x][y], x*CELL_SIZE+CELL_SIZE/2, y*CELL_SIZE+CELL_SIZE/2);
        }
    }
}

function highlightZone() {
    push();
    noFill();
    stroke(AOC_ACCENT_COLOR);
    strokeWeight(2);
    rect(currentPosition.x*CELL_SIZE, currentPosition.y*CELL_SIZE, CELL_SIZE*currentPosition.z, CELL_SIZE*currentPosition.z);
    pop();
}

function updatePuzzle() {
    for (let i = 0; i<numIterations; i++) {
    let powerValue = 0;
    for (let x = currentPosition.x; x < currentPosition.x+currentPosition.z; x++) {
        for (let y = currentPosition.y; y < currentPosition.y+currentPosition.z; y++) {
            powerValue += grid[x][y];
        }
    }
    if (powerValue > bestPowerValue) {
        bestPowerValue = powerValue;
        bestPosition = createVector(currentPosition.x, currentPosition.y, currentPosition.z);
    }

    if (currentPosition.x < GRID_SIZE - currentPosition.z) {
        currentPosition.x++;
    } else if (currentPosition.y < GRID_SIZE - currentPosition.z) {
        currentPosition.x = 0;
        currentPosition.y++;
    } else if (isPart2() && currentPosition.z < GRID_SIZE) {
        currentPosition.x = 0;
        currentPosition.y = 0;
        currentPosition.z++;
    } else {
        currentPosition = bestPosition;
        puzzleSolved();
        console.log('Best position (' + (bestPosition.x+1) + ', ' + (bestPosition.y+1) + ', ' + (bestPosition.z) + ') with a value of ' + bestPowerValue)
        return;
    }
    }
}

function initPuzzle(input) {
    serialNumber = int(input[0]);
    grid = initGrid(GRID_SIZE, GRID_SIZE, computeCellPower);
    currentPosition = createVector(0, 0, STARTING_SIZE);
    bestPowerValue = -100;
    numIterations = isPart1() ? 1000 : 1000;

    background(240)
    drawGrid();
    loadPixels();
}

function computeCellPower(x, y) {
    let rackId = x + 1 + 10;
    let powerLevel = rackId * (y + 1);
    powerLevel += serialNumber;
    powerLevel *= rackId;
    powerLevel = int((powerLevel - int(powerLevel/1000)*1000)/100);
    powerLevel -= 5;
    return powerLevel;
}
