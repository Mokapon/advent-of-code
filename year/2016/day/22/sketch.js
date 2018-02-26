let EXAMPLE = 0;
let PART1 = 1;
let PART2 = 2;

let inputs = [];
let currentPuzzle;

// display constants
let nodeSize = 20;
let margin = 5;

// simulation status
let finished = false;

// simulation constants
let nodeNameRegexp = /\/dev\/grid\/node-x([0-9]+)-y([0-9]+)/;

// simulation variables
let emptyNodePosition;
let targetPosition;
let currentDataPosition;
let currentTarget;

let grid;
let biggestNodeSize;
let pairs;
let possibleStarts;

let path;
let openList;
let closedList;

function preload() {
  inputs[EXAMPLE] = loadStrings('input/example.txt');
  inputs[PART1] = loadStrings('input/part1.txt');
  inputs[PART2] = inputs[PART1];
}

function setup() {
  let canvas = createCanvas(2*margin, 2*margin);
  canvas.parent('sketch');

  textAlign(CENTER, CENTER);
  //frameRate(10);

  loadPuzzle(EXAMPLE);
}

function draw() {
  background(230);

  // print grid
  let textX, textY = nodeSize/2;
  for (let x = 0; x < grid.length; x++) {
    fill(0);
    text(x, margin + (x+1)*nodeSize + nodeSize/2, margin + nodeSize/2);
    for (let y = 0; y < grid[x].length; y++) {
      if (x === 0) {
        fill(0);
        text(y, margin + nodeSize/2, margin + (y+1)*nodeSize + nodeSize/2);
      }
      grid[x][y].draw();
    }
  }

  drawPath();

  if (finished) {
    noLoop();
  } else {
    nextStep();
  }
}

function keyReleased() {
  if (key === 'R') {
    loadPuzzle(currentPuzzle);
  } else if (keyCode === ENTER) {
    nextStep();
  }
}

function drawPath() {
  push();
  stroke(155,0,155, 100);
  strokeWeight(5);

  for (let i = 1; i < path.length; i++) {
    let startNode = path[i-1];
    let endNode = path[i];
    beginShape();
    vertex(startNode.x + nodeSize/2, startNode.y + nodeSize/2);
    vertex(endNode.x + nodeSize/2, endNode.y + nodeSize/2);
    endShape();
  }

  pop();
}

function initAlgorithm() {
  closedList = [];
  openList = [];

  let startNode = grid[emptyNodePosition.x][emptyNodePosition.y];
  startNode.heuristic = distance(emptyNodePosition, currentDataPosition);
  openList.push(startNode);
  //node.isOpen = false;
}

function resetCameFrom() {
  for (let row of grid) {
    for (let node of row) {
      node.resetAStar();
    }
  }
}

function nextStep() {
  if (openList.length > 0) {
    let node = openList.pop();
    emptyNodePosition = node.pos;
    //node.isOpen = false;
    //node.isCurrent = true;

    if (node.pos.x === currentTarget.x && node.pos.y === currentTarget.y) {
      
      // replay the path, moving around the data along the way
      grid[currentDataPosition.x][currentDataPosition.y].cameFrom = node;
      updatePath(grid[currentDataPosition.x][currentDataPosition.y]);

      // move the target data
      emptyNodePosition = currentDataPosition;
      currentDataPosition = currentTarget;

      if (currentDataPosition.x === targetPosition.x && currentDataPosition.y === targetPosition.y) {
        // Completely finished
        console.log('[PART 2] SHORTEST PATH FOUND: ' + moves + ' moves.');
        finished = true;
        return;
      } else {
        currentTarget = getNextTarget();
        resetCameFrom();
        initAlgorithm();
        return;
      }
    }

    for (let neighbor of node.viableNeighbors()) {
      if (closedList.indexOf(neighbor)!==-1 || openList.indexOf(neighbor) !== -1
        || (neighbor.pos.x === currentDataPosition.x && neighbor.pos.y === currentDataPosition.y)) {
        continue;
      }
      
      neighbor.cameFrom = node;
      neighbor.cost = node.cost + 1;
      neighbor.heuristic = neighbor.cost + distance(neighbor.pos, currentTarget);
      openList.push(neighbor);

      //neighbor.isOpen = true;
    }
    openList.sort(compareHeuristic);

    closedList.push(node);
    //node.isCurrent = false;
    //node.isOpen = false;
    //node.isClosed = true;
  } else {
    console.log('NO PATH FOUND. ' + closedList.length + ' cells visited.');
    finished = true;
  }
}


