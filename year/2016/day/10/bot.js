function Bot(id) {
  this.x;
  this.y;
  this.dir = 't';

  this.defaultPos;

  this.currentAction;
  this.step;
  this.wasFull;
  this.isActing;

  this.id = id;
  this.chips = [];
  this.inputTargets = [];
  this.lowTarget;
  this.highTarget;

  this.full = function() {
    return this.chips.length === chipsNb;
  }

  this.put = function(chip) {
    this.chips.push(chip);
    this.chips.sort(function(c1, c2) {
      return c1.value - c2.value;
    });
    this.updateChipsPosition();
  }

  this.remove = function(chip) {
    this.chips.splice(this.chips.indexOf(chip), 1);
    this.updateChipsPosition();
  }

  this.addInputTarget = function(target) {
    this.inputTargets.push(target);
  }

  this.setLowTarget = function(target) {
    this.lowTarget = target;
  }

  this.setHighTarget = function(target) {
    this.highTarget = target;
  }

  this.lowest = function() {
    return this.chips[0];
  }

  this.highest = function() {
    return this.chips[this.chips.length - 1];
  }

  this.act = function() {
    if (this.isActing) {
      this.currentAction(this.step);
      this.step++;
      if (this.step > 3) {
        if (this.wasFull) {
          this.currentAction = this.giveLowest;
          this.step = 1;
          this.wasFull = false;
        } else {
          this.step = 0;
          this.isActing = false;
        }
      }
    }
  }

  this.findNextAction = function() {
    if (this.inputTargets[0]) {
      this.currentAction = this.retrieveInput;
      this.step = 1;
      this.isActing = true;
    } else if (this.full()) {
      this.currentAction = this.giveHighest;
      this.step = 1;
      this.wasFull = true;
      this.isActing = true;
    }
    return this.isActing;
  }

  /* ======  Chips manipulation  ====== */
  this.retrieveInput = function(step) {
    if (step === 1) {
      this.moveTo(this.inputTargets[0]);
    } else if (step === 2) {
      var chip = inputs.splice(inputs.indexOf(this.inputTargets[0]), 1)[0];
      this.inputTargets.splice(0, 1);
      this.put(chip);
      if (this.full() || (this.inputTargets && this.inputTargets.length > 0)) {
        this.step++; // we will skip step 3
      }
    } else if (step === 3) {
      this.goBack();
    }
  }

  this.giveLowest = function(step) {
    if (step === 1) {
      this.moveTo(this.lowTarget);
    } else if (step === 2) {
      var chip = this.lowest();
      this.remove(chip);
      this.lowTarget.put(chip);
      if (this.wasFull) {
        this.step++; // we will skip step 3
      }
    } else if (step === 3) {
      this.goBack();
    }
  }

  this.giveHighest = function(step) {
    if (step === 1) {
      this.moveTo(this.highTarget);
    } else if (step === 2) {
      var chip = this.highest();
      this.remove(chip);
      this.highTarget.put(chip);
      if (this.wasFull) {
        this.step++; // we will skip step 3
      }
    } else if (step === 3) {
      this.goBack();
    }
  }

  /* ====== Position and drawing ====== */
  this.setDefaultPosition = function(x, y) {
    this.defaultPos = {
      x: x,
      y: y
    };
    this.setPosition(x, y);
  }

  this.goBack = function() {
    this.dir = 't';
    this.setPosition(this.defaultPos.x, this.defaultPos.y);
  }

  this.moveTo = function(target) {
    if (target.value) {
      // input
      this.dir = 'l';
      this.setPosition(target.x + botSize * 3 / 2 + botGap, target.y + botSize / 2);
    } else if (target.dir) {
      // robot
      this.dir = 'b';
      this.setPosition(target.x, target.y - botSize - botGap);
    } else {
      // output
      this.dir = 't';
      this.setPosition(target.x, target.y + botSize + botGap);
    }
  }

  this.setPosition = function(x, y) {
    this.x = x;
    this.y = y;
    this.updateChipsPosition();
  }

  this.updateChipsPosition = function() {
    for (var i = 0; i < this.chips.length; i++) {
      var x = this.x - botSize / 2;
      var y = this.y + botSize / 2 + botGap + (botSize + botGap) * i;

      if (this.dir === 'b') {
        y = this.y - botSize * 3 / 2 - botGap - (botSize + botGap) * i;
      } else if (this.dir === 'l') {
        x = this.x + botSize / 2 + botGap + (botSize + botGap) * i;
        y = this.y - botSize / 2;
      }

      this.chips[i].setPosition(x, y);
    }
  }

  this.draw = function() {
    var half = botSize / 2;
    var textX = this.x;
    var textY = this.y;
    if (this.dir === 'b') {
      triangle(this.x, this.y + half, this.x + half, this.y - half, this.x - half, this.y - half);
    } else if (this.dir === 't') {
      triangle(this.x, this.y - half, this.x + half, this.y + half, this.x - half, this.y + half);
      textY += half * 0.9;
    } else if (this.dir === 'l') {
      triangle(this.x - half, this.y, this.x + half, this.y + half, this.x + half, this.y - half);
      textX += half * 0.4;
      textY += half * 0.4;
    }
    textAlign(CENTER);
    text(this.id, textX, textY);
    // Draw chips
    for (var i = 0; i < this.chips.length; i++) {
      this.chips[i].draw();
    }
  }

}