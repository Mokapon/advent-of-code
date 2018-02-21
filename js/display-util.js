function displayList(focusIndex, totalElements, maxDisplayedElements, startingPosition, positionDelta, offset, display) {
    let position = startingPosition;

    let startIndex = max(0, min(focusIndex - maxDisplayedElements + offset, totalElements-maxDisplayedElements));
    
    let displayedElements = min(totalElements, maxDisplayedElements);

    for (let i = 0; i < displayedElements; i++) {
        display(startIndex + i, position);
        position += positionDelta;
    }
}