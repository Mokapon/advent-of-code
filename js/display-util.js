function ListPrinter(startingPosition, totalSize, elementSize, listLength, displayFunction, elementsOffset) {
    this.startingPosition = startingPosition;
    this.elementSize = elementSize;
    this.maxDisplayedElements = floor(totalSize / elementSize);
    this.displayedElements = min(listLength, this.maxDisplayedElements);
    this.baseStartIndex = listLength - this.maxDisplayedElements;
    this.elementsOffset = elementsOffset || floor(this.maxDisplayedElements * 2 / 3);
    this.displayFunction = displayFunction;

    this.printList = function(focusIndex) {
        let position = this.startingPosition;
        let startIndex = max(0, min(focusIndex - this.maxDisplayedElements + this.elementsOffset, this.baseStartIndex));

        for (let i = 0; i < this.displayedElements; i++) {
            this.displayFunction(startIndex + i, position);
            position += this.elementSize;
        }
    }
}