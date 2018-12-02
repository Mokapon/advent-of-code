function ListPrinter(startingPosition, totalSize, elementSize, listLength, displayFunction, elementsOffset) {
    this.startingPosition = startingPosition;
    this.elementSize = elementSize;
    this.maxDisplayedElements = floor(totalSize / elementSize);
    this.displayedElements = min(listLength, this.maxDisplayedElements);
    this.baseStartIndex = listLength - this.maxDisplayedElements;
    this.elementsOffset = elementsOffset || floor(this.maxDisplayedElements * 2 / 3);
    this.displayFunction = displayFunction;

    this.printList = function(focusIndex, displayFunction) {
        let position = this.startingPosition;
        let startIndex = max(0, min(focusIndex - this.maxDisplayedElements + this.elementsOffset, this.baseStartIndex));
        if (!displayFunction) {
            displayFunction = this.displayFunction;
        }
        for (let i = 0; i < this.displayedElements; i++) {
            displayFunction(startIndex + i, position);
            position += this.elementSize;
        }
    }
}

function TextBlockPrinter(startingX, startingY, blockWidth, lineHeight, input) {
    this.startingX = startingX;
    this.startingY = startingY;
    this.endingY;
    this.blockWidth = blockWidth;
    this.lineHeight = lineHeight;
    this.textLength = input.length;
    this.lines = initLines(input, blockWidth);
    this.lineLength = this.lines[0].length;

    this.printBlock = function() {
        push();
        textAlign(CENTER);
        let y = this.startingY;
        for (let line of this.lines) {
            text(line, startingX + blockWidth/2, y);
            y +=  lineHeight;
        }
        this.endingY = y;
        pop();
    }

    this.changeCharStyle = function(index, color, style) {
        if (index >= this.textLength) {
            return;
        }

        let lineIndex = floor(index/this.lineLength);
        let line = this.lines[lineIndex];
        let offset = index % this.lineLength;
        let char = line.charAt(offset);
        let x = this.startingX + this.blockWidth/2 - textWidth(line)/2 + textWidth(line.substring(0, offset));
        let y = this.startingY + lineIndex*this.lineHeight;

        push();
        textAlign(LEFT);
        if (style !== undefined) {
            textStyle(style)
        }
        if (color) {
            fill(color);
        }
        text(char, x, y);
        
        pop();

    } 
}

function initLines(text, blockWidth) {
    let lines = [];

    let lineLength = text.length;
    let numLines = 1;
    let inputWidth = textWidth(text);
    if (inputWidth > blockWidth) {
        numLines = ceil(inputWidth / blockWidth);
        lineLength = ceil(input.length / numLines);
    }

    for (let i = 0; i < numLines; i++) {
        lines.push(input.substring(i*lineLength, (i+1)*lineLength));
    }
    return lines;
}