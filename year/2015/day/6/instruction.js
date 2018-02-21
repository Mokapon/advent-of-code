const INSTRUCTION_TURN_ON = 'turn on';
const INSTRUCTION_TURN_OFF = 'turn off';
const INSTRUCTION_TOGGLE = 'toggle';
const REGEXP_INSTRUCTION = new RegExp('(' + INSTRUCTION_TURN_ON + '|' + INSTRUCTION_TURN_OFF + '|' + INSTRUCTION_TOGGLE +')' +
    ' ([0-9]+),([0-9]+) through ([0-9]+),([0-9]+)');

const BRIGHTNESS_DELTA = {}
BRIGHTNESS_DELTA[INSTRUCTION_TURN_ON] = 1,
BRIGHTNESS_DELTA[INSTRUCTION_TURN_OFF] = -1,
BRIGHTNESS_DELTA[INSTRUCTION_TOGGLE] = 2

function createInstruction (string) {
    let match = string.match(REGEXP_INSTRUCTION);
    let start = createVector(int(match[2]), int(match[3]));
    let end = createVector(int(match[4]), int(match[5]));
    return new Instruction(match[1], start, end);
}

function Instruction(type, startPosition, endPosition) {
    this.type = type;
    this.startPosition = startPosition;
    this.endPosition = endPosition;
    this.brightnessDelta = BRIGHTNESS_DELTA[type];
    
    this.apply = function(){
        //console.log(this.type + ' from ' + this.startPosition + ' to ' + this.endPosition);

        let newStatus = this.type === INSTRUCTION_TURN_ON;
        loadPixels();
        for (let col = startPosition.x; col <= endPosition.x; col++) {
            for (let row = startPosition.y; row <= endPosition.y; row++) {
                let changed = this.updateLight(grid[col][row]);
                if (changed) {
                    grid[col][row].draw();
                }
                
            }
        }
        updatePixels();
    }

    this.updateLight = function(light) {
        if (currentPuzzle !== PART2) {
            let newStatus;
            switch(this.type) {
                case INSTRUCTION_TURN_ON:
                    newStatus = true;
                    break;
                case INSTRUCTION_TURN_OFF:
                    newStatus = false;
                    break;
                case INSTRUCTION_TOGGLE:
                    newStatus = !light.isOn;
                    break;
            }
            return light.setStatus(newStatus);
        } else {

            return light.updateBrightness(this.brightnessDelta);
        }
    }
}