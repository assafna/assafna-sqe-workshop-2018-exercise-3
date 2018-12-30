import * as esprima from 'esprima';
import {Node} from './cfg-objects';

let idCounter;
let endLoopNode;

const cfgParser = (code) => {
    let parsedScript = esprima.parseScript(code);
    //new
    idCounter = 0;
    endLoopNode = null;
    //root
    let rootNode = new Node(idCounter++, 'root');
    rootNode.shape = 'square';
    //end program node
    let endProgramNode = new Node(idCounter++, 'node');
    endProgramNode.shape = 'square';
    //parser
    recursiveParser(parsedScript, rootNode, endProgramNode);
    return rootNode;
};

function recursiveParser(code, lastNode, endNode){
    //stop condition
    if (code == null || code.type == null) return;
    typeParser1(code, lastNode, endNode);
}

function typeParser1(code, lastNode, endNode){
    if (code.type === 'Program') return typeProgramParser(code, lastNode, endNode);
    else if (code.type === 'FunctionDeclaration') return typeFunctionDeclarationParser(code, lastNode, endNode);
    else if (code.type === 'BlockStatement') return typeBlockStatementParser(code, lastNode, endNode);
    else if (code.type === 'VariableDeclaration') return typeVariableDeclarationParser(code, lastNode, endNode);
    else return typeParser2(code, lastNode, endNode);
}

function typeParser2(code, lastNode, endNode){
    if (code.type === 'ExpressionStatement') return typeExpressionStatementParser(code, lastNode, endNode);
    else if (code.type === 'AssignmentExpression') return typeAssignmentExpressionParser(code, lastNode, endNode);
    else if (code.type === 'UpdateExpression') return typeUpdateExpressionParser(code, lastNode, endNode);
    else if (code.type === 'EmptyStatement') return;
    else return typeParser3(code, lastNode, endNode);
}

