const EXAMPLE = 0;
const PART1 = 1;
const PART2 = 2;

let inputs = [];
let currentPuzzle;
let finished = false;

const CELL_SIZE = 15;
let cols;
let rows;
let marginVertical;
let marginHorizontal;

const MOVES_MAP = [];

let moves;
let currentIndex;

let grid;
let gridStart;
let gridEnd;
let santas;
let offset;

let visitedHouses;

function preload() {
    inputs[EXAMPLE] = loadStrings('input/example.txt');
    inputs[PART1] = loadStrings('input/part1.txt');
    inputs[PART2] = loadStrings('input/part2.txt');
}

function setup() {
    let canvas = createCanvas(500, 500);
    canvas.parent('sketch');

    rectMode(CENTER);
    textAlign(CENTER, CENTER);

    cols = floor(width  / CELL_SIZE);
    rows = floor(height / CELL_SIZE);
    marginHorizontal = (width % CELL_SIZE) / 2;
    marginVertical = (height % CELL_SIZE) / 2;

    MOVES_MAP['^'] = createVector( 0, -1),
    MOVES_MAP['>'] = createVector( 1,  0),
    MOVES_MAP['<'] = createVector(-1,  0),
    MOVES_MAP['v'] = createVector( 0,  1)
    
    loadPuzzle(EXAMPLE);
}

function draw() {
    background(240);

    drawGrid();

    if (finished) {
        noLoop();
    } else {
        nextMove();
    }
}

function nextMove() {
    // Distribute present at current location
    let first = true;
    let shouldFinish = false;
    for (let santa of santas) {
        if (grid[santa.x][santa.y] === 0) {
            // First visit at this house
            visitedHouses++;
        }
        grid[santa.x][santa.y]++;

        if (currentIndex < moves.length) {
            // Move to next location
            applyMove(moves.charAt(currentIndex));
            currentIndex++;
        } else if (first){ 
            shouldFinish = true;
        }
        first = false
    }
    if (shouldFinish) {
        finished = true;
        console.log('Visited ' + visitedHouses + ' houses.');
    }
}

function applyMove(move) {
    let direction = MOVES_MAP[move];
    let santaIndex = currentIndex%santas.length;

    // Move to next location
    santas[santaIndex] = p5.Vector.add(santas[santaIndex], direction);

    // Check if we need to add a row or column
    if (abs(gridEnd.x  - santas[santaIndex].x)  <= 2 || abs(gridEnd.y - santas[santaIndex].y) <= 2 ||
        abs(gridStart.x - santas[santaIndex].x) <  2 || abs(gridStart.y - santas[santaIndex].y) < 2) {
        if (direction.x > 0) {
            // Add new col
            addColumn(gridEnd.x);
            gridEnd.x++;
        } else if (direction.x < 0) {
            // Add new col
            gridStart.x--;
            addColumn(gridStart.x);
        } else if (direction.y > 0) {
            // Add new row
            addRow(gridEnd.y);
            gridEnd.y++;
        } else if (direction.y < 0) {
            // Add new row
            gridStart.y--;
            addRow(gridStart.y);
        }
    }

    // Check if we need to move the camera. Follow first santa
    let averagePosition = createVector(0,0);
    for (let santa of santas) {
        averagePosition = p5.Vector.add(averagePosition, santa);
    }
    averagePosition = p5.Vector.div(averagePosition, santas.length);
    if (abs(offset.x - averagePosition.x) < cols/2-2 || abs(offset.x - averagePosition.x + cols) <= cols/2-2 ||
        abs(offset.y - averagePosition.y) < rows/2-2 || abs(offset.y - averagePosition.y + rows) <= rows/2-2) {
        offset = p5.Vector.add(offset, direction);

        if (direction.x > 0) {
            // Add new col
            addColumn(gridEnd.x);
            gridEnd.x++;
        } else if (direction.x < 0) {
            // Add new col
            gridStart.x--;
            addColumn(gridStart.x);
        } else if (direction.y > 0) {
            // Add new row
            addRow(gridEnd.y);
            gridEnd.y++;
        } else if (direction.y < 0) {
            // Add new row
            gridStart.y--;
            addRow(gridStart.y);
        }
    }
}

function addColumn(col) {
    grid[col] = [];
    for (let j = gridStart.y; j < gridEnd.y; j++) {
        grid[col][j] = 0;
    }
}

function addRow(row) {
    for (let i = gridStart.x; i < gridEnd.x; i++) {
        grid[i][row] = 0;
    }
}

function drawGrid() {
    for (let i = 0; i < cols; i++) {
        for (let j = 0; j < rows; j++) {
            stroke(0);
            fill(255);
            let x = floor(marginHorizontal + i*CELL_SIZE + CELL_SIZE/2);
            let y = floor(marginVertical   + j*CELL_SIZE + CELL_SIZE/2);
            rect(x, y, CELL_SIZE-1, CELL_SIZE-1);

            let col = i+offset.x;
            let row = j+offset.y;

            fill(155, 0, 155, 35);
            for (let n = 0; n < grid[col][row]; n++) {
                rect(x, y, CELL_SIZE-1, CELL_SIZE-1);
            }
            fill(0);
            noStroke();
            //text(grid[col][row], x, y);
            //text(col + ',' + row, x, y);

            // Draw Santas
            for (let i = 0; i<santas.length; i++) {
                let santa = santas[i];
                if (col === santa.x && row === santa.y) {
                    fill(i*0,i*155,i*255);
                    stroke(i*0,i*155,i*255);
                    ellipse(x, y, CELL_SIZE * 2 / 3, CELL_SIZE * 2 / 3);
                }
            }
        }
    }
}

function loadPuzzle(puzzle) {
    currentPuzzle = puzzle;
    // Load the puzzle here

    visitedHouses = 0;
    moves = inputs[puzzle][0];
    currentIndex = 0;
    santas = [];
    santas[0] = createVector(0,0);
    if (puzzle !== PART1) {
        santas[1] = createVector(0,0);
    }

    offset = createVector(-floor(cols/2), -floor(rows/2));
    gridStart = createVector(offset.x, offset.y);
    gridEnd = createVector(offset.x+cols, offset.y+rows);

    grid = [];
    for (let i = 0; i < cols; i++) {
        grid[i+offset.x] = [];
        for (let j = 0; j < rows; j++) {
            grid[i+offset.x][j+offset.y] = 0;
        }
    }

    if (finished) {
        finished = false;
        loop();
    }
}
