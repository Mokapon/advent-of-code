const RESULTS_Y = 20;
const LIST_Y = 50;
const LINE_HEIGHT = 20;

let listPrinter;

let passPhrases;
let phrasesValidity;
let currentIndex;
let validPhrases;

function initDisplay() {
    createCanvas(700, 500).parent('sketch');
    // Initialize display elements that don't change (textAlign, colors, etc.)
    textAlign(CENTER, CENTER);
}

function updateDisplay() {
    background(240);

    text('Valid phrases: ' + validPhrases, width/2, RESULTS_Y);

    listPrinter.printList(currentIndex);
}

function displayPassPhrase(index, y) {
    text(passPhrases[index], width/3, y);
    text(phrasesValidity[index] ? 'valid' : 'invalid', width*4/5, y);
}

function updatePuzzle() {
    let valid = isValid(passPhrases[currentIndex]);
    phrasesValidity[currentIndex] = valid;
    if (valid) {
        validPhrases++;
    }

    if (++currentIndex >= passPhrases.length) {
        puzzleSolved();
    }
}

function isValid(phrase) {
    if (isPart1()) {
        return checkWordsUnicity(phrase.split(' '));
    } else {
        return checkCharactersUnicity(phrase.split(' '));
    }
}

function checkWordsUnicity(words) {
    let checkedWords = [];
    for (let word of words) {
        if (checkedWords.indexOf(word) >= 0) {
            return false;
        }
        checkedWords.push(word);
    }
    return true;
}

function checkCharactersUnicity(words) {
    for (let i = 0; i < words.length; i++) {
        let word = words[i];
        // Sort the letter of the word
        words[i] = word.split('').sort().join('');
    }
    return checkWordsUnicity(words);
}

function initPuzzle(input) {
    passPhrases = input;
    currentIndex = 0;
    validPhrases = 0;
    phrasesValidity = [];

    listPrinter = new ListPrinter(LIST_Y, height-LIST_Y, LINE_HEIGHT, passPhrases.length, displayPassPhrase);
}
