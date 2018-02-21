var input = "R3, L5, R2, L2, R1, L3, R1, R3, L4, R3, L1, L1, R1, L3, R2, L3, L2, R1, R1, L1, R4, L1, L4, R3, L2, L2, R1, L1, R5, R4, R2, L5, L2, R5, R5, L2, R3, R1, R1, L3, R1, L4, L4, L190, L5, L2, R4, L5, R4, R5, L4, R1, R2, L5, R50, L2, R1, R73, R1, L2, R191, R2, L4, R1, L5, L5, R5, L3, L5, L4, R4, R5, L4, R4, R4, R5, L2, L5, R3, L4, L4, L5, R2, R2, R2, R4, L3, R4, R5, L3, R5, L2, R3, L1, R2, R2, L3, L1, R5, L3, L5, R2, R4, R1, L1, L5, R3, R2, L3, L4, L5, L1, R3, L5, L2, R2, L3, L4, L1, R1, R4, R2, R2, R4, R2, R2, L3, L3, L4, R4, L4, L4, R1, L4, L4, R1, L2, R5, R2, R3, R3, L2, L5, R3, L3, R5, L2, R3, R2, L4, L3, L1, R2, L2, L3, L5, R3, L1, L3, L4, L3";

var cellWidth = 10;
var gridSize = 51;
var canvasSize = cellWidth * gridSize;

var update = false;

var bunny;
var offset;
var scrollLimit = 4;

var nbPerLoop = 1;
var moves = input.split(', ');
var moveId = 0;

function setup() {
  createCanvas(canvasSize, canvasSize);
  frameRate(10);
  bunny = new Bunny();
  offset = createVector(0, 0);
  update = true;
}

function keyReleased() {
  if (keyCode === LEFT_ARROW) {
    bunny.left();
    update = true;
  } else if (keyCode === RIGHT_ARROW) {
    bunny.right();
    update = true;
  } else if (keyCode === UP_ARROW) {
    update = true;
    bunny.forward();
    computeOffset();
  }

  return false; // prevent any default behavior
}

function move() {
  if (moveId < moves.length) {
    for (var i = 0; i < nbPerLoop && i + moveId < moves.length; i++) {
      var move = moves[i + moveId];
      if (move.substring(0,1) === 'R') {
        bunny.right();
      } else {
        bunny.left();
      }
      var distance = int(move.substring(1));
      for (var j = 0 ; j < distance; j++) {
        bunny.forward();
        computeOffset();
      }
    }
    moveId += nbPerLoop;
    update = true;
  }
}

function computeOffset() {
  if (bunny.pos.x + offset.x < -floor(gridSize / 2) + scrollLimit) {
      offset.x += 1;
    } else if (bunny.pos.x + offset.x > floor(gridSize / 2) - scrollLimit) {
      offset.x -= 1;
    } else if (bunny.pos.y + offset.y < -floor(gridSize / 2) + scrollLimit) {
      offset.y += 1;
    } else if (bunny.pos.y + offset.y > floor(gridSize / 2) - scrollLimit) {
      offset.y -= 1;
    }
}


function draw() {
  move();

  if (update) {
    background(55);
    for (var i = 0; i < floor(canvasSize / cellWidth); i++) {
      for (var j = 0; j < floor(canvasSize / cellWidth); j++) {
        noFill();
        stroke(255);
        rect(i * cellWidth, j * cellWidth, cellWidth, cellWidth);
      }
    }

    translate(width / 2, height / 2);
    for (var i = 0; i < bunny.trace.length; i++) {
      fill(155, 155, 255, 100);
      loc = bunny.trace[i];
      if (loc.x + offset.x < -floor(gridSize / 2) || loc.x + offset.x > floor(gridSize / 2) || loc.y + offset.y > floor(gridSize / 2) || loc.y + offset.y < -floor(gridSize / 2)) {
        continue;
      }
      rect((loc.x + offset.x) * cellWidth - cellWidth / 2, (loc.y + offset.y) * cellWidth - cellWidth / 2, cellWidth, cellWidth);
    }

    // display bunny
    fill(155, 0, 100);
    noStroke();
    bunny.draw();

    textSize(32);
    fill(255);
    text(bunny.pos.x + "," + -bunny.pos.y, -canvasSize / 2 + cellWidth, canvasSize / 2 - cellWidth);

    update = false;
  }
}