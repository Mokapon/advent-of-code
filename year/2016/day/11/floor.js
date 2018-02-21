function Floor(floorNumber) {
	this.x = margin;
	this.y = margin + floorNumber * floorHeight;
	this.elements = [];

	this.draw = function() {
		fill(0, 155, 155);
		rect(this.x, this.y, floorWidth, floorHeight);
	    // Draw elements
	    for (var i = 0; i < this.elements.length; i++) {
	    	if (this.elements[i]) {
	    		elements[i].draw();
		  	}
	    }
	}

	this.addElement = function(index, element) {
		this.elements[index]=element;
	}

	this.removeElement = function(index) {
		delete(this.elements[index]);
	}

	this.hasElement = function(index) {
		return this.elements[index];
	}

	this.getElements = function() {
		let elts = [];
		for (var i = 0; i < this.elements.length; i++) {
	    	if (this.elements[i]) {
	    		elts.push(i);
		  	}
	    }
	    return elts;
	}

	this.isStable = function() {
		for (var i = 0; i < this.elements.length; i+=2) {
	    	if ((this.elements[i] && !this.elements[i + 1])
	    		|| (this.elements[i+1] && !this.elements[i])) {
	    		return false;
		  	}
	    }
	    return true;
	}
}