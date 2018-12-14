const LEGEND_Y = 25;
const START_Y = 50;
const LINE_HEIGHT = 15;
const X_OFFSET = 80;

const REGEXP = /Step ([A-Z]+) must be finished before step ([A-Z]+) can begin\./

let listPrinter;
let tasksOrder;
let availableTasks;
let tasksInProgress;
let durationOffset;
let currentTime;
let history;

function initDisplay() {
    createCanvas(800, 500).parent('sketch');
    // Initialize display elements that don't change (textAlign, colors, etc.)
    
}

function updateDisplay() {
    background(240);

    textAlign(CENTER, CENTER);
    let x = X_OFFSET/2;
    text('Second', x, LEGEND_Y);
    for (let i = 1; i <= tasksInProgress.length; i++) {
        x+=X_OFFSET;
        text('Worker ' + i, x, LEGEND_Y);
    }

    textAlign(LEFT, CENTER);
    text('Accomplished', x+X_OFFSET*1, LEGEND_Y);
    
    listPrinter.printList(currentTime-1);
}

function displaySecond(index, y) {
    let x = X_OFFSET/2;
    textAlign(CENTER, CENTER);
    text(index, x, y);
    textAlign(LEFT, CENTER);
    for (let value of history[index]) {
        x+= X_OFFSET
        text(value, x, y);
    }
}

function updatePuzzle() {
    let workersActivity = [];
    
    let finishedThisTurn = [];
    let inProgress = false;
    let task;
    for (let i = 0; i < tasksInProgress.length; i++) {
        task = tasksInProgress[i];
        if (!task) {
            if (availableTasks.length===0) {
                workersActivity[i] = '.';
                continue;
            }
            task = availableTasks.pop();
            tasksInProgress[i] = task;
        }

        inProgress = true;
        workersActivity[i] = task.id;
        task.timeLeft--;
        if (task.timeLeft === 0) {
            tasksInProgress[i] = undefined;
            finishedThisTurn.push(task);
            tasksOrder += task.id;
        }
        
    }
    
    finishedThisTurn.sort(compareNode);
    for (let i = finishedThisTurn.length -1; i>=0; i--) {
        task = finishedThisTurn[i];
        //tasksOrder += task.id;
        for (let node of task.getChildren()) {
            if (availableTasks.indexOf(node) === -1) {
                availableTasks.push(node);
            }
        }
    }
    availableTasks.sort(compareNode);

    workersActivity.push(tasksOrder.slice(0));
    history[currentTime++] = workersActivity;
    listPrinter.setListLength(history.length);

    if (!inProgress) {
        console.log('Accomplished the tasks ' + tasksOrder + ' in ' + (history.length-1) + ' seconds.');
        puzzleSolved();
    }
}

function initPuzzle(input) {
    tasksOrder = '';
    currentTime = 0;
    history = [];

    tasksInProgress = [];
    let numWorkers = isPart1() ? 1 : (isExample() ? 2 : 5);
    for (let i = 0; i < numWorkers; i++) {
        tasksInProgress[i] = undefined;
    }

    let durationOffset = isPart1() ? 1 : (1 - 'A'.charCodeAt(0) + (isExample() ? 0 : 60));
    availableTasks = [];
    let currentRoots = {};
    let nodes = {};
    let match, node;
    let id1, id2, node1, node2;
    for (let line of input) {
        match = line.match(REGEXP);
        id1 = match[1];
        id2 = match[2];

        node1 = nodes[id1] || new Node(id1, durationOffset);
        node2 = nodes[id2] || new Node(id2, durationOffset);
        node1.addChild(node2);
        if (!nodes[id1]) {
            currentRoots[id1] = node1;
            nodes[id1] = node1;
        }
        if (!nodes[id2]) {
            nodes[id2] = node2;
        } else if(currentRoots[id2]){
            delete(currentRoots[id2]);
        }
    }

    listPrinter = new ListPrinter(START_Y, height - START_Y, LINE_HEIGHT, 0, displaySecond);

    availableTasks = Object.values(currentRoots);
    availableTasks.sort(compareNode);
}