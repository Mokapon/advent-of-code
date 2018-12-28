toLoad = [EXAMPLE_P1, PART1];

const REGEXP = /position=< ?(-?[0-9]+), +(-?[0-9]+)> velocity=< ?(-?[0-9]+), +(-?[0-9]+)/;
const SIZE = 10;

let ticks;
let lights;
let currentIndex;
let minPos;
let maxPos;
let area;

function initDisplay() {
    createCanvas(750, 400).parent('sketch');
    
    textAlign(CENTER, CENTER);
}

function updateDisplay() {
    translate(-(minPos.x-1)*SIZE, -(minPos.y-1)*SIZE);
    background(AOC_BACKGROUND_COLOR);

    for (let light of lights) {
        light.draw();
    }
}

function updatePuzzle() {
    for (let i = 0; i < (isExample() ? 1 : 1000) ; i++) {
        let tmp = minPos;
        minPos = maxPos;
        maxPos = tmp;
        for (let light of lights) {
            light.move();
            minPos.x = min(minPos.x, light.position.x);
            minPos.y = min(minPos.y, light.position.y);
            maxPos.x = max(maxPos.x, light.position.x);
            maxPos.y = max(maxPos.y, light.position.y);
            
        }
        let newArea = getLightsSurface();
        if (newArea > area) {
            puzzleSolved();
            for (let light of lights) {
                light.back();
            }
            console.log('Reached the end in ' + ticks + ' seconds.')
            return;
        } else {
            ticks++;
            area = newArea;
        }
    }
}

function initPuzzle(input) {
    ticks = 0;

    lights = [];
    currentIndex = 0;
    minPos = createVector(0, 0);
    maxPos = createVector(0, 0);

    let match, light;
    for (let line of input) {
        match = line.match(REGEXP);
        light = new Light(int(match[1]), int(match[2]), int(match[3]), int(match[4]));
        minPos.x = min(minPos.x, light.position.x);
        minPos.y = min(minPos.y, light.position.y);
        maxPos.x = max(maxPos.x, light.position.x);
        maxPos.y = max(maxPos.y, light.position.y);
        lights.push(light);
    }

    area = getLightsSurface();
}

function getLightsSurface() {
    return abs((minPos.x-maxPos.x) * (minPos.y-maxPos.y));
}
