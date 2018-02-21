var input = 'ojvtpuvg';

var pwd = [];
var pwdLen = 8;
var progress = 0;

var requiredString = "00000";
var positionChar = 6;
var pwdChar = 7;

var index = 0;
var step = 2500;

function setup() {
  createCanvas(400, 400);

  for (var i = 0; i < pwdLen; i++) {
    pwd[i] = '_';
  }
}

function draw() {
  if (progress < pwdLen) {
    findNextChar();
  }

  background(250);

  text(input, width / 3, height / 3);
  text(pwd.join(''), width * 2 / 3, height / 3);
  text(index, width / 2, height * 2 / 3);
}

function findNextChar() {
  var hash = "";
  var i;
  for (i = 0; i < step; i++) {
    hash = md5(input + (index + i));
    if (hash.indexOf(requiredString) === 0) {
      var pos = hash.charAt(positionChar - 1)
      if (pos < pwdLen && pwd[pos] === '_') {
        var chr = hash.charAt(pwdChar - 1)
        pwd[pos] = chr;
        progress++;
        console.log(index + i);
        console.log(hash);
        }
      }
    }
    index += i;
  }