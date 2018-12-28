function Rule(input) {
    this.condition = input.substr(0,5);
    this.result = input.charAt(input.length-1);

    this.match = function(state, index) {
        let value;
        for (let i = 0; i < this.condition.length; i++) {
            value = state[index-2+i] || NOTHING;
            if (value !== this.condition[i]) {
                return false;
            }
        }
        return true;
    }
}