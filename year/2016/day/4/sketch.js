var input;
var rooms = [];

var regexp = /([a-z\-]*)-([0-9]*)\[(.*)\]/;
var checksumLength = 5;

var sum = 0;
var valid = 0;
var invalid = 0;
var currentId = 0;

function preload() {
  input = loadStrings('input.txt');
}

function setup() {
  createCanvas(400,200).parent('sketch');
  
  textAlign(CENTER);
  loadPuzzle();
}

function loadPuzzle() {
  for (var i = 0; i < input.length; i++) {
    var match = regexp.exec(input[i]);
    var room = new Room(match[1], int(match[2]), match[3]);
    rooms.push(room);
  }
}

function draw() {
  update();
  
  background(250);
  text('Sum of ids of real rooms: ' + sum, width/2, height/3);
  text('Real rooms: '  +   valid, width*1/3, height*2/3);
  text('False rooms: ' + invalid, width*2/3, height*2/3);
}

function update() {
  if (currentId < rooms.length) {
    var room = rooms[currentId];
    if (room.isValid()) {
      sum += room.sector;
      valid++;
    } else {
      invalid++;
    }
    currentId++;
    if(room.decipheredName.includes("north")) {
      console.log(room);
    }
  }
}