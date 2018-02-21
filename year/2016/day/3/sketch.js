var input;
var invalid = 0;
var valid = 0;
var currentIndex = 0;
var edges = [];

function preload() {
  input = loadStrings('input.txt');
}

function setup() {
  createCanvas(400, 400);
  var tmp = [];
  for (var i = 0; i < input.length; i++) {
    var edge = input[i].split(/\s+/).filter(function(e) {
      return e.trim().length > 0;
    });
    for (var j = 0; j < edge.length; j++) {
      if (!tmp[j]) {
        tmp[j] = [];
      }
      tmp[j].push(int(edge[j]));
    }
  }
  for (var i = 0; i < tmp.length; i++) {
    edges = edges.concat(tmp[i]);
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
    text(valid, width / 2, height / 3);
    text(invalid, width / 2, height *2 / 4);
  }
}

function checkTriangle(a, b, c) {
  return (a + b) > c && (a + c) > b && (b + c) > a
}