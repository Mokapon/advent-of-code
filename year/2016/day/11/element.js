function Element(material, type) {
	this.material = material;
	this.type = type;
	this.name = material + type;
	this.x;
	this.y;
	this.floor;
	this.selected;

	this.setColumn = function(col) {
		this.x = margin + elevatorWidth + eltGap + col * (eltSize + eltGap);
	}

	this.setFloor = function(floorNum) {
		this.floor = floorNum;
		this.y = margin + floorHeight*floorNum + eltGap;
	}

	this.draw = function() {
		if (this.selected) {
			fill(155,0,155);
		} else {
			fill(255);
		}
		rect(this.x, this.y, eltSize, eltSize);
		textAlign(CENTER);
		fill(0);
    	text(this.name, this.x + eltSize / 2, this.y + eltSize * 3 / 4);

	}
}
