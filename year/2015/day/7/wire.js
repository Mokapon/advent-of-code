function Wire(id, x, y) {
    this.id = id;
    this.startPosition = createVector(x, y);
    this.value = -1;

    this.availableX = x + DELTA_X;

    this.draw = function() {
        line(this.startPosition.x, this.startPosition.y, wireEndX, this.startPosition.y);
        text(this.id, labelX, this.startPosition.y);
        if (this.value >= 0) {
            text(this.value, valueX, this.startPosition.y);
        }
    }

}