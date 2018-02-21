

function Player(number) {
  this.number = number;
  this.numPresents = 1;
  this.angle = 2* PI * (number-1) / numPlayers + PI*3/2;
  this.x = centerDistance * cos(this.angle);
  this.y = centerDistance * sin(this.angle);

  this.draw = function() {
    if (this.numPresents > 0) {
      fill(0,155,55);
    } else {
      noFill();
    }
    let size = map(this.numPresents, 0, numPlayers, minPlayerSize, maxPlayerSize,);
    ellipse(this.x, this.y, size);
    fill(0);
    text(this.number, this.x, this.y);
  }

  this.steal = function(player) {
    this.numPresents += player.numPresents;
    player.numPresents = 0;
  }

}