/* Code is super messy, sorry... */

var test = ['ADVENT', 'A(1x5)BC', '(3x3)XYZ', '(6x1)(1x3)A', 'X(8x2)(3x3)ABCY'];
var expected = ['ADVENT', 'ABBBBBC', 'XYZXYZXYZ', '(1x3)A', 'X(3x3)ABC(3x3)ABCY'];
var expectedv2 = ['ADVENT', 'ABBBBBC', 'XYZXYZXYZ', 'AAA', 'XABCABCABCABCABCABCY'];

var testLen = ['ADVENT', 'A(1x5)BC', '(3x3)XYZ', '(6x1)(1x3)A', 'X(8x2)(3x3)ABCY', '(27x12)(20x12)(13x14)(7x10)(1x12)A', '(25x3)(3x3)ABC(2x3)XY(5x2)PQRSTX(18x9)(3x2)TWO(5x7)SEVEN'];
var expectedLen2 = [6, 7, 9, 3, 20, 241920, 445];

var inputFile;
var regex = /\((\d+)x(\d+)\)/g;

var result;
var len = 0;

var version2 = false;
var finished = false;

function preload() {
  inputFile = loadStrings('input9.txt');
}

function setup() {
  createCanvas(700, 200). parent('sketch');

  textAlign(CENTER);
  loadPuzzle(0);
}

function loadPuzzle (puzzle) {
  regex.lastIndex = 0;
  finished = false;
  if (puzzle === 0) {
    console.clear();
    console.log('Test algorithms with version 1 of the decompression.');
    version2 = false;
    testDecompress();
    testLength();
    console.log('Test algorithms with version 2 of the decompression.');
    version2 = true;
    testDecompress();
    testLength();
    len = -1;
    finished = true;
  } else if (puzzle === 1) {
    version2 = false;
    result = inputFile[0];
  } else {
    version2 = true;
    input = inputFile[0];
    len = measure(input, 0, 1);
  }
}

function draw() {
  if (!version2 && !finished) {
    var r = decompress();
    if (r && r.length > 0) {
      len = r.length;
    } else {
      finished = true;
    }
  }

  if (!finished) {
    background(250);
    text(len, width / 2, height / 2);
    if (version2) {
      finished = true;
    }
  } else if (len === -1) {
    background(250);
    text('Look at console to see the algorithms result on example strings.', width / 2, height / 2)
  }
}

function measure(s, chrs, tms) {
  if (chrs === 0 || version2) {
    regex.lastIndex = 0;
  }
  var m = regex.exec(s);
  if (s.length === 0) {
    return 0;
  }
  if (m) {
    var start = m.index;
    var end = regex.lastIndex
    if (start > chrs) {
      return tms * chrs + (start-chrs) + measure(s.substring(start), 0, 1);
    }

    var nbChars = int(m[1]);
    var times = int(m[2]);

    var rest = nbChars - start;
    return start * tms 
    + measure(s.substring(end, end + nbChars), nbChars, times * tms) 
    + measure(s.substring(end + nbChars), chrs - nbChars, tms);
  }

  return Math.min(chrs, s.length) * tms + Math.max(0, s.length - chrs);
}

function decompress() {
  var m = regex.exec(result);
  var res = result;
  if (m) {
    var nb = int(m[1]);
    var times = int(m[2]);
    var id = m.index;
    var seq = result.substring(regex.lastIndex, regex.lastIndex + nb);

    result = result.splice(id, m[0].length + seq.length, '');
    regex.lastIndex = id;

    for (var i = 0; i < times; i++) {
      result = result.splice(id, 0, seq);
      id += seq.length;
    }
    res = result;
    if (!version2) {
      regex.lastIndex = id;
    } else {
      res = result.substring(0, regex.lastIndex);
      result = result.substring(regex.lastIndex);
      regex.lastIndex = 0;
    }
  } else {
    finished = true;
  }
  return res;
}

function testDecompress() {
  for (var i = 0; i < test.length; i++) {
    finished = false;
    var res = '';
    result = test[i];
    while (!finished) {
      let d = decompress();
      if (version2) {
        res += d;
      } else {
        res = d;
      }
    }
    var e = version2 ? expectedv2[i] : expected[i];
    if (e === res) {
      console.log('Dec. Ok: ' + test[i] + ' -> ' + res)
    } else {
      console.error('Dec. Fail for ' + test[i] + ': ' + res + ' != ' + e)
    }
  }
}

function testLength() {
  var t = version2 ? testLen : test;
  for (var i = 0; i < t.length; i++) {
    var len = measure(t[i], 0, 1);
    var e = version2 ? expectedLen2[i] : expected[i].length;
    if (e === len) {
      console.log('Len. Ok: ' + t[i] + ' -> ' + len)
    } else {
      console.error('Len. Fail for ' + test[i] + ': ' + len + ' != ' + e)
    }
  }
}

if (!String.prototype.splice) {
  String.prototype.splice = function(idx, rem, str) {
    return this.slice(0, idx) + str + this.slice(idx + Math.abs(rem));
  };
}