function Box(description) {
    this.description = description;
    this.sides = parseMeasures(description);
    this.requiredArea;
    this.requiredRibbon;

    this.computeArea = function() {
        this.requiredArea = 3*this.sides[0]*this.sides[1] + 2*this.sides[1]*this.sides[2] + 2*this.sides[0]*this.sides[2];
    }
    this.computeRibbon = function() {
        this.requiredRibbon = 2*this.sides[0] + 2*this.sides[1]+ this.sides[0]*this.sides[1]*this.sides[2];
    }
}

function parseMeasures(input) {
    let sides = [];
    for (let side of input.split('x')) {
        sides.push(int(side));
    }
    sides.sort(function (n1, n2) {
        return n1 - n2;
    });
    return sides;
}