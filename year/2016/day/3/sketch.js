var input;

var invalid;
var valid;
var currentIndex;
var edges;

function preload() {
  input = loadStrings('input.txt');
}

function setup() {
  let canvas = createCanvas(400, 200);
  canvas.parent('sketch');

  loadPuzzle(0);
}

function loadPuzzle(puzzle) {
  invalid = 0;
  valid = 0;
  currentIndex = 0;

  parseTriangles(puzzle);
}

function parseTriangles(puzzle) {
  edges = [];
  var tmp = [];
  for (var i = 0; i < input.length; i++) {
    var edge = input[i].split(/\s+/).filter(function(e) {
      return e.trim().length > 0;
    });
    for (var j = 0; j < edge.length; j++) {
      if (puzzle <= 1) {
        edges.push(int(edge[j]));
      } else {
        if (!tmp[j]) {
          tmp[j] = [];
        }
        tmp[j].push(int(edge[j]));
      }
    }
  }
  if (puzzle === 2) {
    for (var i = 0; i < tmp.length; i++) {
      edges = edges.concat(tmp[i]);
    }
  }
}

function draw() {
  if (currentIndex <= edges.length - 3) {
    if (!checkTriangle(int(edges[currentIndex]), int(edges[currentIndex+1]), int(edges[currentIndex+2]))) {
      invalid++;
    } else {
      valid++;
    }
    currentIndex+=3;
    
    background(250);
    text('Valid: '   +   valid, width / 2, height * 1 / 3);
    text('Invalid: ' + invalid, width / 2, height * 2 / 4);
  }
}

function checkTriangle(a, b, c) {
  return (a + b) > c && (a + c) > b && (b + c) > a
}
