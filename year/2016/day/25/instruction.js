let INST_COPY = 'cpy';
let INST_INC = 'inc';
let INST_DEC = 'dec';
let INST_JUMP = 'jnz';
let INST_TOGGLE = 'tgl';
let INST_OUT = 'out';

// added for optimization
let INST_ADD = 'add';
let INST_SUB = 'sub';
let INST_MULT = 'mul';
let INST_DIV = 'div';
let INST_MOD = 'mod';

function getType(content) {
  return content.split(' ')[0];
}

function getParams(content) {
  let elements = content.split(' ');
  let params = [];

  for(let i = 1; i < elements.length; i++) {
    let elt = elements[i];

    if (elt.match('[a-z]')) {
      // It's a register
      if (registers[elt]) {
        params.push(registers[elt]);
      } else {
        let register = new Register(elt);
        registers[elt] = register;
        params.push(register);
      }
    } else {
      params.push(int(elements[i]));
    }
  }

  return params;
}

function Instruction(index, content) {
  this.index = index;
  this.content = content;

  this.type = getType(content);
  this.params = getParams(content);
  
  this.x = codeMargin;
  this.y = codeMargin + index*lineHeight;

  this.valid = true;

  this.parseParams = function() {
    return true;
  }

  this.setType = function(newType) {
    this.content = this.content.replace(this.type, newType);
    this.type = newType;

    this.checkValidity();
  }

  this.draw = function() {
    if (this.index===currentInstruction) {
      if (!this.valid) {
        fill('#555555');
      } else {
        fill('#00cc00');
      }
        textStyle(BOLD);
      text('> ' + this.content, this.x, this.y);
    } else {
      if (!this.valid) {
        fill('#555555');
        textStyle(NORMAL);
      } else if (this.changed === true) {
        fill('#eeb60a');
        textStyle(NORMAL);
      } else {
        fill('#cccccc');
        textStyle(NORMAL);
      }
      text(this.content, this.x, this.y);
    }
  }

  this.apply = function() {
    if(!this.valid) {
      return;
    }
    switch(this.type) {
      case INST_COPY:
        let copiedValue = this.getValue(0);
        this.params[1].value = copiedValue;
        break;
      case INST_ADD:
        let addedValue = this.getValue(1);
        this.params[0].value += abs(addedValue);
        break;
      case INST_SUB:
        let removedValue = this.getValue(1);
        this.params[0].value -= abs(removedValue);
        break;
      case INST_MULT:
        let multipliedValue = this.getValue(1);
        this.params[0].value *= abs(multipliedValue);
        break;
      case INST_DIV:
        let dividende = this.getValue(1);
        this.params[0].value = floor(this.params[0].value / abs(dividende));
        break;
      case INST_MOD:
        let mod = this.getValue(1);
        this.params[0].value %= abs(mod);
        break;
      case INST_DEC:
        this.params[0].value--;
        break;
      case INST_INC:
        this.params[0].value++;
        break;
      case INST_JUMP:
        let testedValue = this.getValue(0);
        if (testedValue && testedValue !== 0) {
          let move = this.getValue(1);
          return currentInstruction + move;
        }
        break;
      case INST_TOGGLE:
        let targetInstruction = instructions[currentInstruction + this.getValue(0)];
        if (targetInstruction) {
          if (targetInstruction.type === INST_INC){
            targetInstruction.setType(INST_DEC);
          } else if (targetInstruction.params.length === 1) {
            targetInstruction.setType(INST_INC);
          } else if (targetInstruction.type === INST_JUMP){
            targetInstruction.setType(INST_COPY);
          } else if (targetInstruction.params.length === 2) {
            targetInstruction.setType(INST_JUMP);
          }
          optimizeInstructions();
        }
        break;
      case INST_OUT:
        output.push(this.getValue(0));
        break;
    }
  }

  this.getValue = function(index) {
    return this.params[index].id ? this.params[index].value : this.params[index];
  }

  this.checkValidity = function() {
    switch(this.type) {
      case INST_COPY:
        if (!this.params[1].id) {
          this.valid = false;
        }
        break;
      case INST_ADD:
      case INST_SUB:
      case INST_DEC:
      case INST_INC:
      case INST_MULT:
        if (!this.params[0].id) {
          this.valid = false;
        }
        break;
      default:
        this.valid = true;
        break;
    }
  }
}