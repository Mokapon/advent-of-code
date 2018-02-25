var inputFiles = [];
var input;

var chipsNb = 2; //number of chips for a robot to act

var bots;
var inputs;
var outputs;

var finished = false;

var botSize = 15;
var botGap = 2;
var verticalGap = 100;

var botRegex = /bot ([0-9]+) gives low to (output|bot) ([0-9]+) and high to (output|bot) ([0-9]+)/
var inputRegex = /value ([0-9]+) goes to bot ([0-9]+)/

function preload() {
  inputFiles[0] = loadStrings('input/example.txt');
  inputFiles[1] = loadStrings('input/input.txt');
}

function setup() {
  createCanvas(400, 400).parent('sketch');

  loadPuzzle(0);
}

function loadPuzzle(puzzle) {
  input = inputFiles[puzzle];
  parseInput();

  // width = nb of robots + width for the input (value + bot size)
  var w = max(300, bots.length * (botSize + botGap) + (botSize + botGap) * 5);
  // height = height of input + height for robots + height for outputs
  var h = (botSize + botGap) * 3 + verticalGap + botSize + inputs.length * botSize + botGap * (inputs.length - 1);

  // compute location of the inputs & outputs
  setInputsPositions(w, h);
  setOutputsPositions(w, h);
  setRobotsPositions(w, h);

  if (finished) {
    finished = false;
    loop();
  }
  resizeCanvas(w, h);
}

function draw() {
  if(!finished) {
    updateState();
    checkState();
    background(230);
    // Draw robots
    for (var i = 0; i < bots.length; i++) {
      bots[i].draw();
    }
    // Draw inputs
    for (var i = 0; i < inputs.length; i++) {
      inputs[i].draw();
    }
    // Draw outputs
    for (var i = 0; i < outputs.length; i++) {
      outputs[i].draw();
    }
  } else {
    let r = 1;
    for (let i = 0; i<=2; i++) {
      for (let chip of outputs[i].chips) {
        r *= chip.value;
      }
    }
    console.log('[PART 2] Multiplication of values of the chips in outputs 0, 1 and 2: ' + r);
    noLoop();
  }
}

function checkState() {
  for (var i = 0; i < bots.length; i++) {
    var bot = bots[i];
    if (bot.full() && bot.lowest().value === 17 && bot.highest().value === 61) {
      console.log('[PART 1] Bot ' + i + ' compares chips 17 and 61.');
      return;
    }
  }
}

function updateState() {
  for (var i = 0; i < bots.length; i++) {
    if (bots[i].isActing) {
      bots[i].act();
      return;
    }
  }
  for (var i = 0; i < bots.length; i++) {
    if (bots[i].findNextAction()) {
      bots[i].act();
      return;
    }
  }
  // no bot could act
  finished = true;
}

function setRobotsPositions(width, height) {
  var botsWidth = bots.length * botSize + botGap * (bots.length - 1);
  var xOffset =  max((botSize + botGap) * 4, width / 2 - botsWidth / 2 - botSize);
  for (var i = 0; i < bots.length; i++) {
    bots[i].draw();
    var bot = bots[i];
    var x = xOffset + botSize / 2 + botGap + i * (botSize + botGap);
    var y = height - (botSize + botGap) * 3
    bots[i].setDefaultPosition(x, y);
  }
}

function setInputsPositions(width, height) {
  // Draw input
  var inputHeight = inputs.length * botSize + botGap * (inputs.length - 1);
  var yOffset = height / 2 - inputHeight / 2;
  for (var i = 0; i < inputs.length; i++) {
    var x = botGap;
    var y = yOffset + botSize / 2 + botGap + i * (botSize + botGap);
    inputs[i].setPosition(x, y);
  }
}

function setOutputsPositions(width, height) {
  var outputWidth = outputs.length * botSize + botGap * (outputs.length - 1);
  var xOffset = max((botSize + botGap) * 4, width / 2 - outputWidth / 2 - botSize);
  for (var i = 0; i < outputs.length; i++) {
    var output = outputs[i];
    var x = botSize / 2 + botGap + i * (botSize + botGap) + xOffset;
    var y = (botSize + botGap) * 2;
    output.setPosition(x, y);
  }
}

function parseInput() {
  inputs = [];
  outputs = [];
  bots = [];

  var res;
  for (var i = 0; i < input.length; i++) {
    // bot 49 gives low to bot 118 and high to bot 182
    if (res = botRegex.exec(input[i])) {
      // Bot
      var bot = int(res[1]);
      if (!bots[bot]) {
        bots[bot] = new Bot(bot)
      }
      // Lowest
      setTarget(bots[bot], res[2], int(res[3]), bots[bot].setLowTarget);
      // Highest
      setTarget(bots[bot], res[4], int(res[5]), bots[bot].setHighTarget);
    } else if (res = inputRegex.exec(input[i])) {
      var value = int(res[1]);
      var bot = int(res[2]);
      // Add value to inputs
      var chip = new Chip(value);
      inputs.push(chip);
      // Add bot
      if (!bots[bot]) {
        bots[bot] = new Bot(bot)
      }
      bots[bot].addInputTarget(chip);
    }
  }
}

function setTarget(bot, element, id, method) {
  var target;
  if (element === 'bot') {
    if (!bots[id]) {
      bots[id] = new Bot(id);
    }
    target = bots[id];
  } else if (element === 'output') {
    if (!outputs[id]) {
      outputs[id] = new Output(id);
    }
    target = outputs[id];
  }
  method.apply(bot, [target]);
}