function typeParser3(code, lastNode, endNode){
    if (code.type === 'WhileStatement') return typeWhileStatementParser(code, lastNode, endNode);
    else if (code.type === 'IfStatement') return typeIfStatementParser(code, lastNode, endNode);
    return typeReturnStatementParser(code, lastNode, endNode);
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

function typeProgramParser(code, lastNode, endNode){
    //ignore parse and continue
    code.body.forEach(function (x) {
        recursiveParser(x, lastNode, endNode);
    });
}

function typeFunctionDeclarationParser(code, lastNode, endNode){
    //add function itself
    // addToResult(lineNumber, code.type, typeReturnValues(code.id), null, null);
    //add params
    // functionParamsParser(code.params);
    //body
    recursiveParser(code.body, lastNode, endNode);
}

// function functionParamsParser(code){
//     code.forEach(function (x) {
//         addToResult(lineNumber, x.type, typeReturnValues(x), null, null);
//     });
// }

function typeBlockStatementParser(code, lastNode, endNode){
    let latestNode = lastNode;
    //ignore parse and continue
    for (let i = 0; i < code.body.length; i++) {
        //check previous for new node
        if (i > 0 && (code.body[i - 1].type === 'IfStatement' || code.body[i - 1].type === 'WhileStatement')) {
            //create new node
            let newBlockNode = new Node(idCounter++, 'node');
            newBlockNode.shape = 'square';
            // endLoopNode.nextTrue = newBlockNode;
            // newBlockNode.prevNode = endLoopNode;
            // newBlockNode.nextTrue = endNode;
            newBlockNode.nextTrue = endLoopNode.nextTrue;
            endLoopNode.nextTrue = newBlockNode;
            newBlockNode.prevNode = endLoopNode;
            latestNode = newBlockNode;
            recursiveParser(code.body[i], latestNode, endNode);
        } else {
            recursiveParser(code.body[i], latestNode, endNode);
        }
    }
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

function typeExpressionStatementParser(code, lastNode, endNode){
    //ignore and continue
    recursiveParser(code.expression, lastNode, endNode);
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

function typeWhileStatementParser(code, lastNode, endNode){
    //new null
    let whileNullNode = new Node(idCounter++, 'node');
    whileNullNode.shape = 'square';
    lastNode.nextTrue = whileNullNode;
    whileNullNode.prevNode = lastNode;
    whileNullNode.assignmentsArray.push('NULL');

    //new while
    let whileNode = new Node(idCounter++, 'while');
    whileNode.shape = 'rhombus';
    whileNullNode.nextTrue = whileNode;
    whileNode.prevNode = whileNullNode;

    //new next true
    let nextWhileTrue = new Node(idCounter++, 'node');
    nextWhileTrue.shape = 'square';
    nextWhileTrue.condition = true;
    whileNode.nextTrue = nextWhileTrue;
    nextWhileTrue.prevNode = whileNode;
    nextWhileTrue.nextTrue = whileNullNode;

    //new next false
    let nextWhileFalse = new Node(idCounter++, 'node');
    // nextWhileFalse.isFinal = true;
    nextWhileFalse.shape = 'square';
    nextWhileFalse.condition = false;
    whileNode.nextFalse = nextWhileFalse;
    nextWhileFalse.prevNode = whileNode;
    nextWhileFalse.nextTrue = endNode;

    //finals
    // whileNullNode.finalNode = nextWhileFalse;
    // whileNode.finalNode = nextWhileFalse;
    // nextWhileTrue.finalNode = nextWhileFalse;

    //closing while
    // if (lastNode.type !== 'while')
    //     lastNode.afterLoopNode = nextWhileFalse;

    //while itself
    whileNode.test = typeReturnValues(code.test);

    //body
    recursiveParser(code.body, nextWhileTrue, endNode);

    //done
    // whileNode.done = true;

    //end loop
    endLoopNode = nextWhileFalse;
}

function typeIfStatementParser(code, lastNode, endNode){
    //new if
    let ifNode = new Node(idCounter++, 'if');
    ifNode.shape = 'rhombus';
    ifNode.prevNode = lastNode;

    //new next true
    let nextTrueNode = new Node(idCounter++, 'node');
    nextTrueNode.shape = 'square';
    nextTrueNode.condition = true;
    ifNode.nextTrue = nextTrueNode;
    nextTrueNode.prevNode = ifNode;

    //new next false
    let nextFalseNode = new Node(idCounter++, 'node');
    nextFalseNode.shape = 'square';
    nextFalseNode.condition = false;
    ifNode.nextFalse = nextFalseNode;
    nextFalseNode.prevNode = ifNode;

    //new final
    ifNode.finalNode = new Node(idCounter++, 'node');
    // ifNode.finalNode.isFinal = true;
    ifNode.finalNode.shape = 'circle';
    ifNode.finalNode.prevNode = ifNode;
    ifNode.finalNode.nextTrue = lastNode.nextTrue;
    lastNode.nextTrue = ifNode;
    // if (lastNode.finalNode != null)
    //     ifNode.finalNode.nextTrue = lastNode.finalNode;

    //closing if
    // if (lastNode.type !== 'if')
    //     lastNode.afterLoopNode = ifNode.finalNode;

    //set finals
    // nextTrueNode.finalNode = ifNode.finalNode;
    // nextFalseNode.finalNode = ifNode.finalNode;

    nextTrueNode.nextTrue = ifNode.finalNode;
    nextFalseNode.nextTrue = ifNode.finalNode;

    //if itself
    ifNode.test = typeReturnValues(code.test);

    //consequent
    recursiveParser(code.consequent, nextTrueNode, ifNode.finalNode);

    //alternate
    if (code.alternate != null)
        recursiveParser(code.alternate, nextFalseNode, ifNode.finalNode);

    //done
    // ifNode.done = true;

    //end loop
    endLoopNode = ifNode.finalNode;
}

function typeReturnStatementParser(code, lastNode, endNode){
    //new return node
    let returnNode = new Node(idCounter++, 'return');
    returnNode.shape = 'square';
    lastNode.nextTrue = returnNode;
    returnNode.prevNode = lastNode;
    returnNode.nextTrue = endNode;

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