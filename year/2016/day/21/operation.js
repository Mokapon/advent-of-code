
let KEYWORD_LEFT = 'left';
let KEYWORD_RIGHT = 'right';

let INST_SWAP_POSITION = 1;
let INST_SWAP_LETTER =  2;
let INST_ROTATE_STEPS = 3;
let INST_ROTATE_POSITION = 4;
let INST_REVERSE = 5;
let INST_MOVE = 6;

let INSTRUCTIONS = [
{'regexp':/^swap position ([0-9]+) with position ([0-9]+)$/, 'id':INST_SWAP_POSITION},
{'regexp':/^swap letter ([a-z]) with letter ([a-z]+)$/, 'id':INST_SWAP_LETTER},
{'regexp':/^rotate (left|right) ([0-9]+) steps?$/, 'id':INST_ROTATE_STEPS},
{'regexp':/^rotate based on position of letter ([a-z])$/, 'id':INST_ROTATE_POSITION},
{'regexp':/^reverse positions ([0-9]+) through ([0-9]+)$/, 'id':INST_REVERSE},
{'regexp':/^move position ([0-9]+) to position ([0-9]+)$/, 'id':INST_MOVE}
];

function getType(text) {
  for (let instruction of INSTRUCTIONS) {
    if (text.match(instruction.regexp)) {
      return instruction.id;
    }
  }
}

function getParams(text) {
  for (let instruction of INSTRUCTIONS) {
    let match = text.match(instruction.regexp);
    if (match) {
      let params = match.slice(1, match.length);
      switch(instruction.id) {
        case INST_SWAP_POSITION:
        case INST_REVERSE:
        case INST_MOVE:
        params[0] = int(params[0]);
        params[1] = int(params[1]);
        break;
        case INST_ROTATE_STEPS:
        params[1] = int(params[1]);
        break;
      }
      return params;
    }
  }
}

function Operation(index, content) {
  this.index = index;
  this.content = content;

  this.type = getType(content);
  this.params = getParams(content);
  
  this.x = MARGIN;
  this.y = MARGIN + index * LINE_HEIGHT;

  this.parseParams = function() {
    return true;
  }

  this.draw = function() {
    if (this.index===currentOperation) {
      fill('#00cc00');
      textStyle(BOLD);
      text('> ' + this.content, this.x, this.y);
    } else {
      fill('#cccccc');
      textStyle(NORMAL);
      text(this.content, this.x, this.y);
    }
  }

  this.apply = function(input) {
    let charArray = input.split('');
    switch(this.type) {
      case INST_SWAP_POSITION:
        swapPosition(charArray, this.params[0], this.params[1]);
        break;
      case INST_SWAP_LETTER:
        swapLetter(charArray, this.params[0], this.params[1]);
        break;
      case INST_ROTATE_STEPS:
        rotateArray(charArray, this.params[0], this.params[1]);
        break;
      case INST_ROTATE_POSITION:
        let targetIndex = charArray.indexOf(this.params[0]);
        let direction = this.params[1] ? this.params[1] : KEYWORD_RIGHT;
        let steps = targetIndex+1;
        if (targetIndex>=4) {
          steps++;
        }
        rotateArray(charArray, direction, steps%charArray.length);
        break;
      case INST_REVERSE:
        reverseElements(charArray, this.params[0], this.params[1]);
        break;
      case INST_MOVE:
        moveElement(charArray, this.params[0], this.params[1]);
        break;
    }
    return charArray.join('');
  }

  this.reverse = function(input) {
    let charArray = input.split('');
    switch (this.type) {
      case INST_MOVE:
        moveElement(charArray, this.params[1], this.params[0]);
        break;
      case INST_ROTATE_STEPS:
        let direction = this.params[0]===KEYWORD_LEFT ? KEYWORD_RIGHT : KEYWORD_LEFT;
        rotateArray(charArray, direction, this.params[1]);
        break;
      case INST_ROTATE_POSITION:
        let targetIndex = charArray.indexOf(this.params[0]);
        let steps;
        if (targetIndex%2===0) {
          let prevIndex = targetIndex/2 - 1;
          while (prevIndex<4) {
            prevIndex+=charArray.length/2;
          }
          steps = charArray.length - (prevIndex - targetIndex);
        } else {
          steps = (targetIndex - 1) /2 + 1;
        }
        rotateArray(charArray, KEYWORD_LEFT, steps);
        break;
      default:
        return this.apply(input);
    }
    return charArray.join('');
  }
}

function rotateArray(array, direction, steps) {
  let copy = array.slice();
  let rotation = direction === KEYWORD_RIGHT ? +1 : -1;
  let indexOffset = array.length - rotation * steps;
  for (let i = 0; i<array.length; i++) {
    array[i] = copy[(i+indexOffset)%array.length];
  }
}

function reverseElements(array, start, end) {
  let elements = array.slice(start, end+1);
  for (let i = 0; i<=(end-start); i++) {
    array[end - i] = elements[i];
  }
}

function moveElement(array, targetIndex, destinationIndex) {
  let element = array.splice(targetIndex, 1);
  array.splice(destinationIndex, 0, element);
}

function swapPosition(array, index1, index2) {
  // swap position of letters in param
  let tmp = array[index1];
  array[index1] = array[index2];
  array[index2] = tmp;
}

function swapLetter(array, letter1, letter2) {
  for (let i = 0; i<array.length; i++) {
    if (array[i] === letter1) {
      array[i] = letter2;
    } else if (array[i] === letter2) {
      array[i] = letter1;
    }
  }
}