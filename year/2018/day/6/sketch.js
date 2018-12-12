let cellSize;
let pixelScale;

let grid;
let targets;
let currentDistance;
// Part 2
let totalCellsInRange;
let maxDistance;

function initDisplay() {
    createCanvas(750, 750).parent('sketch');
    // Initialize display elements that don't change (textAlign, colors, etc.)
    textAlign(CENTER, CENTER);

    noStroke();

    colorMode(HSB, 100);
    pixelDensity(1);
}

function updateDisplay() {
    background(240);

    drawGrid();

    drawTargetCoordinates();
}

function drawTargetCoordinates() {
    push();
    for (let target of targets) {
        fill(AOC_BACKGROUND_COLOR);
        rect(target.x*cellSize, target.y*cellSize, cellSize, cellSize);
        if (isPart2()) {
            fill(AOC_ACCENT_COLOR);
        } else {
            fill(target.color, 100, 100);
        } 
        text(target.id, target.x*cellSize+cellSize/2, target.y*cellSize+cellSize/2);
    }
    pop();
}

function drawGrid() {
    let cell;
    fill(AOC_ACCENT_COLOR);
    loadPixels();
    for (let col = 0; col < grid.length; col++) {
        for (let row = 0; row < grid[col].length; row++) {
            cell = grid[col][row];
            if (isPart1()) {
                drawClosestArea(row, col, cell);
            } else {
                drawSafeArea(row, col, cell);
            }
        }
    }
    updatePixels();
}

function drawClosestArea(row, col, cell) {
    if (cell.closestTargets.length===1) {
        let index;
        let r = red(cell.closestTargets[0].color);
        let g = green(cell.closestTargets[0].color);
        let b = blue(cell.closestTargets[0].color);
        for (let x=col*pixelScale; x < (col+1)*pixelScale; x++) {
            for (let y=row*pixelScale; y < (row+1)*pixelScale; y++) {
                index = (x+y*width)*4;
                pixels[index] = r;
                pixels[index+1] = g;
                pixels[index+2] = b;
            }
        }
    }
}

function drawSafeArea(row, col, cell) {
    if (cell.distanceToTargets < maxDistance) {
        let index;
        for (let x=col*pixelScale; x < (col+1)*pixelScale; x++) {
            for (let y=row*pixelScale; y < (row+1)*pixelScale; y++) {
                index = (x+y*width)*4;
                pixels[index] = 10;
                pixels[index+1] = 204;
                pixels[index+2] = 10;
                pixels[index+3] = cell.closestTargets.length / targets.length * 255;
            }
        }
    }
}

function printResult() {
    if (isPart1()) {
        let biggestArea = 0;
        for (let target of targets) {
            if (!target.infinite && target.area > biggestArea) {
                biggestArea = target.area;
            }
        }
        console.log('Largest area: ' + biggestArea);
    } else {
        console.log('Area of the safest zone ' + totalCellsInRange);
    }
}

function updatePuzzle() {
    let stop = true;
    for (let target of targets) {
        if (!target.next || target.next.length === 0) {
            continue;
        }
        stop = false;

        let next = [];
        for (let cell of target.next) {
            if (isPart1()) {
                if (cell.closestTargets.length === 1) {
                    if (cell.distanceToTargets===currentDistance && cell.closestTargets[0].id !== target.id) {
                        cell.closestTargets[0].area--;
                    } else {
                        continue;
                    }
                }
                cell.closestTargets.push(target);
                cell.distanceToTargets = currentDistance;
                if (cell.closestTargets.length === 1) {
                    target.area++;
                    findNeighbors(target, cell, next);
                }
            } else {
                cell.distanceToTargets += currentDistance;
                cell.closestTargets.push(target.id);
                if (cell.closestTargets.length === targets.length && cell.distanceToTargets < maxDistance) {
                    totalCellsInRange++;
                }
                findNeighbors(target, cell, next);
                
            }
        }
        target.next = next;
    }

    currentDistance++;
    if (stop) {
        printResult();
        puzzleSolved();
    }
}

function findNeighbors(target, cell, list) {
    let x, y;
    x = cell.x;
    y = cell.y;
    addCell(x-1, y  , list, target);
    addCell(x+1, y  , list, target);
    addCell(x  , y-1, list, target);
    addCell(x  , y+1, list, target);
}

function addCell(x, y, list, target) {
    if (!grid[x] || !grid[x][y]) {
        target.infinite = true; // reached an 'edge' of our grid
        return;
    }
    if (list.indexOf(grid[x][y])===-1 &&
        ((isPart1() && grid[x][y].closestTargets.length===0) ||
            (isPart2() && grid[x][y].closestTargets.indexOf(target.id)===-1))) {
        list.push(grid[x][y]);
}
}

function initPuzzle(input) {
    currentDistance = 1;
    maxDistance = (input.length > 30) ? 10000 : 32;
    totalCellsInRange = 0;

    let w = 0;
    let h = 0;
    targets = [];
    let targetCode = 'A'.charCodeAt(0);
    for (let coordinate of input.map(function(a) { return a.split(', '); })) {
        targets.push( { 
            x:int(coordinate[0]),
            y:int(coordinate[1]),
            id: String.fromCharCode(targetCode++), 
            area:0, 
            color: color(lerp(50, 100, targets.length/input.length),100,100) 
        } );
        w = max(w, int(coordinate[0]) + 2);
        h = max(h, int(coordinate[1]) + 2);
    }

    cellSize = min(floor(width/w),floor(height/h));
    textSize(cellSize/2);

    grid = initGrid(w, h, createCell);

    pixelScale = cellSize;

    for (let target of targets) {
        grid[target.x][target.y].closestTargets.push(isPart1() ? target : target.id);
        target.next = [];
        findNeighbors(target, target, target.next);
    }
}

function createCell(x, y) {
    let cell = {};
    cell.x = x;
    cell.y = y;
    cell.closestTargets = [];
    cell.distanceToTargets = 0;
    return cell;
}
