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

let registerX = 320;
let valueX = 380;
let registerSize = 30;
let registerGap = 5;
let optimizedCodeX = 200;

// simulation variables
let instructions;
let optimizedInstructions;
let registers;
let currentInstruction;
let optimizedCode;

function preload() {
  inputs[EXAMPLE] = loadStrings('input/example.txt');
  inputs[PART1] = loadStrings('input/part1.txt');
  inputs[PART2] = loadStrings('input/part2.txt');
}

function setup() {
  let canvas = createCanvas(450, 2*codeMargin);
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

  // move to next
  if (auto) {
    applyInstruction();
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
  if (optimizedInstructions[currentInstruction]) {
    let next = optimizedInstructions[currentInstruction].apply();
    if (next) {
      currentInstruction = next;
    } else {
      do {
        currentInstruction++;
      } while (currentInstruction<instructions.length && !optimizedInstructions[currentInstruction])
    }
    if (currentInstruction>instructions.length) {
      noLoop();
    }
  } else {
    noLoop();
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
  } else if (keyCode === 'M') {
    fps = max(5, fps -5);
    frameRate(fps);
  }
}

function loadPuzzle(puzzle) {
  currentPuzzle = puzzle;

  let numInstructions = inputs[currentPuzzle].length;
  
  // reset variables
  instructions = [];
  registers = {};
  currentInstruction = 0;
  optimizedCode = false;

  // parse data
  for (let l = 0; l < numInstructions; l++) {
    let instruction = new Instruction(l, inputs[currentPuzzle][l]);
    instructions.push(instruction);
  }

  // optimize instruction for display
  optimizeInstructions()
  
  // Set registers positions
  let y = codeMargin;
  let regIds = Object.keys(registers);
  regIds.sort();
  for (let id of regIds) {
    registers[id].setY(y);
    y += registerSize + registerGap;
  }

  // restart loop
  loop();

  // set canvas height
  let codeHeight = (1 + numInstructions) * lineHeight;
  resizeCanvas(width, 2 * codeMargin + codeHeight);
}

function optimizeInstructions() {
  optimizedInstructions = [];

  let currentInc, currentDec;
  for (let i=0; i<instructions.length; i++) {
    let updatedInstruction = false;

    let inst = instructions[i];
    let index = i;

    if (inst.type === INST_JUMP && inst.params[1] === -2) {
      let loopVar = inst.params[0].id;
      let firstInst = optimizedInstructions[index-2];
      let secondInst = optimizedInstructions[index-1];

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

