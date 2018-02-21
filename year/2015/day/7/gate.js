const GATE_VALUE = 'VAL';
const GATE_NOT = 'NOT';
const GATE_AND = 'AND';
const GATE_OR = 'OR';
const GATE_LSHIFT = 'LSHIFT';
const GATE_RSHIFT = 'RSHIFT';

const MAX_VALUE = 65535;
const GATE_DISPLAY = [];
GATE_DISPLAY[GATE_VALUE] = '';
GATE_DISPLAY[GATE_NOT] = '!';
GATE_DISPLAY[GATE_OR] = '|';
GATE_DISPLAY[GATE_AND] = '&';
GATE_DISPLAY[GATE_LSHIFT] = '<';
GATE_DISPLAY[GATE_RSHIFT] = '>';


function Gate(type, x, y, inputs) {
    this.type = type;
    this.startPosition = createVector(x, y);
    
    this.inputs = inputs;
    this.output;

    this.apply = function() {
        switch(this.type) {
            case GATE_VALUE:
                this.output.value = this.getInputValue(0);
                break;
            case GATE_NOT:
                this.output.value = not(this.getInputValue(0));
                break;
            case GATE_AND:
                this.output.value = and(this.getInputValue(0), this.getInputValue(1));
                break;
            case GATE_OR:
                this.output.value = or(this.getInputValue(0), this.getInputValue(1));
                break;
            case GATE_LSHIFT:
                this.output.value = lshift(this.getInputValue(0), this.getInputValue(1));
                break;
            case GATE_RSHIFT:
                this.output.value = rshift(this.getInputValue(0), this.getInputValue(1));
                break;
            default:
                this.output.value = 12;
                break;
        }
    }

    this.getInputValue = function(index) {
        if (this.inputs[index].id) {
            return this.inputs[index].value;
        }
        return this.inputs[index];
    }

    this.draw = function() {
        rect(this.startPosition.x, this.startPosition.y - GATE_SIZE/2, GATE_SIZE, GATE_SIZE);
        push();
        textAlign(CENTER);
        textSize(GATE_SIZE);
        text(GATE_DISPLAY[this.type], this.startPosition.x + GATE_SIZE/2, this.startPosition.y+1);
        pop();

        let inputX = this.startPosition.x - DELTA_X;
        let inputY = this.startPosition.y - GATE_SIZE/4 * (this.inputs.length -1);
        for (let input of this.inputs) {
            line(inputX, inputY, this.startPosition.x, inputY);
            if (input.id) {
                line(inputX, input.startPosition.y, inputX, inputY);
                // Next line should be offset
                inputX -= DELTA_X;
            } else {
                push();
                textAlign(RIGHT);
                text(input, inputX - DELTA_X, inputY);
                pop();
            }
            inputY += GATE_SIZE/2;
        }
    }
}

function not(value) {
    return MAX_VALUE - value;
}

function or(v1, v2) {
    return v1 | v2;
}

function and(v2, v1) {
    return v1 & v2;
}

function lshift(value, number) {
    return value << number;;
}

function rshift(value, number) {
    return value >> number;;
}

