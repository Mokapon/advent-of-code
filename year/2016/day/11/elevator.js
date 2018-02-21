function Elevator() {
	this.floor;
	
	this.x = floorGap;
	this.y;

	this.setFloor = function(floorNum) {
		this.floor = floorNum;
		this.y = floorNum * floorHeight + margin;
	}

	this.up = function(floorNum) {
		
	}

	this.draw = function() {
		fill(155,155,0);
		rect(this.x, this.y, elevatorWidth, floorHeight);
	}

	this.setFloor(0);
}