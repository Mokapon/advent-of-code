function Register(id) {
  this.id = id;
  this.value;
  this.y;

  this.setY = function(y) {
    this.y = y;
  }

  this.draw = function() {
    noFill();
    stroke('#cccccc');
    textAlign(CENTER, CENTER);
    textStyle(NORMAL);
    
    rect(registerX, this.y, registerSize, registerSize);
    text(this.id, registerX + registerSize/2, this.y + registerSize/2);
    if (this.value || this.value===0) {
      text(this.value, valueX + registerSize/2, this.y + registerSize/2);
    }
  }
  
}