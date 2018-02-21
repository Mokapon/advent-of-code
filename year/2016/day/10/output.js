function Output(id) {
  this.x;
  this.y;
  this.id = id;
  this.chips = [];
  
  this.put = function(chip) {
    this.chips.push(chip);
    this.updateChipsPosition();
  }
  
  this.setPosition = function (x, y) {
    this.x = x;
    this.y = y;
    this.updateChipsPosition();
  }
  
  this.draw = function() {
    ellipse(this.x, this.y, botSize);
    textAlign(CENTER);
    text(this.id, this.x, this.y + botSize / 4);
    // Draw chips
    for (var i = 0; i < this.chips.length; i++) {
      this.chips[i].draw();
    }
  }
  
  this.updateChipsPosition = function() {
    for (var i = 0; i < this.chips.length; i++) {
      var x = this.x - botSize / 2;
      var y = this.y - botSize / 2 - (botSize + botGap) * (i+1);
      this.chips[i].setPosition(x, y);
    }
  }
  
  
}
