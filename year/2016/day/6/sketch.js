let input;

let sortFunction;
let sentences;
let code;
let currentIndex;

let finished = false;

function preload() {
  input = loadStrings('input.txt');
}

function setup() {
  createCanvas(600, 200).parent('sketch');
  textSize(16);
  textAlign(CENTER);

  loadPuzzle(1);
}

function loadPuzzle(puzzle) {
  sentences = [];
  code = '';
  currentIndex = 0;

  if (puzzle <= 1) {
    sortFunction = sortDescending;
  } else {
    sortFunction = sortAscending;
  }

  if (finished) {
    finished = false;
    loop();
  } 
}

function draw() {
  background(250);
  text('Analyzed ' + currentIndex + ' of ' + input.length + ' words.', width/2, height*1/3);
  text('Message: ' + code, width/2, height*2/3);

  if (finished) {
    noLoop();
  } else {
    nextWord();
    sortOccurrences();
    code = getCode();

    if (currentIndex >= input.length) {
      finished = true;
    }
  }
}

function nextWord() {
  var word = input[currentIndex];
  for (var j = 0; j < word.length; j++) {
    var letter = word.charAt(j);
    var newletter = true;
    if (!sentences[j]) {
      sentences[j] = [];
    } else {
      for (var k = 0; k < sentences[j].length; k++) {
        if (sentences[j][k].letter === letter) {
          sentences[j][k].occ = sentences[j][k].occ + 1;
          newletter = false;
          break;
        }
      }
    }
    if (newletter) {
      sentences[j].push({
        letter: letter,
        occ: 1
      });
    }
  }
  currentIndex++;
}

function getCode() {
  var res = '';
  for (var i = 0; i < sentences.length; i++) {
    res += sentences[i][0].letter;
  }
  return res;
}

function sortOccurrences() {
  for (var i = 0; i < sentences.length; i++) {
    sentences[i].sort(sortFunction);
  }
}

function sortDescending(l1, l2) {
  return l2.occ - l1.occ;
}

function sortAscending(l1, l2) {
  return l1.occ - l2.occ;
}

