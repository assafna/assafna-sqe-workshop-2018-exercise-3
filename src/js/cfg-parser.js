import * as esprima from 'esprima';
import {Node} from './cfg-objects';

let idCounter;
let endLoopNode;
let dictionary;
let forEval;

const cfgParser = (code, args) => {
    let parsedScript = esprima.parseScript(code);
    //new
    idCounter = 0;
    endLoopNode = null;
    dictionary = {};
    argsParser(args);
    forEval = false;
    //root
    let rootNode = new Node(idCounter++, 'root', 'square');
    rootNode.isFlow = true;
    //end program node
    let endProgramNode = new Node(idCounter++, 'node', 'square');
    endProgramNode.isFlow = true;
    //parser
    recursiveParser(parsedScript, rootNode, endProgramNode, dictionary, true);
    return rootNode;
};

function recursiveParser(code, lastNode, endNode, dictionary, amITrue){
    //stop condition
    if (code == null || code.type == null) return;
    typeParser1(code, lastNode, endNode, dictionary, amITrue);
}

function typeParser1(code, lastNode, endNode, dictionary, amITrue){
    if (code.type === 'Program') return typeProgramParser(code, lastNode, endNode, dictionary, amITrue);
    else if (code.type === 'FunctionDeclaration') return typeFunctionDeclarationParser(code, lastNode, endNode, dictionary, amITrue);
    else if (code.type === 'BlockStatement') return typeBlockStatementParser(code, lastNode, endNode, dictionary, amITrue);
    else if (code.type === 'VariableDeclaration') return typeVariableDeclarationParser(code, lastNode, dictionary, amITrue);
    else return typeParser2(code, lastNode, endNode, dictionary, amITrue);
}

function typeParser2(code, lastNode, endNode, dictionary, amITrue){
    if (code.type === 'ExpressionStatement') return typeExpressionStatementParser(code, lastNode, endNode, dictionary, amITrue);
    else if (code.type === 'AssignmentExpression') return typeAssignmentExpressionParser(code, lastNode, endNode, dictionary, amITrue);
    else if (code.type === 'UpdateExpression') return typeUpdateExpressionParser(code, lastNode, endNode, dictionary, amITrue);
    else if (code.type === 'EmptyStatement') return;
    else return typeParser3(code, lastNode, endNode, dictionary, amITrue);
}

function typeParser3(code, lastNode, endNode, dictionary, amITrue){
    if (code.type === 'WhileStatement') return typeWhileStatementParser(code, lastNode, endNode, dictionary, amITrue);
    else if (code.type === 'IfStatement') return typeIfStatementParser(code, lastNode, dictionary, amITrue);
    return typeReturnStatementParser(code, lastNode, endNode, dictionary, amITrue);
}

function typeReturnValues(code, dictionary, amITrue){
    if (code.type === 'MemberExpression') return typeMemberExpressionParser(code, dictionary, amITrue);
    else if (code.type === 'BinaryExpression') return typeBinaryExpressionParser(code, dictionary, amITrue);
    else if (code.type === 'LogicalExpression') return typeLogicalExpressionParser(code, dictionary, amITrue);
    else return typeReturnValues2(code, dictionary, amITrue);
}

function typeReturnValues2(code, dictionary, amITrue){
    if (code.type === 'UnaryExpression') return typeUnaryExpressionParser(code, dictionary, amITrue);
    else if (code.type === 'Literal') return typeLiteralParser(code, dictionary, amITrue);
    return typeIdentifierParser(code, dictionary, amITrue);
}

function deepCopyDictionary(dictionary) {
    return JSON.parse(JSON.stringify(dictionary));
}

function typeProgramParser(code, lastNode, endNode, dictionary, amITrue){
    //ignore parse and continue
    code.body.forEach(function (x) {
        recursiveParser(x, lastNode, endNode, dictionary, amITrue);
    });
}

function typeFunctionDeclarationParser(code, lastNode, endNode, dictionary, amITrue){
    //add params
    // functionParamsParser(code.params, dictionary);
    //body
    recursiveParser(code.body, lastNode, endNode, deepCopyDictionary(dictionary), amITrue);
}

// function functionParamsParser(code, dictionary){
//     code.forEach(function (x) {
//         insertToDictionary(dictionary, x.name, x.name);
//     });
// }

function typeBlockStatementParser(code, lastNode, endNode, dictionary, amITrue){
    let latestNode = lastNode;
    //ignore parse and continue
    for (let i = 0; i < code.body.length; i++) {
        //check previous for new node
        if (i > 0 && (code.body[i - 1].type === 'IfStatement' || code.body[i - 1].type === 'WhileStatement')) {
            //create new node
            let newBlockNode = new Node(idCounter++, 'node', 'square');
            if (amITrue) newBlockNode.isFlow = true;
            newBlockNode.nextTrue = endLoopNode.nextTrue;
            endLoopNode.nextTrue = newBlockNode;
            newBlockNode.prevNode = endLoopNode;
            latestNode = newBlockNode;
            recursiveParser(code.body[i], latestNode, endNode, dictionary, amITrue);
        } else {
            recursiveParser(code.body[i], latestNode, endNode, dictionary, amITrue);
        }
    }
}

