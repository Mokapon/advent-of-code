// display
const RESULT_Y = 20;
const LIST_Y = 50;
const LINE_HEIGHT = 20;
let listPrinter;

// data
let ids;
let currentIndex;
let part2Index;
let part1Results;
let part2Result;
let checksum;

/*
 * --- INIT ---
 */
function initDisplay() {
    createCanvas(600, 500).parent('sketch');

    textAlign(CENTER);
}

function initPuzzle(input) {
    ids = input;
    currentIndex = 0;
    part2Index = currentIndex+1;

    checksum = 0;
    part1Results = { doubles:[], triples:[] }
    part2Result = '????';

    listPrinter = new ListPrinter(LIST_Y, height - LIST_Y, LINE_HEIGHT, ids.length);
}

/*
 * --- UPDATE ---
 */
function updateDisplay() {
    background(240);

    // List of ids
    listPrinter.printList(currentIndex, displayMainId);
    if (isPart1()) {
        textSize(13);
        text('Checksum: ' + checksum, width*1.5/5, RESULT_Y);
        text('Double letters: ' + part1Results.doubles.length, width*3/5, RESULT_Y);
        text('Triple letters: ' + part1Results.triples.length, width*4/5, RESULT_Y);
        textSize(12);
    } else {
        text('Common part: ' + part2Result, width/2, RESULT_Y);
        // second List of ids
        listPrinter.printList(part2Index, displaySubId);
    }
}

function updatePuzzle() {
    if (isPart1()) {
        nextChecksumStep();
    } else {
        nextPrototypeStep();
    }
}

function displayId(index, currentIndex, x, y) {
    if (index===currentIndex) {
        textStyle(BOLD);
    } else {
        textStyle(NORMAL);
    }
    text(ids[index], x, y);
}

function displayMainId(index, y) {
    push();
    displayId(index, currentIndex, width*1.5/5, y);

    if (isPart1()) {
        if (part1Results.doubles.indexOf(index) >= 0) {
            text('has double', width*3/5, y);
        }

        if (part1Results.triples.indexOf(index) >= 0) {
            text('has triple', width*4/5, y);
        }
    }
    pop();
}

function displaySubId(index, y) {
    push();
    if (index <= currentIndex) {
        fill(100);
    } else {
        fill(0);
    }
    displayId(index, part2Index, width*3.5/5, y);
    pop();
}

/*
 * --- PART 1 ---
 */
function nextChecksumStep() {
    let id = ids[currentIndex];
    let counts = countOccurrences(id);

    let double = false;
    let triple = false;
    for (let count of Object.values(counts)) {
        if (count===2) {
            double = true;
        }
        if (count===3) {
            triple = true;
        }
    }
    if (double) {
        part1Results.doubles.push(currentIndex);
    }
    if (triple) {
        part1Results.triples.push(currentIndex);
    }
    checksum = part1Results.doubles.length * part1Results.triples.length;

    if (++currentIndex >= ids.length) {
        puzzleSolved();
    }
}

function countOccurrences(word) {
    let counts = {};
    for (let i=0; i<word.length; i++) {
        let char = word.charAt(i);
        if (counts[char]) {
            counts[char]++;
        } else {
            counts[char] = 1;
        }
    }
    return counts;
}

/*
 * --- PART 2 ---
 */
 function nextPrototypeStep() {
    let id1 = ids[currentIndex];
    let id2 = ids[part2Index];
    let found = compareIds(id1, id2);
    if (found) {
        console.log(part2Result);
        puzzleSolved()
    } else {
        if (++part2Index >= ids.length) {
            if (currentIndex < ids.length) {
                currentIndex++;
                part2Index = currentIndex+1;
            } else {
                part2Result = 'not found';
                puzzleSolved();
            }
        }
    }
 }

 function compareIds(id1, id2) {
    part2Result = '';
    let differences=0;
    for (let i = 0; i < id1.length; i++) {
        if (id1.charAt(i)===id2.charAt(i)) {
            part2Result += id1.charAt(i);
        } else {
            if (differences>=1) {
                return false;
            }
            differences++;
        }
    }
    return differences === 1;
 }