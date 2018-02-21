let EXAMPLE = 0;
let PART1 = 1;
let PART2 = 2;

let inputs = [];
let currentPuzzle;

let auto = false;
let fps = 10;

// display constants
let lineHeight = 25;
let codeMargin = 20;
let registerMargin = 100;

let registerX = 320;
let valueX = 380;
let registerSize = 30;
let registerGap = 5;
let optimizedCodeX = 200;
let desiredOutputX = 560;
let programOutputX = 530;

let finished = false;

// simulation variables
let instructions;
let optimizedInstructions;
let registers;
let currentInstruction;
let optimizedCode;
let startingValue;
let output;
let invalidState;
// not very clean
let desiredOutput = [0,1,0,1,0,1,0,1,0,1,0,1,0,1];

function preload() {
  inputs[EXAMPLE] = loadStrings('input/example.txt');
  inputs[PART1] = loadStrings('input/part1.txt');
  inputs[PART2] = loadStrings('input/part2.txt');
}

function setup() {
  let canvas = createCanvas(600, 2*codeMargin);
  canvas.parent('sketch');

  frameRate(fps);

  loadPuzzle(EXAMPLE);
}

function draw() {
  background('#0f0f23');
  textSize(16);
  noStroke();

  // print code
  printCode(instructions, codeMargin);
  if (optimizedCode) {
    printCode(optimizedInstructions, optimizedCodeX);
  }

  // draw registers
  for (let registerId of Object.keys(registers)) {
    registers[registerId].draw();
  }

  // draw starting value
  textAlign(CENTER, CENTER);
  text('init: ' + startingValue, registerX + registerSize/2, 50);

  // print output
  printOutput();

  // move to next
  if (finished) {
    noLoop();
  } else if (auto) {
    applyInstruction();
  }
}

function printOutput() {
  let y = codeMargin + lineHeight/2;

  for (let i = 0; i < desiredOutput.length; i++) {
    fill('#cccccc');
    stroke('#cccccc');
    if (i<output.length) {
      if (output[i] !== desiredOutput[i]) {
        fill(200,10,55);
        stroke(200,10,55);
      } else {
        fill('#cccccc');
        stroke('#cccccc');
      }
      text(output[i], programOutputX, y);
    }
    text(desiredOutput[i], desiredOutputX, y);
    y += lineHeight;
  }
}

function printCode(instructionsList, x) {
  textAlign(LEFT, TOP);
  textFont('"Source Code Pro", monospace');
  
  for (let instruction of instructionsList) {
    if (instruction) {
      instruction.draw();
    }
  }

  // draw 'done' line
  if (currentInstruction >= instructions.length) {
    fill('#00cc00');
    textStyle(BOLD);
  } else {
    fill('#cccccc');
    textStyle(NORMAL);
  }
  textAlign(LEFT, BOTTOM);
  text('> done <', x, height - codeMargin);
  
}

function applyInstruction() {
  if (invalidState) {
    testNextStartingPoint();
  } else if (optimizedInstructions[currentInstruction]) {
    let next = optimizedInstructions[currentInstruction].apply();
    if (next) {
      currentInstruction = next;
    } else {
      do {
        currentInstruction++;
      } while (currentInstruction<instructions.length && !optimizedInstructions[currentInstruction])
    }
    checkEnd();
  } else {
    finished = true;
  }
}

function checkEnd() {
  if (invalidOutput()) {
    invalidState = true;
  } else if (output.length === desiredOutput.length) {
    console.log('Found correct output with starting value of ' + startingValue);
    // will highlight the 'done' element
    currentInstruction = instructions.length;
  }

  if (currentInstruction>instructions.length) {
    finished = true;
  }
}

function invalidOutput() {
  if (output.length === 0) {
    return false;
  }
  for (let i = 0; i < min(output.length, desiredOutput.length); i++) {
    if (output[i] !== desiredOutput[i]) {
      return true;
    }
  }
}

function keyReleased() {
  if (keyCode === ENTER && currentInstruction < instructions.length) {
    if (auto) {
      auto = false;
    } else {
      applyInstruction();
    }
  } else if (key === 'R') {
    loadPuzzle(currentPuzzle);
  } else if (key === 'A') {
    auto = !auto;
  } else if (key === 'P') {
    fps = min(60, fps +5);
    frameRate(fps);
  } else if (key === 'M') {
    fps = max(5, fps -5);
    frameRate(fps);
  }
}

function loadPuzzle(puzzle, initValue) {
  currentPuzzle = puzzle;

  let numInstructions = inputs[currentPuzzle].length;
  
  // reset variables
  instructions = [];
  registers = {};
  startingValue = initValue ? initValue : 0;
  optimizedCode = false;

  output = [];
  currentInstruction = 0;
  invalidState = false;

  // parse data
  instructions.push(new Instruction(0, 'cpy ' + startingValue + ' a'));
  for (let l = 0; l < numInstructions; l++) {
    let instruction = new Instruction(l+1, inputs[currentPuzzle][l]);
    instructions.push(instruction);
  }
  numInstructions++;

  // optimize instruction for display
  optimizeInstructions();
  
  // Set registers positions
  let y = registerMargin;
  let regIds = Object.keys(registers);
  regIds.sort();
  for (let id of regIds) {
    registers[id].setY(y);
    y += registerSize + registerGap;
  }

  // restart loop
  if (finished) {
    finished = false;
    loop();
  }

  // set canvas height
  let codeHeight = (1 + numInstructions) * lineHeight;
  resizeCanvas(width, 2 * codeMargin + codeHeight);
}

