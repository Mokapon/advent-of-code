var input;

var rows;
var columns;
var cellWidth = 50;
var cellHeight = 60;
var gap = 5;

var buttons = [];

var currentDigit;
var currentInstruction;
var fingerIndex;
var code = '';

var finished = false;

function preload() {
  input = loadStrings('day2_input.txt');
}

function setup() {
  createCanvas(400, 400);
  textAlign(CENTER);

  // Create keyboard
  setupKeyboard(2);

  // Start with first digit
  nextDigit();
}

function draw() {
  if (finished) {
    return;
  }
  update();

  background(250);
  // Draw the buttons
  for (var i = 0; i < buttons.length; i++) {
    if (buttons[i] !== null) {
      buttons[i].draw();
    }
  }
  // Display the code
  text(code, width / 2, height)
}

function nextDigit() {
  // Start from button with value 5
  for (var i = 0; i < buttons.length; i++) {
    if (buttons[i] !== null && buttons[i].value === 5) {
      fingerIndex = i;
      break;
    }
  }

  currentInstruction = 0;
  if (currentDigit !== undefined) {
    currentDigit++;
  } else {
    currentDigit = 0;
  }
}

function setupKeyboard(part) {
  if (part === 1) {
    rows = 3;
    columns = 3;
    var xOrig = (width - (columns * cellWidth + (columns - 1) * gap)) / 2;
    var yOrig = (height - (rows * cellHeight + (columns - 1) * gap)) / 2;
    for (var i = 0; i < rows * columns; i++) {
      var col = i % columns;
      var row = int(i / columns)
      var x = xOrig + (gap + cellWidth) * col;
      var y = yOrig + (gap + cellHeight) * row;
      buttons.push(new Button(i + 1, x, y));
    }
  } else {
    rows = 5;
    columns = 5;
    centreId = int(columns / 2);
    var xOrig = (width - (columns * cellWidth + (columns - 1) * gap)) / 2;
    var yOrig = (height - (rows * cellHeight + (columns - 1) * gap)) / 2;
    var count = 0;
    for (var row = 0; row < rows; row++) {
      var nbElements;
      if (row < rows / 2) {
        nbElements = 1 + row * 2;
      } else {
        nbElements = 1 + (rows - 1 - row) * 2;
      }
      var first = centreId - int(nbElements / 2);
      var last = centreId + int(nbElements / 2);
      for (var col = 0; col < columns; col++) {
        if (col < first || col > last) {
          buttons.push(null);
        } else {
          var x = xOrig + (gap + cellWidth) * col;
          var y = yOrig + (gap + cellHeight) * row;
          buttons.push(new Button(++count, x, y));
        }
      }
    }
  }
}

function getCol(index) {
  return index % columns;;
}

function getRow(index) {
  return int(index / columns);
}

function moveFinger(direction) {
  var col = getCol(fingerIndex);
  if (direction === 'U' && fingerIndex > columns) {
    return fingerIndex - columns;
  } else if (direction === 'D' && fingerIndex < columns * rows - columns) {
    return fingerIndex + columns;
  } else if (direction === 'L' && col > 0) {
    return fingerIndex-1;
  } else if (direction === 'R' && col < columns - 1) {
    return fingerIndex+1;
  }
  return fingerIndex;
}

function update() {
  var instruction = input[currentDigit].charAt(currentInstruction);
  
  // Update the cursor if needed
  var newIndex = moveFinger(instruction);
  if (newIndex !== fingerIndex && buttons[newIndex] !== null) {
    buttons[fingerIndex].highlight(false);
    buttons[newIndex].highlight(true);
    fingerIndex = newIndex;
  }
  
  // Move to the next instruction
  currentInstruction++;
  if (currentInstruction >= input[currentDigit].length) {
    code += buttons[fingerIndex].value;
    // Move to next digit or finish
    if (currentDigit >= input.length) {
      finished = true;
    } else {
      nextDigit();
    }
  }
}