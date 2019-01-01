import $ from 'jquery';
import mermaid from 'mermaid';
import {parseCode} from './code-analyzer';
import {cfgParser} from './cfg-parser';

let cfgArray;
let cfgResult;
let removeNodesRun;

$(document).ready(function () {
    $('#codeSubmissionButton').click(() => {
        //code-analyzer
        let codeToParse = $('#codePlaceholder').val();
        let parsedCode = parseCode(codeToParse);
        $('#parsedCode').val(JSON.stringify(parsedCode, null, 2));
        //args
        let args = $('#argsPlaceholder').val();
        //cfg-parser
        let root = cfgParser(codeToParse, args);

        //graph
        cfgArray = [];
        cfgResult = 'graph TD\n';
        removeNodesRun = 0;
        removeIrrelevantNodes(root);
        graphToCFG(root);
        addNumbers();
        cfgArrayToString();
        resetHTML();
        printCFG();
    });
});

function removeIrrelevantNodes(node){
    if (removeNodesRun > 500) return;
    if (node.nextFalse != null && node.nextFalse.nextTrue != null && node.nextFalse.assignmentsArray != null && node.nextFalse.assignmentsArray.length === 0 && node.nextFalse.shape === 'square') {
        node.nextFalse.nextTrue.condition = node.nextFalse.condition;
        node.nextFalse = node.nextFalse.nextTrue;
    }
    if (node.nextTrue != null && node.nextTrue.nextTrue != null && node.nextTrue.assignmentsArray != null && node.nextTrue.assignmentsArray.length === 0 && node.nextTrue.shape === 'square') {
        node.nextTrue.nextTrue.condition = node.nextTrue.condition;
        node.nextTrue = node.nextTrue.nextTrue;
    }
    removeNodesRun++;
    if (node.nextFalse != null) removeIrrelevantNodes(node.nextFalse);
    if (node.nextTrue != null) removeIrrelevantNodes(node.nextTrue);
}

function resetHTML(){
    let td = document.getElementById('cfg_td');
    let div = document.getElementById('cfg');
    td.removeChild(div);
    div = document.createElement('div');
    div.setAttribute('id', 'cfg');
    td.appendChild(div);
}

function printCFG(){
    let div = document.getElementById('cfg');
    div.innerHTML = cfgResult.toString();
    mermaid.init({noteMargin: 10}, '#cfg');
}

function graphToCFG(node) {
    addToCFGArray(node.toString());
    graphToCFGRecursive(node);
}

function graphToCFGRecursive(node) {
    if (node == null || node.isConverted) return;
    if (node.nextTrue != null) addToCFGArray(node.id + ' --> ' + node.getLineTextOfNextTrue() + node.nextTrue.toString());
    if (node.nextFalse != null) addToCFGArray(node.id + ' --> ' + node.getLineTextOfNextFalse() + node.nextFalse.toString());
    graphToCFGRecursive2(node);
    node.isConverted = true;
    graphToCFGRecursive(node.nextTrue);
    graphToCFGRecursive(node.nextFalse);
    graphToCFGRecursive(node.finalNode);
}

function graphToCFGRecursive2(node) {
    if (node.nextTrue == null && node.nextFalse == null && node.finalNode != null) addToCFGArray(node.id + ' --> ' + node.finalNode.toString());
    if (node.isFlow) addToCFGArray('style ' + node.id + ' fill:lightgreen,stroke:black');
    else addToCFGArray('style ' + node.id + ' stroke:black');
}

function addToCFGArray(text) {
    if (!cfgArray.includes(text))
        cfgArray.push(text);
}

function cfgArrayToString() {
    for (let i = 0; i < cfgArray.length; i++)
        cfgResult += cfgArray[i] + '\n';
}

function addNumbers(){
    let newCFGArray = [];
    let number = 1;
    cfgArray.forEach(function (x) {
        let newLine = x;
        let char = null;
        if (x.includes('[')) { char = '['; }
        else if (x.includes('{')) {char = '{'; }
        if (char != null) {
            let split = x.split(char);
            newLine = split[0] + char + '<small>' + number++ + '</small><br/>' + split[1];
        }
        newCFGArray.push(newLine);
    });
    cfgArray = newCFGArray;
}