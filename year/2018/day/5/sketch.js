const RESULT_Y = 20;
const TEXT_Y = 50;
const MARGIN = 25;
const LINE_HEIGHT = 15;
let textBlockPrinter;

const CHAR_DIFFERENCE = 'a'.charCodeAt(0) - 'A'.charCodeAt(0);
let basePolymer;
let polymer;
let currentIndex;
let iterations;

let p2UsedLetters;
let p2CurrentRemovedIndex;
let p2CurrentBest;
let p2RemovedIndexForBest;

function initDisplay() {
    createCanvas(1000, 5600).parent('sketch');
    // Initialize display elements that don't change (textAlign, colors, etc.)
    textAlign(CENTER, CENTER);
}

function updateDisplay() {
    background(240);

    text('Units in the polymer: ' + polymer.length, width/2, RESULT_Y);
    
    if (isPart2()) {
        text('Currently removed unit: ' + p2UsedLetters[p2CurrentRemovedIndex], width/4, RESULT_Y);
        text('Shortest possible length: ' + p2CurrentBest.length + ' (by removing ' + p2UsedLetters[p2RemovedIndexForBest] + ')', width*3/4, RESULT_Y);
    }

    textBlockPrinter.printBlock();
    textBlockPrinter.changeCharStyle(currentIndex, AOC_ACCENT_COLOR, BOLD);
}

function updatePuzzle() {
    let done = false;
    for (let i = 0; i < iterations; i++) {
        let char1 = polymer.charCodeAt(currentIndex);
        let char2 = polymer.charCodeAt(currentIndex+1);
        if (Math.abs(char1-char2) === CHAR_DIFFERENCE) {
            polymer = polymer.substring(0, currentIndex) + polymer.substring(currentIndex+2);
            // Need to go back to check if the previous unit can now be removed
            if (currentIndex>0) {
                currentIndex--;
            }
        } else {
            currentIndex++;
        }

        if (currentIndex + 1 >= polymer.length) {
            if (isPart2()) {
                if (polymer.length < p2CurrentBest.length) {
                    p2CurrentBest = polymer;
                    p2RemovedIndexForBest = p2CurrentRemovedIndex;
                }
                if (++p2CurrentRemovedIndex<p2UsedLetters.length) {
                    // There are more letters to display
                    currentIndex = 0;
                    polymer = basePolymer.replace(new RegExp(p2UsedLetters[p2CurrentRemovedIndex], 'gi'), '');
                    return;
                } else {
                    polymer = p2CurrentBest;
                    p2CurrentRemovedIndex = p2RemovedIndexForBest;
                    done = true;
                    break;
                }
            }
            done = true;
            break;
        }
    }

    textBlockPrinter.setText(polymer);
    if (done) {
        puzzleSolved();
    }
}

function initPuzzle(input) {
    basePolymer=input[0];
    polymer=basePolymer;
    currentIndex = 0;

    // Make sure the execution will no take forever
    iterations = 1;
    while(polymer.length/iterations/60 > 30) {
        iterations*=10;
    }

    // For part 2, 
    if (isPart2()) {
        p2CurrentRemovedIndex = 0;
        p2CurrentBest = polymer;
        p2RemovedIndexForBest = 0;
        p2UsedLetters = [];
        let letter;
        let lowerCasePolymer = polymer.toLowerCase();
        for (let i = 'a'.charCodeAt(0); i <= 'z'.charCodeAt(0); i++) {
            letter = String.fromCharCode(i);
            if (polymer.toLowerCase().indexOf(letter)>=0) {
                p2UsedLetters.push(letter)
            }
        }
        polymer = basePolymer.replace(new RegExp(p2UsedLetters[p2CurrentRemovedIndex], 'gi'), '');

        while(polymer.length/iterations/60*p2UsedLetters.length > 30) {
            iterations*=10;
        }
    }

    textBlockPrinter = new TextBlockPrinter(MARGIN, TEXT_Y, width-MARGIN*2, LINE_HEIGHT, polymer);
}
