import $ from 'jquery';
import mermaid from 'mermaid';
import {parseCode} from './code-analyzer';
import {cfgParser} from './cfg-parser';

let cfgArray;
let cfgResult;

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

        graphToCFG(root);
        cfgArrayToString();
        printCFG();
    });
});

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
    if (node.nextTrue != null) addToCFGArray(node.id + ' --> ' + node.nextTrue.toString());
    if (node.nextFalse != null) addToCFGArray(node.id + ' --> ' + node.nextFalse.toString());
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