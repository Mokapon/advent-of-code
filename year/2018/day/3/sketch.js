toLoad = [EXAMPLE_P1, PART1];

const SIZE = 1000;
const COLOR_DELTA = 50;

const RECT_REGEXP = r=/#([0-9]+) @ ([0-9]+),([0-9]+): ([0-9]+)x([0-9]+)/;

let scale;

let fabricWidth,fabricHeight;
let rectangles;
let currentIndex;
let validClaims;

function initDisplay() {
    createCanvas(SIZE, SIZE).parent('sketch');

    pixelDensity(1);
    loadPixels();
}

function updateDisplay() {
}

function updateFabricSize(w,h) {
    let s = max(w,h);
    scale = max(1,floor(SIZE / s));
    
    background(AOC_BACKGROUND_COLOR);
}

function updatePuzzle() {
    rectangles[currentIndex].draw();
    checkForOverlaps();

    if (++currentIndex >= rectangles.length) {
        let overlap = countOverlap();
        console.log('Overlapping inches: ' + overlap);
        console.log('Valid claim id: ' + validClaims.join(' '));
        puzzleSolved();
    }
}

function checkForOverlaps() {
    let rect = rectangles[currentIndex];
    for (let i=0; i<rectangles.length;i++) {
        if (i!== currentIndex && rect.getOverlap(rectangles[i])) {
            return;
        }
    }
    // No overlapping claim
    validClaims.push(rect.id);
}

function countOverlap() {
    let count = 0;
    for (let i=0; i<SIZE*SIZE*4; i+=4) {
        if (pixels[i+3] < 255 && pixels[i+1] > COLOR_DELTA) {
            count++;
        }
    }
    return count/scale/scale;
}

function initPuzzle(input) {
    validClaims = [];
    currentIndex = 0;
    rectangles = [];

    let match,id,x,y,w,h;
    fabricWidth = 0;
    fabricHeight = 0;
    for (let line of input) {
        match = line.match(RECT_REGEXP);
        id = int(match[1]);
        x = int(match[2]);
        y = int(match[3]);
        w = int(match[4]);
        h = int(match[5]);
        fabricWidth = max(fabricWidth, x + w + 1);
        fabricHeight = max(fabricHeight, y + h + 1);
        rectangles.push(new Rectangle(x,y,w,h,id));
    }
    
    updateFabricSize(fabricWidth, fabricHeight);
}