function testNextStartingPoint() {
  loadPuzzle(currentPuzzle, startingValue+1);

  console.log('Testing with new initial value of ' + startingValue);
  updateInstructionStartingValue();
}

function updateInstructionStartingValue() {
  instructions[0].params[0] = startingValue;
  instructions[0].content = 'cpy ' + startingValue + ' a';
  optimizedInstructions[0].params[0] = startingValue;
  optimizedInstructions[0].content = instructions[0].content;
}

function optimizeInstructions() {
  optimizedInstructions = [];

  let currentInc, currentDec;
  for (let i=0; i<instructions.length; i++) {
    let updatedInstruction = false;

    let inst = instructions[i];
    let index = i;

    if (inst.type === INST_JUMP && (inst.params[1] === -2 || inst.params[1] === -4)) {
      let loopVar = inst.params[0].id;
      let firstInst = optimizedInstructions[index-2];
      let secondInst = optimizedInstructions[index-1];

      let isAddition = true;
      if (inst.params[1] === -4) {
        let goBackInst = optimizedInstructions[index-4];
        if (goBackInst.type === INST_JUMP && goBackInst.params[1] === 2) {
          loopVar = goBackInst.params[0].id;
          let skippedInst = optimizedInstructions[index-3];
          if (skippedInst.type === INST_JUMP && skippedInst.params[0] === 1 &&
            skippedInst.params[1] === 4) {
          } else {
            isAddition = false;
          }
        } else {
          isAddition = false;
        }
      }

      if (isAddition) {
        if ((firstInst.type === INST_INC || firstInst.type === INST_DEC)
          && (secondInst.type === INST_INC || secondInst.type === INST_DEC)) {
          let elt;
        if (firstInst.params[0].id === loopVar) {
          elt = secondInst;
        } else if (secondInst.params[0].id === loopVar) {
          elt = firstInst;
        }

        if (elt) {
          let newInstruction;
          if (elt.type === INST_INC) {
            newInstruction = INST_ADD + ' ' + elt.params[0].id + ' ' + loopVar;
          } else {
            newInstruction = INST_SUB + ' ' + elt.params[0].id + ' ' + loopVar;
          }
          optimizedInstructions[index-2] = new Instruction(index-2, newInstruction);
          optimizedInstructions[index-2].x = optimizedCodeX;
          optimizedInstructions[index-2].changed = true;
          optimizedInstructions[index-2].checkValidity();
          optimizedInstructions[index-1] = new Instruction(index-1, 'cpy 0 ' + loopVar);
          optimizedInstructions[index-1].x = optimizedCodeX;
          optimizedInstructions[index-1].changed = true;
          optimizedInstructions[index-1].checkValidity();

          updatedInstruction = true;
          optimizedCode = true;
        }
      }
    }
  } else if (inst.type === INST_JUMP && inst.params[1] === -5) {
    let loopVar = inst.params[0].id;
    let prevInst = optimizedInstructions[index-1];
    let jumpTargetInst = optimizedInstructions[index - 4];
    let targetRegister = jumpTargetInst.params[0];
    let multipliedRegister = jumpTargetInst.params[1];

    if ((prevInst.type === INST_DEC || prevInst.type === INST_INC) &&
      (jumpTargetInst.type === INST_ADD || jumpTargetInst.type === INST_SUB)) {
      let multInstruction = INST_MULT + ' ' + multipliedRegister.id + ' ' + loopVar;
    let newInstruction = jumpTargetInst.type + ' ' + targetRegister.id + ' ' + multipliedRegister.id;

        // instruction loopVar1=loopVar1*loopVar2
        optimizedInstructions[index-4] = new Instruction(index-4, multInstruction);
        optimizedInstructions[index-4].x = optimizedCodeX;
        optimizedInstructions[index-4].changed = true;
        optimizedInstructions[index-4].checkValidity();

        // instruction target +/- = loopVar1
        optimizedInstructions[index-3] = new Instruction(index-3, newInstruction);
        optimizedInstructions[index-3].x = optimizedCodeX;
        optimizedInstructions[index-3].changed = true;
        optimizedInstructions[index-3].checkValidity();

        // instructions to reset the loop vars
        optimizedInstructions[index-2] = new Instruction(index-2, 'cpy 0 ' + multipliedRegister.id);
        optimizedInstructions[index-2].x = optimizedCodeX;
        optimizedInstructions[index-2].changed = true;
        optimizedInstructions[index-2].checkValidity();

        optimizedInstructions[index-1] = new Instruction(index-1, 'cpy 0 ' + loopVar);
        optimizedInstructions[index-1].x = optimizedCodeX;
        optimizedInstructions[index-1].changed = true;
        optimizedInstructions[index-1].checkValidity();

        updatedInstruction = true;
      }
    }

    if (!updatedInstruction) {
      optimizedInstructions[index] = new Instruction(index, inst.content);
      optimizedInstructions[index].valid = inst.valid;
      optimizedInstructions[index].x = optimizedCodeX;
    }
  }
}

