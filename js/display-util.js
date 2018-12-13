function ListPrinter(startingPosition, availableSize, elementSize, listLength, displayFunction, elementsOffset) {
    this.startingPosition = startingPosition;
    this.elementSize = elementSize;
    this.maxDisplayedElements = floor(availableSize / elementSize);
    this.displayedElements = min(listLength, this.maxDisplayedElements);
    this.baseStartIndex = listLength - this.maxDisplayedElements;
    this.elementsOffset = elementsOffset || floor(this.maxDisplayedElements * 2 / 3);
    this.displayFunction = displayFunction;

    this.setListLength = function(listLength) {
        this.displayedElements = min(listLength, this.maxDisplayedElements);
        this.baseStartIndex = listLength - this.maxDisplayedElements;
    }
    
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

/*
 * fills row by row first
 */
function ListAsGridPrinter(startingPosition, availableSize, elementSize, listLength, displayFunction, columnsOffset) {
    this.startingPosition = startingPosition;
    this.elementSize = elementSize;
    this.listLength = listLength;
    this.maxColumns = floor(availableSize.x / elementSize.x);
    this.maxRows = floor(availableSize.y / elementSize.y);
    this.maxDisplayedElements = this.maxColumns * this.maxRows;
    this.displayedElements = min(listLength, this.maxDisplayedElements);
    this.displayedRows = min(listLength, this.maxRows);
    this.baseStartColumn = ceil(listLength/this.maxRows) - this.maxColumns;
    this.displayedColumns =  min(ceil(listLength/this.maxRows), this.maxColumns);
    this.displayedElements = min(listLength, this.maxDisplayedElements);

    this.columnsOffset = columnsOffset || floor(this.maxColumns * 2 / 3);
    this.displayFunction = displayFunction;

    this.printList = function(focusIndex, displayFunction) {
        let position = createVector(this.startingPosition.x, this.startingPosition.y);
        let startColumn = max(0, min(ceil(focusIndex/this.maxRows) - this.maxColumns + this.columnsOffset, this.baseStartColumn));
        let index = startColumn * this.maxRows;
        if (!displayFunction) {
            displayFunction = this.displayFunction;
        }
        for (let column = 0; column < this.displayedColumns; column++) {
            position.y = this.startingPosition.y;
            for (let row = 0; row < this.displayedRows; row++) {
                displayFunction(index, position.x, position.y);
                position.y += this.elementSize.y;
                if (++index >= this.listLength) {
                    return;
                }
            }
            position.x += this.elementSize.x;
        }
    }

}

function TextBlockPrinter(startingX, startingY, blockWidth, lineHeight, textToPrint) {
    this.startingX = startingX;
    this.startingY = startingY;
    this.endingY;
    this.blockWidth = blockWidth;
    this.lineHeight = lineHeight;
    this.textLength;
    this.lines;
    this.lineLength;

    this.setText = function (textToPrint) {
        if (!textToPrint) {
            return;
        }
        this.textLength = textToPrint.length;
        this.lines = [];

        let lineLength = textToPrint.length;
        let numLines = 1;
        let inputWidth = textWidth(textToPrint);
        if (inputWidth > blockWidth) {
            numLines = ceil(inputWidth / blockWidth);
            lineLength = ceil(textToPrint.length / numLines);
        }

        for (let i = 0; i < numLines; i++) {
            this.lines.push(textToPrint.substring(i*lineLength, (i+1)*lineLength));
        }
        this.lineLength = lineLength;

    }
    this.printBlock = function() {
        push();
        textAlign(CENTER);
        let y = this.startingY;
        for (let line of this.lines) {
            text(line, this.startingX + this.blockWidth/2, y);
            y += this.lineHeight;
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

    this.setText(textToPrint);
}
