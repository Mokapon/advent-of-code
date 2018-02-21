var input;
var sentences = [];
var code;

function preload() {
  input = loadStrings('input.txt');
}

function setup() {
  createCanvas(400, 400);
  
  countOccurrences();
  sortOccurrences();
  code = getCode();
}

function draw() {
  text(code, width/2, height/2);
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
    sentences[i].sort(function(l1, l2) {
      return l1.occ - l2.occ;
    });
  }
}

function countOccurrences() {
  for (var i = 0; i < input.length; i++) {
    var word = input[i];
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
  }
}