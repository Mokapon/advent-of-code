
function initDisplay() {
    createCanvas(500, 200).parent('sketch');
    // Initialize display elements that don't change (textAlign, colors, etc.)
    textAlign(CENTER, CENTER);
}

function updateDisplay() {
    background(240);

    // Draw what you need here. Called each frame before updatePuzzle()
    text("SOLVE ME PLEASE", width/2, height/2);
}

function updatePuzzle() {
    // Update the puzzle state. Called each frame after updateDisplay()
    // Call isPart1() or isPart2() to know if you're solving the 1st part or 2nd part of the puzzle and examples
    // Call puzzleSolved() when the puzzle answer has been found and/or to stop the updates
}

function initPuzzle(input) {
    // Initialize what you need to solve the puzzle here
}
