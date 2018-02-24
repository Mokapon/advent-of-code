var inputs = [];
inputs[0] = 'abc';
inputs[1] = 'ojvtpuvg';
inputs[2] = 'ojvtpuvg';

const PWD_LEN = 8;

var input;
var pwd;
var progress;
var index;

var requiredString = '00000';
var positionChar = 6;
var pwdChar = 7;

var step = 10000;

function setup() {
  createCanvas(400, 200).parent('sketch');
  textAlign(CENTER);

  loadPuzzle(0);
}

function loadPuzzle(puzzle) {
  input = inputs[puzzle];
  pwd = [];
  index = 0;
  progress = 0;
  if (puzzle <= 1) {
    positionChar = -1;
    pwdChar = 6;
  } else {
    positionChar = 6;
    pwdChar = 7;
  }

  for (var i = 0; i < PWD_LEN; i++) {
    pwd[i] = '_';
  }
}

function draw() {
  if (progress < PWD_LEN) {
    findNextChar();
  }

  background(250);

  text(input, width / 3, height / 3);
  text(pwd.join(''), width * 2 / 3, height / 3);
  text(index, width / 2, height * 2 / 3);
}

function findNextChar() {
  var hash = '';
  var i;
  for (i = 0; i < step; i++) {
    hash = md5(input + (index + i));
    if (hash.indexOf(requiredString) === 0) {
      var pos;
      if (positionChar < 0) {
        // Place at next free position
        pos = progress;
      } else {
        // Place at position given by the char at positionChar
        pos = hash.charAt(positionChar - 1);
      } 
      if (pos < PWD_LEN && pwd[pos] === '_') {
        var chr = hash.charAt(pwdChar - 1)
        pwd[pos] = chr;
        progress++;
      }
    }
  }
  index += i;
}