function typeVariableDeclarationParser(code, lastNode, dictionary, amITrue){
    code.declarations.forEach(function (x) {
        typeVariableDeclaratorParser(x, lastNode, dictionary, amITrue);
    });
}

function typeVariableDeclaratorParser(code, lastNode, dictionary, amITrue){
    //check if init
    if (code.init != null) {
        forEval = false;
        lastNode.assignmentsArray.push(typeReturnValues(code.id, dictionary, amITrue) + ' = ' + typeReturnValues(code.init, dictionary, amITrue));
        forEval = true;
        if (code.init.type === 'ArrayExpression'){
            code.init.elements.forEach(function (value, index) {
                insertToDictionary(dictionary, code.id.name + '[' + index + ']', typeReturnValues(value, dictionary, amITrue));
            });
            insertToDictionary(dictionary, code.id.name, typeArrayExpressionToStringArray(code.init.elements, dictionary, amITrue));
        } else
            insertToDictionary(dictionary, code.id.name, typeReturnValues(code.init, dictionary, amITrue));
    } else {
        forEval = false;
        lastNode.assignmentsArray.push(typeReturnValues(code.id, dictionary, amITrue));
        forEval = true;
        insertToDictionary(dictionary, code.id.name);
    }
}

function typeArrayExpressionToStringArray(code, dictionary, amITrue){
    let result = '[';
    code.forEach(function (value) {
        result += typeReturnValues(value, dictionary, amITrue) + ',';
    });
    return result.substring(0, result.length - 1) + ']';
}

function typeExpressionStatementParser(code, lastNode, endNode, dictionary, amITrue){
    //ignore and continue
    recursiveParser(code.expression, lastNode, endNode, dictionary, amITrue);
}

function typeAssignmentExpressionParser(code, lastNode, dictionary, amITrue){
    forEval = false;
    lastNode.assignmentsArray.push(typeReturnValues(code.left, dictionary, amITrue) + ' = ' + typeReturnValues(code.right, dictionary, amITrue));
    forEval = true;
    insertToDictionary(dictionary, code.left.name, typeReturnValues(code.right, dictionary, amITrue));
}

function typeUpdateExpressionParser(code, lastNode, dictionary, amITrue) {
    forEval = false;
    lastNode.assignmentsArray.push(typeReturnValues(code.argument, dictionary, amITrue) + code.operator);
    //todo handle this in dictionary
}

function typeBinaryExpressionParser(code, dictionary, amITrue){
    //return value
    return typeReturnValues(code.left, dictionary, amITrue) + ' ' + code.operator + ' ' + typeReturnValues(code.right, dictionary, amITrue);
}

function typeLogicalExpressionParser(code, dictionary, amITrue) {
    //return value
    return typeReturnValues(code.left, dictionary, amITrue) + ' ' + code.operator + ' ' + typeReturnValues(code.right, dictionary, amITrue);
}

function typeWhileStatementParser(code, lastNode, endNode, dictionary, amITrue){
    //new null
    let whileNullNode = new Node(idCounter++, 'node', 'square');
    // lastNode.nextTrue = whileNullNode;
    whileNullNode.prevNode = lastNode;
    whileNullNode.assignmentsArray.push('NULL');
    if (amITrue) whileNullNode.isFlow = true;
    //new while
    let whileNode = new Node(idCounter++, 'while', 'rhombus');
    whileNullNode.nextTrue = whileNode;
    whileNode.prevNode = whileNullNode;
    if (amITrue) whileNode.isFlow = true;
    //new next true
    let nextWhileTrue = new Node(idCounter++, 'node', 'square');
    nextWhileTrue.condition = true;
    whileNode.nextTrue = nextWhileTrue;
    nextWhileTrue.prevNode = whileNode;
    nextWhileTrue.nextTrue = whileNullNode;

    typeWhileStatementParser2(code, lastNode, endNode, whileNullNode, whileNode, nextWhileTrue, dictionary, amITrue);
}

function typeWhileStatementParser2(code, lastNode, endNode, whileNullNode, whileNode, nextWhileTrue, dictionary, amITrue){
    //new next false
    let nextWhileFalse = new Node(idCounter++, 'node', 'square');
    nextWhileFalse.condition = false;
    whileNode.nextFalse = nextWhileFalse;
    nextWhileFalse.prevNode = whileNode;
    nextWhileFalse.nextTrue = lastNode.nextTrue;
    lastNode.nextTrue = whileNullNode;

    //while itself
    forEval = false;
    whileNode.test = typeReturnValues(code.test, dictionary, amITrue);
    forEval = true;
    if (amITrue && safeEvalFunc(typeReturnValues(code.test, dictionary, amITrue)))
        nextWhileTrue.isFlow = true;
    else {
        amITrue = false;
        nextWhileFalse.isFlow = true;
    }

    //body
    recursiveParser(code.body, nextWhileTrue, endNode, deepCopyDictionary(dictionary), amITrue);

    //end loop
    endLoopNode = nextWhileFalse;
}

