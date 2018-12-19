toLoad = [ EXAMPLE_P1, PART1, PART2];

const INPUT_REGEXP = /([0-9]+) players; last marble is worth ([0-9]+) points/;

let numIterations;

let marbles;
let playersScore;
let lastMarbleValue;

let currentMarble;
let currentMarbleValue;
let currentPlayer;
let currentWinner;

function initDisplay() {
    createCanvas(500, 200).parent('sketch');
    // Initialize display elements that don't change (textAlign, colors, etc.)
    textAlign(CENTER, CENTER);
}

function updateDisplay() {
    background(240);

    text('Progress ' + int((currentMarbleValue/lastMarbleValue)*100) + ' %', width/2, height*1/3);
    // Draw what you need here. Called each frame before updatePuzzle()
    text('Current winner : player ' + (currentWinner+1) + ' with a score of ' + playersScore[currentWinner], width/2, height*2/3);
    
    //printList();
}

function updatePuzzle() {
    for (let i = 0; i < numIterations; i++) {
        if (currentMarbleValue % 23 === 0) {
            let toRemove = currentMarble;
            for (let i = 0; i < 7; i++) {
                toRemove = toRemove.prev;
            }
            playersScore[currentPlayer] += currentMarbleValue + toRemove.value;

            toRemove.remove();
            currentMarble = toRemove.next;

            // Keep track of current highest score
            if (playersScore[currentPlayer] > playersScore[currentWinner]) {
                currentWinner = currentPlayer;
            }
        } else {
            if (currentMarbleValue < 2 || currentMarble.next.next.value === marbles.value) {
                // Add at the end of the list
                marbles.insertBefore(currentMarbleValue);
                currentMarble = marbles.prev;
            } else {
                currentMarble.next.insertAfter(currentMarbleValue);
                currentMarble = currentMarble.next.next;
            }
        }

        currentPlayer = (currentPlayer+1) % playersScore.length;
        if (currentMarbleValue++ === lastMarbleValue) {
            puzzleSolved();
            return;
        }
    }
}

function initPuzzle(input) {
    marbles = initList();
    currentMarble = marbles;
    currentMarbleValue = 1;

    let match = input[0].match(INPUT_REGEXP);
    lastMarbleValue = int(match[2]);
    playersScore = [];
    for (let i = 0; i < int(match[1]); i++) {
        playersScore.push(0);
    }
    currentPlayer = 0;
    currentWinner = 0;

    numIterations = 1;
    while(lastMarbleValue / numIterations > 60*30) {
        numIterations *= 10;
    }
}

function initList() {
    let marble = new Marble(0);
    marble.prev = marble;
    marble.next = marble;
    return marble;
}

function printList() {
    let t = '';
    let m = marbles;
    do {
        t += m.value + ' ';
        m = m.next;
    } while (m.value !== marbles.value)
    console.log(t);
}

function Marble(value, prev, next) {
    this.value = value;
    this.prev = prev;
    this.next = next;

    this.insertAfter = function(value) {
        let marble = new Marble(value, this, this.next);
        this.next.prev = marble;
        this.next = marble;
    }
    this.insertBefore = function(value) {
        let marble = new Marble(value, this.prev, this);
        this.prev.next = marble;
        this.prev = marble;
    }
    this.remove = function() {
        this.prev.next = this.next;
    }
}

