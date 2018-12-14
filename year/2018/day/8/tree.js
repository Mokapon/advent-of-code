const LINE_HEIGHT = 15;
const MIN_NODE_WIDTH = 40;
const NODE_X_OFFSET = 10;
const MARGIN = 10;

let maxDepth;
let blockOffsetY;

function createTree(data) {
    maxDepth = 0;

    let nodes = [];
    createNodes(data, nodes, 'A'.charCodeAt(0), 1, MARGIN, 1, 0);
    
    blockOffsetY = (maxDepth+1) * LINE_HEIGHT;

    return nodes[0];
}

function createNodes(data, nodes, id, depth, x, numNodes, startIndex) {
    let index = startIndex;
    for (let i = 0; i < numNodes; i++) {
        let w = 0;
        let node = new Node(id, depth, x);
        nodes.push(node);
        let numChilds = data[index];
        let numMeta = data[index+1];
        index = createNodes(data, node.children, ++id, depth+1, x+NODE_X_OFFSET, numChilds, index+2);
        for (let child of node.children) {
            w += child.width + NODE_X_OFFSET;
        }
        node.metadata = data.slice(index, index+numMeta);
        index += numMeta;
        node.width = max(w, MIN_NODE_WIDTH);
        x += node.width + NODE_X_OFFSET;
        maxDepth = max(maxDepth, depth);
    }
    return index;
}

function Node(id, depth, x) {
    this.id = String.fromCharCode(id);
    this.depth = depth;
    this.children = [];
    this.x = x;
    this.y = depth * LINE_HEIGHT;
    this.width;
    this.value;
    
    this.draw = function() {
        if (this.x > width) {
            this.y += blockOffsetY * int(this.x/(width-MARGIN*2));
            this.x = MARGIN + this.x % (width-MARGIN*2);
        }
        let t = this.id + (this.hasValue() ? ' (' + this.value + ') ' : ' ');
        text(t, this.x, this.y);
        for (let child of this.children) {
            child.draw();
        }
        
        let offset = textWidth(t);
        let x1 = this.x + offset;
        let x2;
        let y = this.y;
        let w = this.width - offset;
        do {
            x2 = min(width - MARGIN, x1 + w);
            line (x1, y, x2, y);
            w -= (x2 - x1);
            y += blockOffsetY;
            x1 = MARGIN;
        } while(w > 0)
    }

    this.hasValue = function() {
        return this.value || this.value === 0;
    }
    this.getValue = function() {
        if (this.hasValue()) {
            return this.value;
        }
        let v = 0;
        if (isPart1() || this.children.length === 0) {
            for (let child of this.children) {
                if (child.hasValue()) {
                    v += child.getValue();
                } else {
                    child.getValue();
                    return;
                }
            }
            for (let meta of this.metadata) {
                v += meta;
            } 
        } else {
            let hasChild = false;
            for (let meta of this.metadata) {
                let child = this.children[meta-1];
                if (child) {
                    hasChild = true;
                    if (child.hasValue()) {
                        v += child.getValue();
                    } else {
                        child.getValue();
                        return;
                    }
                }
            }
        }
        this.value = v;
    }
}