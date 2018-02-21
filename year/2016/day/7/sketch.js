// check abba inside []
var regex_abba_in = /\[[^\]]*([^\]])([^\]](?!\1))\2\1[^\]]*\]/;
// check abba outside []
var regex_abba_out = /(?:^|\])[^\[]*([^\[])([^\[](?!\1))\2\1/;

// ada inside [] then dad outside one
var regex_ada_in_first = /\[[^\]]*([^\]])((?!\1)[^\]])\1[^\]]*\](?:[^\[]*\[[^\]]*\])*[^\[]*\2\1\2/;
// ada outside [] then dad inside one
var regex_ada_out_first = /(?:^|\])[^\[]*([^\[])((?!\1)[^\[])\1.*\[[^\]]*\2\1\2/;

var input;
var index = 0;

var tls = 0;
var ssl = 0;

function preload() {
  input = loadStrings('input.txt');
}

function setup() {
  createCanvas(400, 400);
}

function draw() {
  if (index < input.length) {
    checkString(input[index++]);
  }
  background(250);
  text(tls, width / 2, height / 3);
  text(ssl, width / 2, height * 2 / 3);
}

function checkString(s) {
  if (!regex_abba_in.exec(s) && regex_abba_out.exec(s)) {
    tls++;
  }
  if (regex_ada_in_first.exec(s) || regex_ada_out_first.exec(s)) {
    ssl++;
  }
}