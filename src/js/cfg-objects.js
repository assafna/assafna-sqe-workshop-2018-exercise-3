function Node (id, type) {
    this.id = id;
    this.type = type;
    this.test = null;
    this.assignmentsArray = [];
    this.nextTrue = null;
    this.nextFalse = null;
    this.finalNode = null;
}

export {Node};