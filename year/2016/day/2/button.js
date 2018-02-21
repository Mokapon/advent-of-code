function Button (value, x, y) {
  this.value = (value < 10) ? value : String.fromCharCode(65 + value - 10);
  this.x = x;
  this.y = y;
  this.xCenter = x + cellWidth/2;
  this.yCenter = y + cellHeight/2;
  
  this.highlighted = false;
  
  this.draw = function() {
    if (this.highlighted) {
      fill(210, 0 , 150);
    } else {
      fill(200);
    }
    rect (this.x, this.y, cellWidth, cellHeight);
    
    fill(0);
    
    text(this.value, this.xCenter, this.yCenter);
  }
  
  this.highlight = function(value) {
    this.highlighted = value;
  }

}