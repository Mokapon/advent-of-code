function Rectangle (x, y, w, h, id) {
    this.x = x;
    this.y = y;
    this.w = w;
    this.h = h;
    this.id = id;

    this.area = function() {
        return this.w * this.h;
    }

    this.draw = function() {
        loadPixels();
        let index;
        for (let col=x*scale; col < (this.x+this.w)*scale; col++) {
            for (let row=y*scale; row < (this.y+this.h)*scale; row++) {
                index = (col+row*SIZE)*4;
                if (pixels[index+3] === 255) {
                    pixels[index]   = red(AOC_ACCENT_COLOR);
                    pixels[index+1] = COLOR_DELTA;
                    pixels[index+2] = blue(AOC_ACCENT_COLOR);
                    pixels[index+3] = 254;
                } else {
                    pixels[index+1] +=COLOR_DELTA;
                }
            }
        }
        updatePixels();
    }

    this.getOverlap = function(rectangle) {
        let x,y,w,h;
        if (this.x <= rectangle.x && rectangle.x - this.x <= this.w) {
            x = rectangle.x;
            w = this.x + this.w - x;
        } else if (this.x>=rectangle.x && this.x - rectangle.x <= rectangle.w) {
            x = this.x;
            w = rectangle.x + rectangle.w - x;
        }

        if (this.y <= rectangle.y && rectangle.y - this.y <= this.h) {
            y = rectangle.y;
            h = this.y + this.h - y;
        } else if (this.y >= rectangle.y && this.y - rectangle.y <= rectangle.h) {
            y = this.y;
            h = rectangle.y + rectangle.h - y;
        }

        if (x && y && w && h) {
            return new Rectangle(x,y,w,h);
        }
    }
}