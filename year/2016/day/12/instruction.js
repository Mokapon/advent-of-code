let INST_COPY = 'cpy';
let INST_INC = 'inc';
let INST_DEC = 'dec';
let INST_JUMP = 'jnz';
let INST_ADD = 'add';
let INST_SUB = 'sub';

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

  this.parseParams = function() {
    return true;
  }

  this.draw = function() {

    if (this.index===currentInstruction) {
      fill('#00cc00');
      textStyle(BOLD);
      text('> ' + this.content, this.x, this.y);
    } else {
      if (this.changed === true) {
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
    }
  }

  this.getValue = function(index) {
    return this.params[index].id ? this.params[index].value : this.params[index];
  }
}