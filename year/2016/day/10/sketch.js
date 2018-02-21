var input;

var chipsNb = 2; //number of chips for a robot to act

var bots = [];
var inputs = [];
var outputs = [];

var done;

var botSize = 20;
var botGap = 5;
var verticalGap = 100;

var botRegex = /bot ([0-9]+) gives low to (output|bot) ([0-9]+) and high to (output|bot) ([0-9]+)/
var inputRegex = /value ([0-9]+) goes to bot ([0-9]+)/

function preload() {
  input = loadStrings('input10.txt');
}

function setup() {
  parseInput();
  //frameRate(4);

  // width = nb of robots + width for the input (value + bot size)
  var w = bots.length * (botSize + botGap) + (botSize + botGap) * 5;
  // height = height of input + height for robots + height for outputs
  var h = (botSize + botGap) * 3 + verticalGap + botSize + inputs.length * botSize + botGap * (inputs.length - 1);
  createCanvas(w, h);

  // compute location of the inputs & outputs
  setInputsPositions();
  setOutputsPositions();
  setRobotsPositions();
}

function draw() {
  if(!done) {
    updateState();
    //checkState();
    background(250);
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
  }
}

function checkState() {
  for (var i = 0; i < bots.length; i++) {
    var bot = bots[i];
    if (bot.full() && bot.lowest().value === 17 && bot.highest().value === 61) {
      console.log("WEEEEE BOT " + i)
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
  this.done = true;
}

function setRobotsPositions() {
  var xOffset = (botSize + botGap) * 4;
  for (var i = 0; i < bots.length; i++) {
    bots[i].draw();
    var bot = bots[i];
    var x = xOffset + botSize / 2 + botGap + i * (botSize + botGap);
    var y = height - (botSize + botGap) * 3
    bots[i].setDefaultPosition(x, y);
  }
}

function setInputsPositions() {
  // Draw input
  var inputHeight = inputs.length * botSize + botGap * (inputs.length - 1);
  var yOffset = height / 2 - inputHeight / 2 - botSize;
  for (var i = 0; i < inputs.length; i++) {
    var x = botGap;
    var y = yOffset + botSize / 2 + botGap + i * (botSize + botGap);
    inputs[i].setPosition(x, y);
  }
}

function setOutputsPositions() {
  var outputWidth = outputs.length * botSize + botGap * (outputs.length - 1);
  var xOffset = (botSize + botGap) * 4 + width / 2 - outputWidth / 2 - botSize;
  for (var i = 0; i < outputs.length; i++) {
    var output = outputs[i];
    var x = botSize / 2 + botGap + i * (botSize + botGap) + xOffset;
    var y = (botSize + botGap) * 2;
    output.setPosition(x, y);
  }
}

function parseInput() {
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