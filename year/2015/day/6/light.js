function Light(index) {
    this.index = index;
    this.isOn = false;
    this.brightness = 0;
    this.color = color(red(lightOffColor), 0, blue(lightOffColor));

    this.setStatus = function(newStatus) {
        let changed = newStatus !== this.isOn;
        this.isOn = newStatus;
        this.color = this.isOn ? lightOnColor : lightOffColor;
        return changed;
    }

    this.updateBrightness = function(delta) {
        let newBrightness = max(0, this.brightness + delta);
        let changed = newBrightness !== this.brightness;
        this.brightness = newBrightness;
        this.color.setGreen(newBrightness*5);
        return changed;
    }

    this.draw = function() {
        pixels[index*4] = red(this.color);
        pixels[index*4 + 1] = green(this.color);
        pixels[index*4 + 2] = blue(this.color);
        pixels[index*4 + 3] = alpha(this.color);
    }
}