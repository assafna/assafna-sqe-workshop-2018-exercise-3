import * as esprima from 'esprima';
import {Circle, Rhombus, Square} from './cfg-objects';

let objectsArray;
let tempCircle = null;

const cfgParser = (code) => {
    objectsArray = []; //new
    let parsedScript = esprima.parseScript(code);
    //root
    let root = new Square();
    addToObjectsArray(root);
    recursiveParser(parsedScript, root);
    return objectsArray;
};

function recursiveParser(code, prevObject){
    //stop condition
    if (code == null || code.type == null) return;
    typeParser1(code, prevObject);
}

function typeParser1(code, prevObject){
    if (code.type === 'Program') return typeProgramParser(code, prevObject);
    else if (code.type === 'FunctionDeclaration') return typeFunctionDeclarationParser(code, prevObject);
    else if (code.type === 'BlockStatement') return typeBlockStatementParser(code, prevObject);
    else if (code.type === 'VariableDeclaration') return typeVariableDeclarationParser(code, prevObject);
    else return typeParser2(code, prevObject);
}

function typeParser2(code, prevObject){
    if (code.type === 'ExpressionStatement') return typeExpressionStatementParser(code, prevObject);
    else if (code.type === 'AssignmentExpression') return typeAssignmentExpressionParser(code, prevObject);
    else if (code.type === 'EmptyStatement') return;
    else return typeParser3(code, prevObject);
}

function typeParser3(code, prevObject){
    if (code.type === 'WhileStatement') return typeWhileStatementParser(code, prevObject);
    else if (code.type === 'IfStatement') return typeIfStatementParser(code, prevObject);
    return typeReturnStatementParser(code, prevObject);
}

function typeReturnValues(code, prevObject){
    if (code.type === 'MemberExpression') return typeMemberExpressionParser(code, prevObject);
    else if (code.type === 'BinaryExpression') return typeBinaryExpressionParser(code, prevObject);
    else if (code.type === 'UnaryExpression') return typeUnaryExpressionParser(code, prevObject);
    else if (code.type === 'Literal') return typeLiteralParser(code, prevObject);
    return typeIdentifierParser(code, prevObject);
}

function typeProgramParser(code, prevObject){
    //ignore parse and continue
    code.body.forEach(function (x) {
        recursiveParser(x, prevObject);
    });
}

function typeFunctionDeclarationParser(code, prevObject){
    //add function itself
    // addToResult(lineNumber, code.type, typeReturnValues(code.id), null, null);
    //add params
    // functionParamsParser(code.params);
    //body
    recursiveParser(code.body, prevObject);
}

// function functionParamsParser(code){
//     code.forEach(function (x) {
//         addToResult(lineNumber, x.type, typeReturnValues(x), null, null);
//     });
// }

function typeBlockStatementParser(code, prevObject){
    //circle
    if (tempCircle != null){
        prevObject = tempCircle;
        tempCircle = null;
    }

    //create new square
    let square = new Square();
    addToObjectsArray(square);
    square.prev = prevObject;

    if (prevObject.type === 'while' || prevObject.type === 'if') {
        prevObject.nextTrue = square;
        square.next = prevObject.finalObject;
        prevObject.finalObject.prevArray.push(square);
    } else {
        prevObject.next = square;
    }

    //ignore parse and continue
    code.body.forEach(function (x) {
        recursiveParser(x, square);
    });
}

function typeVariableDeclarationParser(code, prevObject){
    code.declarations.forEach(function (x) {
        typeVariableDeclaratorParser(x, prevObject);
    });
}

function typeVariableDeclaratorParser(code, prevObject){
    //check if init
    if (code.init != null)
        prevObject.assignmentsArray.push(typeReturnValues(code.id, prevObject) + ' = ' + typeReturnValues(code.init, prevObject));
    else
        prevObject.assignmentsArray.push(typeReturnValues(code.id, prevObject));
}

function typeExpressionStatementParser(code, prevObject){
    //ignore and continue
    recursiveParser(code.expression, prevObject);
}

function typeAssignmentExpressionParser(code, prevObject){
    prevObject.assignmentsArray.push(typeReturnValues(code.left, prevObject) + ' = ' + typeReturnValues(code.right, prevObject));
}

function typeBinaryExpressionParser(code, prevObject){
    //return value
    return typeReturnValues(code.left, prevObject) + ' ' + code.operator + ' ' + typeReturnValues(code.right, prevObject);
}

function typeWhileStatementParser(code, prevObject){
    //new null square
    let nullSquare = new Square();
    addToObjectsArray(nullSquare);
    nullSquare.assignmentsArray.push('NULL');
    nullSquare.prev = prevObject;

    //new rhombus
    let rhombus = new Rhombus('while');
    addToObjectsArray(rhombus);
    rhombus.prev = nullSquare;
    rhombus.finalObject = nullSquare;

    //while itself
    rhombus.test = typeReturnValues(code.test, prevObject);
    if (safeEvalFunc(rhombus.test))
        rhombus.testEval = true;

    //body
    recursiveParser(code.body, rhombus);
}

function typeIfStatementParser(code, prevObject){
    //new rhombus
    let rhombus = new Rhombus('if');
    addToObjectsArray(rhombus);
    rhombus.prev = prevObject;

    if (prevObject.type === 'if'){
        prevObject.nextFalse = rhombus;
        rhombus.finalObject = prevObject.finalObject;
    } else {
        prevObject.next = rhombus;
        let circle = new Circle();
        addToObjectsArray(circle);
        rhombus.finalObject = circle;
    }

    //if itself
    rhombus.test = typeReturnValues(code.test, prevObject);

    //consequent
    recursiveParser(code.consequent, rhombus);

    //alternate
    if (code.alternate != null)
        recursiveParser(code.alternate, rhombus);

    tempCircle = rhombus.finalObject;
}

function typeReturnStatementParser(code, prevObject){
    //new square
    let square = new Square();
    addToObjectsArray(square);
    // if (prevObject.type === 'if') {
    //     square.prev = prevObject.finalObject;
    //     prevObject.finalObject.next = square;
    // } else
    //     square.prev = prevObject;

    if (tempCircle != null) {
        for (let i = 0; i < objectsArray.length; i++)
            if (objectsArray[i] === tempCircle) {
                square.prev = objectsArray[i];
                objectsArray[i].next = square;
            }
    }

    //empty
    if (code.argument == null)
        square.assignmentsArray.push('return');
    else
        square.assignmentsArray.push('return ' + typeReturnValues(code.argument, prevObject));
}

function typeMemberExpressionParser(code, prevObject){
    //return value
    return typeReturnValues(code.object, prevObject) + '[' + typeReturnValues(code.property, prevObject) + ']';
}

function typeUnaryExpressionParser(code, prevObject){
    //return value
    return code.operator + typeReturnValues(code.argument, prevObject);
}

function typeLiteralParser(code){
    //return value
    return code.value;
}

function typeIdentifierParser(code){
    //return value
    return code.name;
}

function addToObjectsArray(object){
    objectsArray.push(object);
}

function safeEvalFunc(code){
    return new Function('return ' + code)();
}

export {cfgParser};