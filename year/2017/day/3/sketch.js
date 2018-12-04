const MAX_CELL_SIZE = 40;
const MIN_TEXT_SIZE = 15;
let cellSize;

let targetValue;
let grid;
let gridSize;
let halfGrid;
let currentValue;
let currentPosition;
let iterations;

function initDisplay() {
    createCanvas(1200, 1200).parent('sketch');
    // Initialize display elements that don't change (textAlign, colors, etc.)
    textAlign(CENTER, CENTER);
}

function updateDisplay() {
    // Draw the next value that was added;
    let col = currentPosition.x + halfGrid;
    let row = currentPosition.y + halfGrid;
    let value = grid[col][row];
    if (value > 0) {
        if ((isPart1() && (value === targetValue || value === 1))
            || isPart2() && value > targetValue) {
            fill(AOC_ACCENT_COLOR);
            textStyle(BOLD);
        } else {
            fill(0);
            textStyle(NORMAL);
        }
        text(value, col*cellSize+cellSize/2,row*cellSize+cellSize/2);
    }
}

function drawGrid() {
    background(240);
    textSize(max(MIN_TEXT_SIZE, cellSize*2/5));
    
    stroke(0);
    noFill();
    for (let col = 0; col < gridSize; col++) {
        for (let row = 0; row < gridSize; row++) {
            rect(col*cellSize, row*cellSize, cellSize, cellSize);
        }
    }
    fill(0);
    noStroke();
}

function updatePuzzle() {
    for (let i = 0; i<iterations;i++) {
        goToNextPosition();
        let x = currentPosition.x + halfGrid;
        let y = currentPosition.y + halfGrid;
        currentValue = getNextValue(x,y);
        grid[x][y] = currentValue;

        if (isPart1()) {
            if (currentValue === targetValue) {
                let distance = abs(x-halfGrid) + abs(y-halfGrid);
                console.log('Distance to center (graphic method: ' + distance);
                break;
            }
            if (currentValue >= maxValue) {
                puzzleSolved();
                return;
            }
        } else {
            if (currentValue > targetValue) {
                console.log('First value bigger than ' + targetValue+ ' : ' + currentValue);
                puzzleSolved();
                return;
            }
        }
    }
    
}

function goToNextPosition() {
    let x = currentPosition.x + halfGrid;
    let y = currentPosition.y + halfGrid;
    
    // Find next position to fill
    if (grid[x-1] && grid[x-1][y] && !grid[x][y-1]) {
        currentPosition.y-=1;
    } else if (grid[x][y+1] && (!grid[x-1] || !grid[x-1][y]) ) {
        currentPosition.x-=1;
    } else if (grid[x+1] && grid[x+1][y] && !grid[x][y+1]) {
        currentPosition.y+=1;
    } else {
        currentPosition.x+=1
    }
}

function getNextValue(x, y) {
    if (isPart1()) {
        return currentValue+1;
    } else {
        if (currentValue===0) {
            return 1;
        }
        let neighborsTotal = 0;
        if (grid[x-1]) {
            neighborsTotal+=grid[x-1][y-1] || 0;
            neighborsTotal+=grid[x-1][y];
            neighborsTotal+=grid[x-1][y+1] || 0;
        }
        if (grid[x]) {
            neighborsTotal+=grid[x  ][y-1] || 0;
            neighborsTotal+=grid[x  ][y+1] || 0;
        }
        if (grid[x+1]) {
            neighborsTotal+=grid[x+1][y-1] || 0;
            neighborsTotal+=grid[x+1][y];
            neighborsTotal+=grid[x+1][y+1] || 0;
        }
        return neighborsTotal;
    }
}

function initPuzzle(input) {
    targetValue = int(input[0]);
    gridSize = isPart1() ? ceil(Math.sqrt(targetValue)) : 10;
    if (gridSize%2 === 0) {
        gridSize++;
    }
    halfGrid = (gridSize-1)/2;
    cellSize = min(MAX_CELL_SIZE, floor(width / gridSize));
    offset = (width-cellSize*gridSize)/2;

    grid = initGrid(gridSize, gridSize);
    currentValue = 0;
    currentPosition = createVector(-1, 0);
    maxValue = gridSize*gridSize;
    
    iterations = 1;
    while (maxValue/iterations/60>30) {
        iterations*=10;
    }
    drawGrid();

    if (isPart1()) {
        console.log('Distance to center (prediction): ' + distanceToCenter(targetValue));
    }
}

function distanceToCenter(value) {
    let gridSize = ceil(Math.sqrt(value));
    if (gridSize%2 === 0) {
        gridSize++;
    }

    let halfDistance = (gridSize-1) / 2;

    // Our value is placed somewhere on the outer edge of the square of size gridSize

    let maxValue = gridSize*gridSize; // the highest element
    let valueDelta = maxValue - value; // numbers between this corner and our value

    let distanceToCorner = valueDelta % (gridSize-1);
    let distanceToClosestCorner = Math.min(distanceToCorner, gridSize-1-distanceToCorner);
    let distance = halfDistance + halfDistance - distanceToClosestCorner;

    return distance;
}