let EXAMPLE = 0;
let PART1 = 1;
let PART2 = 2;

let inputs = [];
let currentPuzzle;

// display constants
let centerDistance = 200
let minPlayerSize = 15;
let maxPlayerSize = 50;

// simulation status
let finished = false;

// simulation constants
let stepsByFrame = 100;

// simulation variables
let numPlayers;
let players;
let numActivePlayers;
let currentPlayerIndex;

function preload() {
  inputs[EXAMPLE] = 5;
  inputs[PART1] = 3017957;
  inputs[PART2] = 3017;
}

function setup() {
  let canvas = createCanvas(500, 500);
  canvas.parent('sketch');

  textAlign(CENTER, CENTER);
  textSize(16);
  //frameRate(6);

  loadPuzzle(EXAMPLE);
}

function draw() {
  background(230);
  translate(width/2, height/2);

  // print players
  if (currentPuzzle === EXAMPLE) {
    for (let player of players) {
      player.draw();
    }
  } else {
    text('Left: ' + numActivePlayers, 0, 0);
  }

  if (finished) {
    noLoop();
    console.log(frameCount);
  } else {
    nextStep();
    checkEnd();
  }
}

function checkEnd() {
  if (numActivePlayers === 1) {
    console.log('Elf ' + players[currentPlayerIndex].number + ' wins.')
    finished = true;
  }
}

function nextStep() {
  if (currentPuzzle === EXAMPLE) {
    nextPlayer();
  } else {
    let steps = min(stepsByFrame, numActivePlayers-1);
    for (let i = 0; i < steps; i++) {
      nextPlayer();
    }
  }
}

function nextPlayer() {
  let currentPlayer = players[currentPlayerIndex];

  let stolenPlayerIndex = (currentPlayerIndex+1)%numPlayers;
  // For part 2, steal the opposite player, otherwise the next
  let toSkip = currentPuzzle === PART2? floor(numActivePlayers/2) - 1 : 0;

  while (toSkip > 0 || players[stolenPlayerIndex].numPresents === 0) {
    if (players[stolenPlayerIndex].numPresents > 0) {
      toSkip--;
    }
    stolenPlayerIndex = (stolenPlayerIndex+1)%numPlayers;
  }

  // Steal from target
  let stolenPlayer = players[stolenPlayerIndex];
  currentPlayer.steal(stolenPlayer);
  numActivePlayers--;

  // Go to next active player
  do {
    currentPlayerIndex = (currentPlayerIndex+1)%numPlayers;
  } while (players[currentPlayerIndex].numPresents === 0);

  if (numActivePlayers < 10) {
    console.log('Elf ' + currentPlayer.number + ' steals from elf ' + stolenPlayer.number);
  }
}

function keyReleased() {
  if (key === 'R') {
    loadPuzzle(currentPuzzle);
  }
}

function loadPuzzle(puzzle) {
  currentPuzzle = puzzle;

  numPlayers = inputs[puzzle];
  
  numActivePlayers = numPlayers;
  currentPlayerIndex = 0;
  players = [];
  for (let i = 1; i <= numPlayers; i++) {
    players.push(new Player(i));
  }

  if (finished) {
    finished = false;
    loop();
  }
  console.log(frameCount);
}
