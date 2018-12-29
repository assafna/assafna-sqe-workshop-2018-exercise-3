function Square () {
    this.type = 'square';
    this.number = null;
    this.assignmentsArray = [];
    this.isFlow = false;
    this.prev = null;
    this.next = null;
}

function Rhombus (type) {
    this.type = type;
    this.number = null;
    this.test = null;
    this.testEval = false;
    this.isFlow = false;
    this.prev = null;
    this.nextTrue = null;
    this.nextFalse = null;
    this.finalObject = null;
}

function Circle () {
    this.type = 'circle';
    this.number = null;
    this.isFlow = false;
    this.prevArray = [];
    this.next = null;
}

export {Square};
export {Rhombus};
export {Circle};