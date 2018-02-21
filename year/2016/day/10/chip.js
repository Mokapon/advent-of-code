function Chip (value) {
  this.x;
  this.y;
  this.value = value;
  
  this.setPosition = function (x, y) {
    this.x = x;
    this.y = y;
  }
  
  this.draw = function () {
    rect(this.x, this.y, botSize, botSize);
    textAlign(CENTER);
    text(this.value, this.x + botSize / 2, this.y + botSize * 3 / 4);
  }
}