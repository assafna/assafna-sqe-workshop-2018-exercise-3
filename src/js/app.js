import $ from 'jquery';
import mermaid from 'mermaid';
import {parseCode} from './code-analyzer';
import {recursionParser} from './my-parser';
import {cfgParser} from './cfg-parser';

let cfgArray;
let cfgResult;
let id;

$(document).ready(function () {
    $('#codeSubmissionButton').click(() => {
        //code-analyzer
        let codeToParse = $('#codePlaceholder').val();
        let parsedCode = parseCode(codeToParse);
        $('#parsedCode').val(JSON.stringify(parsedCode, null, 2));

        //my-parser
        let result = recursionParser(codeToParse);
        buildTable();
        printToTable(result);

        let root = cfgParser(codeToParse);
        console.log(root);

        cfgArray = [];
        cfgResult = 'graph TD\n';
        id = 0;

        // removeIrrelevantNodes(root);
        console.log(root);
        graphToCFGRecursive(root);
        cfgArrayToString();
        console.log(root);
        console.log(cfgResult);
        printCFG();
    });
});

function buildTable(){
    let div = document.getElementById('result');
    div.removeChild(div.firstChild);
    let table = document.createElement('table');
    div.appendChild(table);
    table.setAttribute('id', 'resultTable');
    let tableHead = document.createElement('thead');
    table.appendChild(tableHead);
    let title = document.createElement('h1');
    tableHead.appendChild(title);
    title.innerHTML = 'Result Table';
    let tableBody = document.createElement('tbody');
    table.appendChild(tableBody);
    buildTableCols(tableBody);
}

function buildTableCols(tableBody){
    let firstRow = document.createElement('tr');
    tableBody.appendChild(firstRow);
    let lineCol = document.createElement('th');
    lineCol.innerHTML = 'Line';
    let typeCol = document.createElement('th');
    typeCol.innerHTML = 'Type';
    let nameCol = document.createElement('th');
    nameCol.innerHTML = 'Name';
    let conditionCol = document.createElement('th');
    conditionCol.innerHTML = 'Condition';
    let valueCol = document.createElement('th');
    valueCol.innerHTML = 'Value';
    firstRow.appendChild(lineCol);
    firstRow.appendChild(typeCol);
    firstRow.appendChild(nameCol);
    firstRow.appendChild(conditionCol);
    firstRow.appendChild(valueCol);
}

function printToTable(result){
    let table = document.getElementById('resultTable');
    result.forEach(function (x) {
        let row = table.insertRow(table.rows.length);

        let lineCell = row.insertCell(0);
        let typeCell = row.insertCell(1);
        let nameCell = row.insertCell(2);
        let conditionCell = row.insertCell(3);
        let valueCell = row.insertCell(4);

        lineCell.innerHTML = x.line;
        typeCell.innerHTML = x.type;
        nameCell.innerHTML = x.name;
        conditionCell.innerHTML = x.condition;
        valueCell.innerHTML = x.value;
    });
}

function removeIrrelevantNodes(node){
    if (node.nextTrue != null)
        if (node.nextTrue.assignmentsArray.length === 0 && node.nextTrue.test == null && node.nextTrue.type !== 'if_final') {
            node.nextTrue = node.nextTrue.nextTrue;
            if (node.nextTrue != null)
                if (node.nextTrue.type !== 'return')
                    node.nextTrue.type = 'if2_true';
                else
                    node.nextTrue.type = 'return_true';
        }
    if (node.nextFalse != null)
        if (node.nextFalse.assignmentsArray.length === 0 && node.nextFalse.test == null && node.nextFalse.type !== 'if_final') {
            node.nextFalse = node.nextFalse.nextTrue;
            if (node.nextFalse != null)
                if (node.nextFalse.type !== 'return')
                    node.nextFalse.type = 'if2_false';
                else
                    node.nextFalse.type = 'return_false';
        }
    if (node.nextTrue != null) removeIrrelevantNodes(node.nextTrue);
    if (node.nextFalse != null) removeIrrelevantNodes(node.nextFalse);
}

function printCFG(){
    let div = document.getElementById('cfg');
    div.innerHTML = cfgResult.toString();
    mermaid.init({noteMargin: 10}, '#cfg');
}

function graphToCFGRecursive(node) {
    if (id === 0) {
        addToCFGArray(node.toString() + '\n');
        addToCFGArray(node.id + ' --> ' + node.nextTrue.toString() + '\n');
        id++;
    } if (node.nextTrue != null) {
        addToCFGArray(node.id + ' --> ' + node.nextTrue.toString() + '\n');
        id++;
        graphToCFGRecursive(node.nextTrue);
    } if (node.nextFalse != null) {
        addToCFGArray(node.id + ' --> ' + node.nextFalse.toString() + '\n');
        id++;
        graphToCFGRecursive(node.nextFalse);
    } if (node.type !== 'if' && node.type !== 'while' && !node.type.includes('if2_') && node.finalNode != null) {
        addToCFGArray(node.id + ' --> ' + node.finalNode.toString() + '\n');
        id++;
        if (node.type !== 'while_true')
            graphToCFGRecursive(node.finalNode);
    }
}

function addToCFGArray(text) {
    if (!cfgArray.includes(text))
        cfgArray.push(text);
}

function cfgArrayToString() {
    for (let i = 0; i < cfgArray.length; i++)
        cfgResult += cfgArray[i];
}