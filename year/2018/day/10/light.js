function Light(x, y, vx, vy) {
    this.position = createVector(x, y);
    this.velocity = createVector(vx, vy);

    this.move = function() {
        this.position.x += this.velocity.x;
        this.position.y += this.velocity.y;
    }

    this.back = function() {
        this.position.x -= this.velocity.x;
        this.position.y -= this.velocity.y;
    }

    this.draw = function() {
        fill(AOC_ACCENT_COLOR);
        rect(this.position.x*SIZE, this.position.y*SIZE, SIZE, SIZE);
    }
}