function Node (id, type) {
    this.id = id;
    this.type = type;
    this.test = null;
    this.assignmentsArray = [];
    this.nextTrue = null;
    this.nextFalse = null;
    this.finalNode = null;
    this.afterLoopNode = null;
    this.prevNode = null;

    this.toString = function () {
        return nodeTexter(this, nodeStyler(this, nodeCoder(this)));
    };
}

function nodeCoder(node) {
    if (node.type === 'if' || node.type === 'while' || node.type.includes('if2_'))
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
    if (node.type === 'if' || node.type === 'while' || node.type.includes('if2_'))
        return '{' + code + '}';
    else if (node.type === 'if_final')
        return '((' + code + '))';
    else
        return '[' + code + ']';
}

function nodeTexter(node, code) {
    if (node.type.includes('_true'))
        return '|T|' + node.id + code;
    else if (node.type.includes('_false'))
        return '|F|' + node.id + code;
    else
        return node.id + code;
}

export {Node};