function typeIfStatementParser(code, lastNode, dictionary, amITrue){
    //new if
    let ifNode = new Node(idCounter++, 'if', 'rhombus');
    ifNode.prevNode = lastNode;
    if (amITrue) ifNode.isFlow = true;

    //new next true
    let nextTrueNode = new Node(idCounter++, 'node', 'square');
    nextTrueNode.condition = true;
    ifNode.nextTrue = nextTrueNode;
    nextTrueNode.prevNode = ifNode;

    //new next false
    let nextFalseNode = new Node(idCounter++, 'node', 'square');
    nextFalseNode.condition = false;
    ifNode.nextFalse = nextFalseNode;
    nextFalseNode.prevNode = ifNode;

    typeIfStatementParser2(code, lastNode, ifNode, nextTrueNode, nextFalseNode, dictionary, amITrue);
}

function typeIfStatementParser2(code, lastNode, ifNode, nextTrueNode, nextFalseNode, dictionary, amITrue){
    //new final
    ifNode.finalNode = new Node(idCounter++, 'node', 'circle');
    ifNode.finalNode.prevNode = ifNode;
    ifNode.finalNode.nextTrue = lastNode.nextTrue;
    if (amITrue) ifNode.finalNode.isFlow = true;
    lastNode.nextTrue = ifNode;
    //set finals
    nextTrueNode.nextTrue = ifNode.finalNode;
    nextFalseNode.nextTrue = ifNode.finalNode;
    //if itself
    forEval = false;
    ifNode.test = typeReturnValues(code.test, dictionary, amITrue);
    forEval = true;
    if (amITrue && safeEvalFunc(typeReturnValues(code.test, dictionary, amITrue))) nextTrueNode.isFlow = true;
    else if (amITrue) nextFalseNode.isFlow = true;
    forEval = false;
    //consequent
    recursiveParser(code.consequent, nextTrueNode, ifNode.finalNode, deepCopyDictionary(dictionary), nextTrueNode.isFlow);
    //alternate
    if (code.alternate != null) recursiveParser(code.alternate, nextFalseNode, ifNode.finalNode, deepCopyDictionary(dictionary), amITrue && nextFalseNode.isFlow);
    //end loop
    endLoopNode = ifNode.finalNode;
}

function typeReturnStatementParser(code, lastNode, endNode, dictionary, amITrue){
    //new return node
    let returnNode = new Node(idCounter++, 'return', 'square');
    lastNode.nextTrue = returnNode;
    returnNode.prevNode = lastNode;
    // returnNode.nextTrue = endNode;
    if (amITrue) returnNode.isFlow = true;

    //empty
    if (code.argument == null)
        returnNode.assignmentsArray.push('return');
    else
        returnNode.assignmentsArray.push('return ' + typeReturnValues(code.argument, dictionary, amITrue));
}

function typeMemberExpressionParser(code, dictionary, amITrue){
    //return value
    return typeReturnValues(code.object, dictionary, amITrue) + '[' + typeReturnValues(code.property, dictionary, amITrue) + ']';
}

function typeUnaryExpressionParser(code, dictionary, amITrue){
    //return value
    return code.operator + typeReturnValues(code.argument, dictionary, amITrue);
}

function typeLiteralParser(code){
    //return value
    return code.raw;
}

function typeIdentifierParser(code, dictionary){
    //return value
    if (forEval)
        return dictionary[code.name];
    else
        return code.name;
}

function safeEvalFunc(code){
    return new Function('return ' + code)();
}

function argsParser(args) {
    let regex = /(?![^)(]*\([^)(]*?\)\)),(?![^[]*])/g;
    let keyValueArray = args.split(regex); //splits by comma not inside '[' and ']' or " or '
    keyValueArray.forEach(function (element) {
        let splitByEqual = element.split('=');
        let key = splitByEqual[0];
        let value = splitByEqual[1];
        //check arrays
        if (value.startsWith('[')){
            let array = value.substring(1, value.length - 1).split(',');
            array.forEach(function (value, index) {
                insertToDictionary(dictionary, key + '[' + index + ']', value);
            });
            insertToDictionary(dictionary ,key, value);
        } else
            insertToDictionary(dictionary ,key, value);
    });
}

function insertToDictionary(dictionary, key, value) {
    //strings
    if (value != null && (value.toString().startsWith('"') || value.toString().startsWith('\'')))
        value = '\'' + value.substring(1, value.length - 1) + '\'';

    dictionary[key] = value;
}

export {cfgParser};