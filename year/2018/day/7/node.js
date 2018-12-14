function Node(id, durationOffset) {
    this.id = id;
    this.duration = durationOffset + (isPart1() ? 0 : id.charCodeAt(0));
    this.timeLeft = this.duration;
    this.parents = [];
    this.children = {};

    this.isAvailable = function() {
        if (this.timeLeft < this.duration) {
            return false;
        }
        for (let node of this.parents) {
            if (node.timeLeft > 0) {
                return false;
            }
        }
        return true;
    }

    this.addChild = function(node) {
        node.parents.push(this);
        this.children[node.id] = node;
    }

    this.getChildren = function() {
        return Object.values(this.children).filter(function(n) { return n.isAvailable(); });
    }
}

function compareNode(n1, n2) {
    return n1.id.charAt(0) < n2.id.charAt(0);
}