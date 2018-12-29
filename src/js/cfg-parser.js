import * as esprima from 'esprima';
import {Node} from './cfg-objects';

let idCounter;

const cfgParser = (code) => {
    let parsedScript = esprima.parseScript(code);
    //new
    idCounter = 0;
    //root
    let root = new Node(idCounter++, 'root');
    recursiveParser(parsedScript, root);
    return root;
};

function recursiveParser(code, lastNode){
    //stop condition
    if (code == null || code.type == null) return;
    typeParser1(code, lastNode);
}

function typeParser1(code, lastNode){
    if (code.type === 'Program') return typeProgramParser(code, lastNode);
    else if (code.type === 'FunctionDeclaration') return typeFunctionDeclarationParser(code, lastNode);
    else if (code.type === 'BlockStatement') return typeBlockStatementParser(code, lastNode);
    else if (code.type === 'VariableDeclaration') return typeVariableDeclarationParser(code, lastNode);
    else return typeParser2(code, lastNode);
}

function typeParser2(code, lastNode){
    if (code.type === 'ExpressionStatement') return typeExpressionStatementParser(code, lastNode);
    else if (code.type === 'AssignmentExpression') return typeAssignmentExpressionParser(code, lastNode);
    else if (code.type === 'UpdateExpression') return typeUpdateExpressionParser(code, lastNode);
    else if (code.type === 'EmptyStatement') return;
    else return typeParser3(code, lastNode);
}

function typeParser3(code, lastNode){
    if (code.type === 'WhileStatement') return typeWhileStatementParser(code, lastNode);
    else if (code.type === 'IfStatement') return typeIfStatementParser(code, lastNode);
    return typeReturnStatementParser(code, lastNode);
}

function typeReturnValues(code){
    if (code.type === 'MemberExpression') return typeMemberExpressionParser(code);
    else if (code.type === 'BinaryExpression') return typeBinaryExpressionParser(code);
    else if (code.type === 'LogicalExpression') return typeLogicalExpressionParser(code);
    else return typeReturnValues2(code);
}

function typeReturnValues2(code){
    if (code.type === 'UnaryExpression') return typeUnaryExpressionParser(code);
    else if (code.type === 'Literal') return typeLiteralParser(code);
    return typeIdentifierParser(code);
}

function typeProgramParser(code, lastNode){
    //ignore parse and continue
    code.body.forEach(function (x) {
        recursiveParser(x, lastNode);
    });
}

function typeFunctionDeclarationParser(code, lastNode){
    //add function itself
    // addToResult(lineNumber, code.type, typeReturnValues(code.id), null, null);
    //add params
    // functionParamsParser(code.params);
    //body
    recursiveParser(code.body, lastNode);
}

// function functionParamsParser(code){
//     code.forEach(function (x) {
//         addToResult(lineNumber, x.type, typeReturnValues(x), null, null);
//     });
// }

function typeBlockStatementParser(code, lastNode){
    //ignore parse and continue
    code.body.forEach(function (x) {
        if (lastNode.afterLoopNode != null) {
            let newNode = new Node(idCounter++, 'node');
            lastNode.afterLoopNode.nextTrue = newNode;
            recursiveParser(x, newNode);
        }
        else
            recursiveParser(x, lastNode);
    });
}

function typeVariableDeclarationParser(code, lastNode){
    code.declarations.forEach(function (x) {
        typeVariableDeclaratorParser(x, lastNode);
    });
}

function typeVariableDeclaratorParser(code, lastNode){
    //check if init
    if (code.init != null)
        lastNode.assignmentsArray.push(typeReturnValues(code.id) + ' = ' + typeReturnValues(code.init));
    else
        lastNode.assignmentsArray.push(typeReturnValues(code.id));
}

function typeExpressionStatementParser(code, lastNode){
    //ignore and continue
    recursiveParser(code.expression, lastNode);
}

function typeAssignmentExpressionParser(code, lastNode){
    lastNode.assignmentsArray.push(typeReturnValues(code.left) + ' = ' + typeReturnValues(code.right));
}

function typeUpdateExpressionParser(code, lastNode) {
    lastNode.assignmentsArray.push(typeReturnValues(code.argument) + code.operator);
}

function typeBinaryExpressionParser(code){
    //return value
    return typeReturnValues(code.left) + ' ' + code.operator + ' ' + typeReturnValues(code.right);
}

function typeLogicalExpressionParser(code) {
    //return value
    return typeReturnValues(code.left) + ' ' + code.operator + ' ' + typeReturnValues(code.right);
}

function typeWhileStatementParser(code, lastNode){
    //new null
    let whileNullNode = new Node(idCounter++, 'while_null');
    lastNode.nextTrue = whileNullNode;
    whileNullNode.assignmentsArray.push('NULL');

    //new while
    let whileNode = new Node(idCounter++, 'while');
    whileNullNode.nextTrue = whileNode;
    whileNode.finalNode = whileNullNode;

    //new next true
    let nextWhileTrue = new Node(idCounter++, 'while_true');
    whileNode.nextTrue = nextWhileTrue;
    nextWhileTrue.finalNode = whileNullNode;

    //new next false
    let nextWhileFalse = new Node(idCounter++, 'while_false');
    whileNode.nextFalse = nextWhileFalse;

    //closing while
    if (lastNode.type !== 'while')
        lastNode.afterLoopNode = nextWhileFalse;

    //while itself
    whileNode.test = typeReturnValues(code.test);

    //body
    recursiveParser(code.body, nextWhileTrue);
}

function typeIfStatementParser(code, lastNode){
    //new if
    let ifNode = new Node(idCounter++, 'if');
    lastNode.nextTrue = ifNode;

    //new next true
    let nextTrueNode = new Node(idCounter++, 'if_true');
    ifNode.nextTrue = nextTrueNode;

    //new next false
    let nextFalseNode = new Node(idCounter++, 'if_false');
    ifNode.nextFalse = nextFalseNode;

    //new final
    ifNode.finalNode = new Node(idCounter++, 'if_final');
    if (lastNode.finalNode != null)
        ifNode.finalNode.nextTrue = lastNode.finalNode;

    //closing if
    if (lastNode.type !== 'if')
        lastNode.afterLoopNode = ifNode.finalNode;

    //set finals
    nextTrueNode.finalNode = ifNode.finalNode;
    nextFalseNode.finalNode = ifNode.finalNode;

    //if itself
    ifNode.test = typeReturnValues(code.test);

    //consequent
    recursiveParser(code.consequent, nextTrueNode);

    //alternate
    if (code.alternate != null)
        recursiveParser(code.alternate, nextFalseNode);
}

function typeReturnStatementParser(code, lastNode){
    //new return node
    let returnNode = new Node(idCounter++, 'return');
    lastNode.nextTrue = returnNode;

    //empty
    if (code.argument == null)
        returnNode.assignmentsArray.push('return');
    else
        returnNode.assignmentsArray.push('return ' + typeReturnValues(code.argument));
}

function typeMemberExpressionParser(code){
    //return value
    return typeReturnValues(code.object) + '[' + typeReturnValues(code.property) + ']';
}

function typeUnaryExpressionParser(code){
    //return value
    return code.operator + typeReturnValues(code.argument);
}

function typeLiteralParser(code){
    //return value
    return code.value;
}

function typeIdentifierParser(code){
    //return value
    return code.name;
}

function safeEvalFunc(code){
    return new Function('return ' + code)();
}

export {cfgParser};