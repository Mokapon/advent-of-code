let tree;

function initDisplay() {
    createCanvas(2000, 2200).parent('sketch');
    
    textAlign(LEFT, CENTER);
}

function updateDisplay() {
    background(240);

    tree.draw();
}

function updatePuzzle() {
    if (tree.getValue()) {
        console.log('Final value: ' + tree.getValue());
        puzzleSolved();
    }
}

function initPuzzle(input) {
    let data = input[0].split(' ').map(function(a) { return int(a); });

    tree = createTree(data);
}