function updatePath(node) {
  let startIndex = path.length;

  do {
    path.splice(startIndex, 0, node);
    node = node.cameFrom;
  } while(node);

  // Apply the moves
  for (let i = startIndex + 1; i < path.length; i++) {
    path[i].moveContentTo(path[i-1]);
    moves++;
    //console.log('move from ' + path[i].pos.x + ';' + path[i].pos.y + ' to ' + path[i-1].pos.x + ';' + path[i-1].pos.y)
  }
}

function loadPuzzle(puzzle) {
  currentPuzzle = puzzle;

  grid = [];
  biggestNodeSize = 0;
  for (let i=2; i < inputs[puzzle].length; i++) {
    let nodeInfo = inputs[puzzle][i].split(/ +/);
    let position = getNodePosition(nodeInfo[0]);
    let node = new Node(position, getSizeInfo(nodeInfo[2]), getSizeInfo(nodeInfo[3]))
    if (!grid[position.x]) {
      grid[position.x] = [];
    }
    grid[position.x][position.y] = node;

    // used for display
    if (node.total > biggestNodeSize) {
      biggestNodeSize = node.total;
    }
  }

  moves = 0;
  targetPosition = new Position(0,0);
  currentDataPosition = new Position(grid.length - 1, 0);
  currentTarget = getNextTarget();
  path = [];

  findViablePairs();

  possibleStarts = possibleStarts.sort(closestToTargetSort);
  // todo if we don't find a path, we could start looking at the rest of the list
  emptyNodePosition = possibleStarts[0];

  initAlgorithm();

  if (finished) {
    finished = false;
    loop();
  }

  // resize at the end because it will call draw()
  resizeCanvas(2*margin + (grid.length+1)*nodeSize, 2*margin + (grid[0].length+1)*nodeSize);
}

function getNextTarget() {
  let bestPosition;
  for (let neighbor of grid[currentDataPosition.x][currentDataPosition.y].potentialyAccessibleNeighbors()) {
    if (!bestPosition || distance(neighbor.pos, targetPosition) < distance(neighbor.pos, bestPosition)) {
      bestPosition = neighbor.pos;
    }
  }
  return bestPosition;
}

function closestToTargetSort(pos1, pos2) {
  return distance(pos1, currentDataPosition) - distance(pos2, currentDataPosition);
}

function findViablePairs() {
  viablePairs = [];
  possibleStarts = [];

  for (let x1 = 0; x1 < grid.length; x1++) {
    for (let y1 = 0; y1 < grid[x1].length; y1++) {
      let currentNode = grid[x1][y1];
      if (currentNode.isEmpty()) {
        continue;
      }
      for (let x2 = 0; x2 < grid.length; x2++) {
        for (let y2 = 0; y2 < grid[x2].length; y2++) {
          if (x2 === x1 && y2 === y1) {
            continue;
          }
          let targetNode = grid[x2][y2];
          if (targetNode.avail >= currentNode.used) {
            viablePairs.push([currentNode.pos, targetNode.pos]);
            if (possibleStarts.indexOf(targetNode.pos) === -1) {
              possibleStarts.push(targetNode.pos);
            }
          }
        }
      }
    }
  }
  console.log(possibleStarts);

  console.log('[PART 1] Found ' + viablePairs.length + ' viable pairs');
}

function getNodePosition(nodeName) {
  let match = nodeName.match(nodeNameRegexp);
  return new Position(int(match[1]), int(match[2]));
}

function getSizeInfo(sizeWithUnit) {
  return int(sizeWithUnit.match(/[0-9]+/)[0]);
}
