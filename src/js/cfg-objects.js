function Node (id, type, shape) {
    this.id = id; //going up
    this.type = type; //root, node, if, while, return
    this.shape = shape; //square, rhombus, circle
    this.isFlow = false; //for eval and graph
    this.condition = null; //true, false
    this.test = null; //for if and while
    this.assignmentsArray = []; //for nodes
    this.nextTrue = null; //for if and while
    this.nextFalse = null; //for if and while
    this.finalNode = null;
    this.prevNode = null; //father node
    this.isConverted = false; //for creating graph

    this.toString = function () {
        return nodeTexter(this, nodeStyler(this, nodeCoder(this)));
    };
}

function nodeCoder(node) {
    if (node.type === 'if' || node.type === 'while')
        return node.test;
    else if (node.assignmentsArray.length > 0)
        return nodeAssignments(node);
    else
        return ' ';
}

function nodeAssignments(node) {
    let assignmentsString = '';
    for (let i = 0; i < node.assignmentsArray.length; i++){
        assignmentsString += node.assignmentsArray[i];
        if (i < node.assignmentsArray.length - 1)
            assignmentsString += '<br/>';
    }
    return assignmentsString;
}

function nodeStyler(node, code) {
    if (node.shape === 'rhombus')
        return '{' + code + '}';
    else if (node.shape === 'circle')
        return '((' + code + '))';
    else
        return '[' + code + ']';
}

function nodeTexter(node, code) {
    if (node.condition === true)
        return '|T|' + node.id + code;
    else if (node.condition === false)
        return '|F|' + node.id + code;
    else
        return node.id + code;
}

export {Node};