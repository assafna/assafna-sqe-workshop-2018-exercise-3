import assert from 'assert';
import {cfgParser} from '../src/js/cfg-parser';
import {Node} from '../src/js/cfg-objects';

describe('My parser', () => {
    it('is parsing an empty code with empty args', () => {
        assert.equal(
            JSON.stringify(cfgParser(null, null)),
            'null'
        );
    });

    it('is parsing an empty code', () => {
        assert.equal(
            JSON.stringify(cfgParser(null, 'x=1')),
            'null'
        );
    });

    it('is parsing an empty args', () => {
        assert.equal(
            JSON.stringify(cfgParser('let x = 1;', null)),
            'null'
        );
    });

    it('is parsing an empty args', () => {
        assert.equal(
            JSON.stringify(cfgParser('let x = 1;', null)),
            'null'
        );
    });

    it('is parsing args with empty code', () => {
        assert.equal(
            JSON.stringify(cfgParser('', 'x = 1')),
            'null'
        );
    });


    it('is parsing empty args with code', () => {
        assert.equal(
            JSON.stringify(cfgParser('let x = 1;', '')),
            'null'
        );
    });

    it('is parsing args with code', () => {
        assert.equal(
            JSON.stringify(cfgParser('let x = 1;', 'x = 2')[1]),
            '{"0":{"id":0,"type":"root","shape":"square","isFlow":true,"test":null,"assignmentArray":["x = 1"],"nextTrue":null,"nextFalse":null}}'
        );
    });

    it('is parsing empty function with multi args', () => {
        assert.equal(
            JSON.stringify(cfgParser('function f(x, y){\n}', 'x=1,y=2')[1]),
            '{"0":{"id":0,"type":"root","shape":"square","isFlow":true,"test":null,"assignmentArray":[],"nextTrue":null,"nextFalse":null}}'
        );
    });

    it('is parsing function with basic let', () => {
        assert.equal(
            JSON.stringify(cfgParser('function f(y){\nlet x = 1;\n}', 'y=1')[1]),
            '{"0":{"id":0,"type":"root","shape":"square","isFlow":true,"test":null,"assignmentArray":["x = 1"],"nextTrue":null,"nextFalse":null}}'
        );
    });


    it('is parsing function with if of arg with args', () => {
        assert.equal(
            JSON.stringify(cfgParser('function f(x, y){\nif (x > 0)\nreturn 1;\n}', 'x=1,y=0')[1]),
            '{"0":{"id":0,"type":"root","shape":"square","isFlow":true,"test":null,"assignmentArray":[],"nextTrue":2,"nextFalse":null},"2":{"id":2,"type":"if","shape":"rhombus","isFlow":true,"test":"x > 0","assignmentArray":[],"nextTrue":3,"nextFalse":4},"3":{"id":3,"type":"node","shape":"square","isFlow":true,"test":null,"assignmentArray":[],"nextTrue":6,"nextFalse":null},"4":{"id":4,"type":"node","shape":"square","isFlow":false,"test":null,"assignmentArray":[],"nextTrue":5,"nextFalse":null},"5":{"id":5,"type":"node","shape":"circle","isFlow":true,"test":null,"assignmentArray":[],"nextTrue":null,"nextFalse":null},"6":{"id":6,"type":"return","shape":"square","isFlow":true,"test":null,"assignmentArray":["return 1"],"nextTrue":null,"nextFalse":null}}'
        );
    });

    it('is parsing function with if of var with args', () => {
        assert.equal(
            JSON.stringify(cfgParser('function f(x, y){\nlet a = x;\nif (a > 0)\nreturn;\n}', 'x=1,y=0')[1]),
            '{"0":{"id":0,"type":"root","shape":"square","isFlow":true,"test":null,"assignmentArray":["a = x"],"nextTrue":2,"nextFalse":null},"2":{"id":2,"type":"if","shape":"rhombus","isFlow":true,"test":"a > 0","assignmentArray":[],"nextTrue":3,"nextFalse":4},"3":{"id":3,"type":"node","shape":"square","isFlow":true,"test":null,"assignmentArray":[],"nextTrue":6,"nextFalse":null},"4":{"id":4,"type":"node","shape":"square","isFlow":false,"test":null,"assignmentArray":[],"nextTrue":5,"nextFalse":null},"5":{"id":5,"type":"node","shape":"circle","isFlow":true,"test":null,"assignmentArray":[],"nextTrue":null,"nextFalse":null},"6":{"id":6,"type":"return","shape":"square","isFlow":true,"test":null,"assignmentArray":["return"],"nextTrue":null,"nextFalse":null}}'
        );
    });

    it('is parsing function with if with else', () => {
        assert.equal(
            JSON.stringify(cfgParser('function f(x, y){\nlet a;\na = x;\nif (a > 0)\nreturn 1;\nelse\nreturn 2;\n}', 'x=1,y=0')[1]),
            '{"0":{"id":0,"type":"root","shape":"square","isFlow":true,"test":null,"assignmentArray":["a","a = x"],"nextTrue":2,"nextFalse":null},"2":{"id":2,"type":"if","shape":"rhombus","isFlow":true,"test":"a > 0","assignmentArray":[],"nextTrue":3,"nextFalse":4},"3":{"id":3,"type":"node","shape":"square","isFlow":false,"test":null,"assignmentArray":[],"nextTrue":6,"nextFalse":null},"4":{"id":4,"type":"node","shape":"square","isFlow":true,"test":null,"assignmentArray":[],"nextTrue":7,"nextFalse":null},"6":{"id":6,"type":"return","shape":"square","isFlow":false,"test":null,"assignmentArray":["return 1"],"nextTrue":null,"nextFalse":null},"7":{"id":7,"type":"return","shape":"square","isFlow":true,"test":null,"assignmentArray":["return 2"],"nextTrue":null,"nextFalse":null}}'
        );
    });

    it('is parsing function with if with else if and else', () => {
        assert.equal(
            JSON.stringify(cfgParser('function f(x, y){\nx = 2;\nlet a = x + 1;\nif (a > 0)\nreturn 1;\nelse if (a < 0)\nreturn 2;\nelse\nreturn 3;\n}', 'x=1,y=0')[1]),
            '{"0":{"id":0,"type":"root","shape":"square","isFlow":true,"test":null,"assignmentArray":["x = 2","a = x + 1"],"nextTrue":2,"nextFalse":null},"2":{"id":2,"type":"if","shape":"rhombus","isFlow":true,"test":"a > 0","assignmentArray":[],"nextTrue":3,"nextFalse":4},"3":{"id":3,"type":"node","shape":"square","isFlow":true,"test":null,"assignmentArray":[],"nextTrue":6,"nextFalse":null},"4":{"id":4,"type":"node","shape":"square","isFlow":false,"test":null,"assignmentArray":[],"nextTrue":7,"nextFalse":null},"6":{"id":6,"type":"return","shape":"square","isFlow":true,"test":null,"assignmentArray":["return 1"],"nextTrue":null,"nextFalse":null},"7":{"id":7,"type":"if","shape":"rhombus","isFlow":false,"test":"a < 0","assignmentArray":[],"nextTrue":8,"nextFalse":9},"8":{"id":8,"type":"node","shape":"square","isFlow":false,"test":null,"assignmentArray":[],"nextTrue":11,"nextFalse":null},"9":{"id":9,"type":"node","shape":"square","isFlow":false,"test":null,"assignmentArray":[],"nextTrue":12,"nextFalse":null},"11":{"id":11,"type":"return","shape":"square","isFlow":false,"test":null,"assignmentArray":["return 2"],"nextTrue":null,"nextFalse":null},"12":{"id":12,"type":"return","shape":"square","isFlow":false,"test":null,"assignmentArray":["return 3"],"nextTrue":null,"nextFalse":null}}'
        );
    });

    it('is parsing function with if with else if and else where else if is true', () => {
        assert.equal(
            JSON.stringify(cfgParser('function f(x, y){\nlet a = x;\nif (a < 0)\nreturn 1;\nelse if (a > 0)\nreturn 2;\nelse\nreturn 3;\n}', 'x=1,y=0')[1]),
            '{"0":{"id":0,"type":"root","shape":"square","isFlow":true,"test":null,"assignmentArray":["a = x"],"nextTrue":2,"nextFalse":null},"2":{"id":2,"type":"if","shape":"rhombus","isFlow":true,"test":"a < 0","assignmentArray":[],"nextTrue":3,"nextFalse":4},"3":{"id":3,"type":"node","shape":"square","isFlow":false,"test":null,"assignmentArray":[],"nextTrue":6,"nextFalse":null},"4":{"id":4,"type":"node","shape":"square","isFlow":true,"test":null,"assignmentArray":[],"nextTrue":7,"nextFalse":null},"6":{"id":6,"type":"return","shape":"square","isFlow":false,"test":null,"assignmentArray":["return 1"],"nextTrue":null,"nextFalse":null},"7":{"id":7,"type":"if","shape":"rhombus","isFlow":true,"test":"a > 0","assignmentArray":[],"nextTrue":8,"nextFalse":9},"8":{"id":8,"type":"node","shape":"square","isFlow":true,"test":null,"assignmentArray":[],"nextTrue":11,"nextFalse":null},"9":{"id":9,"type":"node","shape":"square","isFlow":false,"test":null,"assignmentArray":[],"nextTrue":12,"nextFalse":null},"11":{"id":11,"type":"return","shape":"square","isFlow":true,"test":null,"assignmentArray":["return 2"],"nextTrue":null,"nextFalse":null},"12":{"id":12,"type":"return","shape":"square","isFlow":false,"test":null,"assignmentArray":["return 3"],"nextTrue":null,"nextFalse":null}}'
        );
    });

    it('is parsing function with if with else if and else where else is true', () => {
        assert.equal(
            JSON.stringify(cfgParser('function f(x, y){\nlet a = x;\nif (a < 0)\nreturn 1;\nelse if (a == 0)\nreturn 2;\nelse\nreturn 3;\n}', 'x=1,y=0')[1]),
            '{"0":{"id":0,"type":"root","shape":"square","isFlow":true,"test":null,"assignmentArray":["a = x"],"nextTrue":2,"nextFalse":null},"2":{"id":2,"type":"if","shape":"rhombus","isFlow":true,"test":"a < 0","assignmentArray":[],"nextTrue":3,"nextFalse":4},"3":{"id":3,"type":"node","shape":"square","isFlow":false,"test":null,"assignmentArray":[],"nextTrue":6,"nextFalse":null},"4":{"id":4,"type":"node","shape":"square","isFlow":true,"test":null,"assignmentArray":[],"nextTrue":7,"nextFalse":null},"6":{"id":6,"type":"return","shape":"square","isFlow":false,"test":null,"assignmentArray":["return 1"],"nextTrue":null,"nextFalse":null},"7":{"id":7,"type":"if","shape":"rhombus","isFlow":true,"test":"a == 0","assignmentArray":[],"nextTrue":8,"nextFalse":9},"8":{"id":8,"type":"node","shape":"square","isFlow":false,"test":null,"assignmentArray":[],"nextTrue":11,"nextFalse":null},"9":{"id":9,"type":"node","shape":"square","isFlow":true,"test":null,"assignmentArray":[],"nextTrue":12,"nextFalse":null},"11":{"id":11,"type":"return","shape":"square","isFlow":false,"test":null,"assignmentArray":["return 2"],"nextTrue":null,"nextFalse":null},"12":{"id":12,"type":"return","shape":"square","isFlow":true,"test":null,"assignmentArray":["return 3"],"nextTrue":null,"nextFalse":null}}'
        );
    });

    it('is parsing function with if with double else if', () => {
        assert.equal(
            JSON.stringify(cfgParser('function f(x, y){\nlet a = x;\nif (a < 0)\nreturn 1;\nelse if (a == 0)\nreturn 2;\nelse if (a == x)\nreturn 3;\n}', 'x=1,y=0')[1]),
            '{"0":{"id":0,"type":"root","shape":"square","isFlow":true,"test":null,"assignmentArray":["a = x"],"nextTrue":2,"nextFalse":null},"2":{"id":2,"type":"if","shape":"rhombus","isFlow":true,"test":"a < 0","assignmentArray":[],"nextTrue":3,"nextFalse":4},"3":{"id":3,"type":"node","shape":"square","isFlow":false,"test":null,"assignmentArray":[],"nextTrue":6,"nextFalse":null},"4":{"id":4,"type":"node","shape":"square","isFlow":true,"test":null,"assignmentArray":[],"nextTrue":7,"nextFalse":null},"5":{"id":5,"type":"node","shape":"circle","isFlow":true,"test":null,"assignmentArray":[],"nextTrue":null,"nextFalse":null},"6":{"id":6,"type":"return","shape":"square","isFlow":false,"test":null,"assignmentArray":["return 1"],"nextTrue":null,"nextFalse":null},"7":{"id":7,"type":"if","shape":"rhombus","isFlow":true,"test":"a == 0","assignmentArray":[],"nextTrue":8,"nextFalse":9},"8":{"id":8,"type":"node","shape":"square","isFlow":false,"test":null,"assignmentArray":[],"nextTrue":11,"nextFalse":null},"9":{"id":9,"type":"node","shape":"square","isFlow":true,"test":null,"assignmentArray":[],"nextTrue":12,"nextFalse":null},"10":{"id":10,"type":"node","shape":"circle","isFlow":true,"test":null,"assignmentArray":[],"nextTrue":5,"nextFalse":null},"11":{"id":11,"type":"return","shape":"square","isFlow":false,"test":null,"assignmentArray":["return 2"],"nextTrue":null,"nextFalse":null},"12":{"id":12,"type":"if","shape":"rhombus","isFlow":true,"test":"a == x","assignmentArray":[],"nextTrue":13,"nextFalse":14},"13":{"id":13,"type":"node","shape":"square","isFlow":true,"test":null,"assignmentArray":[],"nextTrue":16,"nextFalse":null},"14":{"id":14,"type":"node","shape":"square","isFlow":false,"test":null,"assignmentArray":[],"nextTrue":15,"nextFalse":null},"15":{"id":15,"type":"node","shape":"circle","isFlow":true,"test":null,"assignmentArray":[],"nextTrue":10,"nextFalse":null},"16":{"id":16,"type":"return","shape":"square","isFlow":true,"test":null,"assignmentArray":["return 3"],"nextTrue":null,"nextFalse":null}}'
        );
    });

    it('is parsing function with if with double else if and else', () => {
        assert.equal(
            JSON.stringify(cfgParser('function f(x, y){\nlet a = x;\nif (a < 0)\nreturn 1;\nelse if (a == 0)\nreturn 2;\nelse if (a == x)\nreturn 3;\nelse\nreturn 6;\n}', 'x=1,y=0')[1]),
            '{"0":{"id":0,"type":"root","shape":"square","isFlow":true,"test":null,"assignmentArray":["a = x"],"nextTrue":2,"nextFalse":null},"2":{"id":2,"type":"if","shape":"rhombus","isFlow":true,"test":"a < 0","assignmentArray":[],"nextTrue":3,"nextFalse":4},"3":{"id":3,"type":"node","shape":"square","isFlow":false,"test":null,"assignmentArray":[],"nextTrue":6,"nextFalse":null},"4":{"id":4,"type":"node","shape":"square","isFlow":true,"test":null,"assignmentArray":[],"nextTrue":7,"nextFalse":null},"6":{"id":6,"type":"return","shape":"square","isFlow":false,"test":null,"assignmentArray":["return 1"],"nextTrue":null,"nextFalse":null},"7":{"id":7,"type":"if","shape":"rhombus","isFlow":true,"test":"a == 0","assignmentArray":[],"nextTrue":8,"nextFalse":9},"8":{"id":8,"type":"node","shape":"square","isFlow":false,"test":null,"assignmentArray":[],"nextTrue":11,"nextFalse":null},"9":{"id":9,"type":"node","shape":"square","isFlow":true,"test":null,"assignmentArray":[],"nextTrue":12,"nextFalse":null},"11":{"id":11,"type":"return","shape":"square","isFlow":false,"test":null,"assignmentArray":["return 2"],"nextTrue":null,"nextFalse":null},"12":{"id":12,"type":"if","shape":"rhombus","isFlow":true,"test":"a == x","assignmentArray":[],"nextTrue":13,"nextFalse":14},"13":{"id":13,"type":"node","shape":"square","isFlow":true,"test":null,"assignmentArray":[],"nextTrue":16,"nextFalse":null},"14":{"id":14,"type":"node","shape":"square","isFlow":false,"test":null,"assignmentArray":[],"nextTrue":17,"nextFalse":null},"16":{"id":16,"type":"return","shape":"square","isFlow":true,"test":null,"assignmentArray":["return 3"],"nextTrue":null,"nextFalse":null},"17":{"id":17,"type":"return","shape":"square","isFlow":false,"test":null,"assignmentArray":["return 6"],"nextTrue":null,"nextFalse":null}}'
        );
    });

    it('is parsing function with if inside if', () => {
        assert.equal(
            JSON.stringify(cfgParser('function f(x, y){\nlet a = x;\nif (a < 0)\nif (a < y)\nreturn y;\nelse if (a == 0)\nreturn 2;\nelse if (a == x)\nreturn 3;\nelse\nreturn 6;\n}', 'x=1,y=0')[1]),
            '{"0":{"id":0,"type":"root","shape":"square","isFlow":true,"test":null,"assignmentArray":["a = x"],"nextTrue":2,"nextFalse":null},"2":{"id":2,"type":"if","shape":"rhombus","isFlow":true,"test":"a < 0","assignmentArray":[],"nextTrue":3,"nextFalse":4},"3":{"id":3,"type":"node","shape":"square","isFlow":false,"test":null,"assignmentArray":[],"nextTrue":6,"nextFalse":null},"4":{"id":4,"type":"node","shape":"square","isFlow":true,"test":null,"assignmentArray":[],"nextTrue":5,"nextFalse":null},"5":{"id":5,"type":"node","shape":"circle","isFlow":true,"test":null,"assignmentArray":[],"nextTrue":null,"nextFalse":null},"6":{"id":6,"type":"if","shape":"rhombus","isFlow":false,"test":"a < y","assignmentArray":[],"nextTrue":7,"nextFalse":8},"7":{"id":7,"type":"node","shape":"square","isFlow":false,"test":null,"assignmentArray":[],"nextTrue":10,"nextFalse":null},"8":{"id":8,"type":"node","shape":"square","isFlow":false,"test":null,"assignmentArray":[],"nextTrue":11,"nextFalse":null},"10":{"id":10,"type":"return","shape":"square","isFlow":false,"test":null,"assignmentArray":["return y"],"nextTrue":null,"nextFalse":null},"11":{"id":11,"type":"if","shape":"rhombus","isFlow":false,"test":"a == 0","assignmentArray":[],"nextTrue":12,"nextFalse":13},"12":{"id":12,"type":"node","shape":"square","isFlow":false,"test":null,"assignmentArray":[],"nextTrue":15,"nextFalse":null},"13":{"id":13,"type":"node","shape":"square","isFlow":false,"test":null,"assignmentArray":[],"nextTrue":16,"nextFalse":null},"15":{"id":15,"type":"return","shape":"square","isFlow":false,"test":null,"assignmentArray":["return 2"],"nextTrue":null,"nextFalse":null},"16":{"id":16,"type":"if","shape":"rhombus","isFlow":false,"test":"a == x","assignmentArray":[],"nextTrue":17,"nextFalse":18},"17":{"id":17,"type":"node","shape":"square","isFlow":false,"test":null,"assignmentArray":[],"nextTrue":20,"nextFalse":null},"18":{"id":18,"type":"node","shape":"square","isFlow":false,"test":null,"assignmentArray":[],"nextTrue":21,"nextFalse":null},"20":{"id":20,"type":"return","shape":"square","isFlow":false,"test":null,"assignmentArray":["return 3"],"nextTrue":null,"nextFalse":null},"21":{"id":21,"type":"return","shape":"square","isFlow":false,"test":null,"assignmentArray":["return 6"],"nextTrue":null,"nextFalse":null}}'
        );
    });

    it('is parsing function with if inside if complicated', () => {
        assert.equal(
            JSON.stringify(cfgParser('function f(x, y){\nlet a = x;\nif (a < 0) {\nif (a < y)\nreturn y;\n} else if (a == 0)\nreturn 2;\nelse if (a == x)\nreturn 3;\nelse\nreturn 6;\n}', 'x=1,y=0')[1]),
            '{"0":{"id":0,"type":"root","shape":"square","isFlow":true,"test":null,"assignmentArray":["a = x"],"nextTrue":2,"nextFalse":null},"2":{"id":2,"type":"if","shape":"rhombus","isFlow":true,"test":"a < 0","assignmentArray":[],"nextTrue":3,"nextFalse":4},"3":{"id":3,"type":"node","shape":"square","isFlow":false,"test":null,"assignmentArray":[],"nextTrue":6,"nextFalse":null},"4":{"id":4,"type":"node","shape":"square","isFlow":true,"test":null,"assignmentArray":[],"nextTrue":11,"nextFalse":null},"5":{"id":5,"type":"node","shape":"circle","isFlow":true,"test":null,"assignmentArray":[],"nextTrue":null,"nextFalse":null},"6":{"id":6,"type":"if","shape":"rhombus","isFlow":false,"test":"a < y","assignmentArray":[],"nextTrue":7,"nextFalse":8},"7":{"id":7,"type":"node","shape":"square","isFlow":false,"test":null,"assignmentArray":[],"nextTrue":10,"nextFalse":null},"8":{"id":8,"type":"node","shape":"square","isFlow":false,"test":null,"assignmentArray":[],"nextTrue":9,"nextFalse":null},"9":{"id":9,"type":"node","shape":"circle","isFlow":false,"test":null,"assignmentArray":[],"nextTrue":5,"nextFalse":null},"10":{"id":10,"type":"return","shape":"square","isFlow":false,"test":null,"assignmentArray":["return y"],"nextTrue":null,"nextFalse":null},"11":{"id":11,"type":"if","shape":"rhombus","isFlow":true,"test":"a == 0","assignmentArray":[],"nextTrue":12,"nextFalse":13},"12":{"id":12,"type":"node","shape":"square","isFlow":false,"test":null,"assignmentArray":[],"nextTrue":15,"nextFalse":null},"13":{"id":13,"type":"node","shape":"square","isFlow":true,"test":null,"assignmentArray":[],"nextTrue":16,"nextFalse":null},"15":{"id":15,"type":"return","shape":"square","isFlow":false,"test":null,"assignmentArray":["return 2"],"nextTrue":null,"nextFalse":null},"16":{"id":16,"type":"if","shape":"rhombus","isFlow":true,"test":"a == x","assignmentArray":[],"nextTrue":17,"nextFalse":18},"17":{"id":17,"type":"node","shape":"square","isFlow":true,"test":null,"assignmentArray":[],"nextTrue":20,"nextFalse":null},"18":{"id":18,"type":"node","shape":"square","isFlow":false,"test":null,"assignmentArray":[],"nextTrue":21,"nextFalse":null},"20":{"id":20,"type":"return","shape":"square","isFlow":true,"test":null,"assignmentArray":["return 3"],"nextTrue":null,"nextFalse":null},"21":{"id":21,"type":"return","shape":"square","isFlow":false,"test":null,"assignmentArray":["return 6"],"nextTrue":null,"nextFalse":null}}'
        );
    });

    it('is parsing function with if inside if complicated 2', () => {
        assert.equal(
            JSON.stringify(cfgParser('function f(x, y){\nlet a = x;\nif (a < 0) {\nif (a < y)\nreturn y;\n} else if (a == 0)\nreturn 2;\nelse if (a == x) {\nif (y > -1)\nreturn y;\nelse if (y < 10)\nreturn y + x;\nelse\nreturn 0;\n} else\nreturn 6;\n}', 'x=1,y=0')[1]),
            '{"0":{"id":0,"type":"root","shape":"square","isFlow":true,"test":null,"assignmentArray":["a = x"],"nextTrue":2,"nextFalse":null},"2":{"id":2,"type":"if","shape":"rhombus","isFlow":true,"test":"a < 0","assignmentArray":[],"nextTrue":3,"nextFalse":4},"3":{"id":3,"type":"node","shape":"square","isFlow":false,"test":null,"assignmentArray":[],"nextTrue":6,"nextFalse":null},"4":{"id":4,"type":"node","shape":"square","isFlow":true,"test":null,"assignmentArray":[],"nextTrue":11,"nextFalse":null},"5":{"id":5,"type":"node","shape":"circle","isFlow":true,"test":null,"assignmentArray":[],"nextTrue":null,"nextFalse":null},"6":{"id":6,"type":"if","shape":"rhombus","isFlow":false,"test":"a < y","assignmentArray":[],"nextTrue":7,"nextFalse":8},"7":{"id":7,"type":"node","shape":"square","isFlow":false,"test":null,"assignmentArray":[],"nextTrue":10,"nextFalse":null},"8":{"id":8,"type":"node","shape":"square","isFlow":false,"test":null,"assignmentArray":[],"nextTrue":9,"nextFalse":null},"9":{"id":9,"type":"node","shape":"circle","isFlow":false,"test":null,"assignmentArray":[],"nextTrue":5,"nextFalse":null},"10":{"id":10,"type":"return","shape":"square","isFlow":false,"test":null,"assignmentArray":["return y"],"nextTrue":null,"nextFalse":null},"11":{"id":11,"type":"if","shape":"rhombus","isFlow":true,"test":"a == 0","assignmentArray":[],"nextTrue":12,"nextFalse":13},"12":{"id":12,"type":"node","shape":"square","isFlow":false,"test":null,"assignmentArray":[],"nextTrue":15,"nextFalse":null},"13":{"id":13,"type":"node","shape":"square","isFlow":true,"test":null,"assignmentArray":[],"nextTrue":16,"nextFalse":null},"15":{"id":15,"type":"return","shape":"square","isFlow":false,"test":null,"assignmentArray":["return 2"],"nextTrue":null,"nextFalse":null},"16":{"id":16,"type":"if","shape":"rhombus","isFlow":true,"test":"a == x","assignmentArray":[],"nextTrue":17,"nextFalse":18},"17":{"id":17,"type":"node","shape":"square","isFlow":true,"test":null,"assignmentArray":[],"nextTrue":20,"nextFalse":null},"18":{"id":18,"type":"node","shape":"square","isFlow":false,"test":null,"assignmentArray":[],"nextTrue":31,"nextFalse":null},"20":{"id":20,"type":"if","shape":"rhombus","isFlow":true,"test":"y > -1","assignmentArray":[],"nextTrue":21,"nextFalse":22},"21":{"id":21,"type":"node","shape":"square","isFlow":true,"test":null,"assignmentArray":[],"nextTrue":24,"nextFalse":null},"22":{"id":22,"type":"node","shape":"square","isFlow":false,"test":null,"assignmentArray":[],"nextTrue":25,"nextFalse":null},"24":{"id":24,"type":"return","shape":"square","isFlow":true,"test":null,"assignmentArray":["return y"],"nextTrue":null,"nextFalse":null},"25":{"id":25,"type":"if","shape":"rhombus","isFlow":false,"test":"y < 10","assignmentArray":[],"nextTrue":26,"nextFalse":27},"26":{"id":26,"type":"node","shape":"square","isFlow":false,"test":null,"assignmentArray":[],"nextTrue":29,"nextFalse":null},"27":{"id":27,"type":"node","shape":"square","isFlow":false,"test":null,"assignmentArray":[],"nextTrue":30,"nextFalse":null},"29":{"id":29,"type":"return","shape":"square","isFlow":false,"test":null,"assignmentArray":["return y + x"],"nextTrue":null,"nextFalse":null},"30":{"id":30,"type":"return","shape":"square","isFlow":false,"test":null,"assignmentArray":["return 0"],"nextTrue":null,"nextFalse":null},"31":{"id":31,"type":"return","shape":"square","isFlow":false,"test":null,"assignmentArray":["return 6"],"nextTrue":null,"nextFalse":null}}'
        );
    });

    it('is parsing function with while', () => {
        assert.equal(
            JSON.stringify(cfgParser('function f(x, y){\nlet a = x;\nwhile (x != a)\nreturn 1;\n}', 'x=1,y=0')[1]),
            '{"0":{"id":0,"type":"root","shape":"square","isFlow":true,"test":null,"assignmentArray":["a = x"],"nextTrue":2,"nextFalse":null},"2":{"id":2,"type":"node","shape":"square","isFlow":true,"test":null,"assignmentArray":["NULL"],"nextTrue":3,"nextFalse":null},"3":{"id":3,"type":"while","shape":"rhombus","isFlow":true,"test":"x != a","assignmentArray":[],"nextTrue":4,"nextFalse":5},"4":{"id":4,"type":"node","shape":"square","isFlow":false,"test":null,"assignmentArray":[],"nextTrue":6,"nextFalse":null},"5":{"id":5,"type":"node","shape":"square","isFlow":true,"test":null,"assignmentArray":[],"nextTrue":null,"nextFalse":null},"6":{"id":6,"type":"return","shape":"square","isFlow":false,"test":null,"assignmentArray":["return 1"],"nextTrue":null,"nextFalse":null}}'
        );
    });

    it('is parsing function with two whiles', () => {
        assert.equal(
            JSON.stringify(cfgParser('function f(x, y){\nlet a = x;\nwhile (x == a)\nreturn 1;\na = y;\nwhile (x == a)\nreturn 2;\n}', 'x=1,y=0')[1]),
            '{"0":{"id":0,"type":"root","shape":"square","isFlow":true,"test":null,"assignmentArray":["a = x"],"nextTrue":2,"nextFalse":null},"2":{"id":2,"type":"node","shape":"square","isFlow":true,"test":null,"assignmentArray":["NULL"],"nextTrue":3,"nextFalse":null},"3":{"id":3,"type":"while","shape":"rhombus","isFlow":true,"test":"x == a","assignmentArray":[],"nextTrue":4,"nextFalse":5},"4":{"id":4,"type":"node","shape":"square","isFlow":true,"test":null,"assignmentArray":[],"nextTrue":6,"nextFalse":null},"5":{"id":5,"type":"node","shape":"square","isFlow":false,"test":null,"assignmentArray":[],"nextTrue":7,"nextFalse":null},"6":{"id":6,"type":"return","shape":"square","isFlow":true,"test":null,"assignmentArray":["return 1"],"nextTrue":null,"nextFalse":null},"7":{"id":7,"type":"node","shape":"square","isFlow":true,"test":null,"assignmentArray":["a = y"],"nextTrue":8,"nextFalse":null},"8":{"id":8,"type":"node","shape":"square","isFlow":true,"test":null,"assignmentArray":["NULL"],"nextTrue":9,"nextFalse":null},"9":{"id":9,"type":"while","shape":"rhombus","isFlow":true,"test":"x == a","assignmentArray":[],"nextTrue":10,"nextFalse":11},"10":{"id":10,"type":"node","shape":"square","isFlow":true,"test":null,"assignmentArray":[],"nextTrue":12,"nextFalse":null},"11":{"id":11,"type":"node","shape":"square","isFlow":false,"test":null,"assignmentArray":[],"nextTrue":null,"nextFalse":null},"12":{"id":12,"type":"return","shape":"square","isFlow":true,"test":null,"assignmentArray":["return 2"],"nextTrue":null,"nextFalse":null}}'
        );
    });

    it('is parsing function with while inside while', () => {
        assert.equal(
            JSON.stringify(cfgParser('function f(x, y){\nlet a = x;\nwhile (x == a)\nwhile (x == a)\nreturn 2;\n}', 'x=1,y=0')[1]),
            '{"0":{"id":0,"type":"root","shape":"square","isFlow":true,"test":null,"assignmentArray":["a = x"],"nextTrue":2,"nextFalse":null},"2":{"id":2,"type":"node","shape":"square","isFlow":true,"test":null,"assignmentArray":["NULL"],"nextTrue":3,"nextFalse":null},"3":{"id":3,"type":"while","shape":"rhombus","isFlow":true,"test":"x == a","assignmentArray":[],"nextTrue":4,"nextFalse":5},"4":{"id":4,"type":"node","shape":"square","isFlow":true,"test":null,"assignmentArray":[],"nextTrue":6,"nextFalse":null},"6":{"id":6,"type":"node","shape":"square","isFlow":true,"test":null,"assignmentArray":["NULL"],"nextTrue":7,"nextFalse":null},"7":{"id":7,"type":"while","shape":"rhombus","isFlow":true,"test":"x == a","assignmentArray":[],"nextTrue":8,"nextFalse":9},"8":{"id":8,"type":"node","shape":"square","isFlow":true,"test":null,"assignmentArray":[],"nextTrue":10,"nextFalse":null},"9":{"id":9,"type":"node","shape":"square","isFlow":false,"test":null,"assignmentArray":[],"nextTrue":2,"nextFalse":null},"10":{"id":10,"type":"return","shape":"square","isFlow":true,"test":null,"assignmentArray":["return 2"],"nextTrue":null,"nextFalse":null}}'
        );
    });

    it('is parsing function with if after if', () => {
        assert.equal(
            JSON.stringify(cfgParser('function f(x, y){\nlet a = x;\nif (x > y)\nreturn x;\nif (y > x)\nreturn y;\n}', 'x=1,y=0')[1]),
            '{"0":{"id":0,"type":"root","shape":"square","isFlow":true,"test":null,"assignmentArray":["a = x"],"nextTrue":2,"nextFalse":null},"2":{"id":2,"type":"if","shape":"rhombus","isFlow":true,"test":"x > y","assignmentArray":[],"nextTrue":3,"nextFalse":4},"3":{"id":3,"type":"node","shape":"square","isFlow":true,"test":null,"assignmentArray":[],"nextTrue":6,"nextFalse":null},"4":{"id":4,"type":"node","shape":"square","isFlow":false,"test":null,"assignmentArray":[],"nextTrue":5,"nextFalse":null},"5":{"id":5,"type":"node","shape":"circle","isFlow":true,"test":null,"assignmentArray":[],"nextTrue":7,"nextFalse":null},"6":{"id":6,"type":"return","shape":"square","isFlow":true,"test":null,"assignmentArray":["return x"],"nextTrue":null,"nextFalse":null},"7":{"id":7,"type":"node","shape":"square","isFlow":true,"test":null,"assignmentArray":[],"nextTrue":8,"nextFalse":null},"8":{"id":8,"type":"if","shape":"rhombus","isFlow":true,"test":"y > x","assignmentArray":[],"nextTrue":9,"nextFalse":10},"9":{"id":9,"type":"node","shape":"square","isFlow":false,"test":null,"assignmentArray":[],"nextTrue":12,"nextFalse":null},"10":{"id":10,"type":"node","shape":"square","isFlow":true,"test":null,"assignmentArray":[],"nextTrue":11,"nextFalse":null},"11":{"id":11,"type":"node","shape":"circle","isFlow":true,"test":null,"assignmentArray":[],"nextTrue":null,"nextFalse":null},"12":{"id":12,"type":"return","shape":"square","isFlow":false,"test":null,"assignmentArray":["return y"],"nextTrue":null,"nextFalse":null}}'
        );
    });

    it('is parsing function with if inside while', () => {
        assert.equal(
            JSON.stringify(cfgParser('function f(x, y){\nlet a = x;\nwhile (x == a)\nif (x == a)\nreturn 2;\n}', 'x=1,y=0')[1]),
            '{"0":{"id":0,"type":"root","shape":"square","isFlow":true,"test":null,"assignmentArray":["a = x"],"nextTrue":2,"nextFalse":null},"2":{"id":2,"type":"node","shape":"square","isFlow":true,"test":null,"assignmentArray":["NULL"],"nextTrue":3,"nextFalse":null},"3":{"id":3,"type":"while","shape":"rhombus","isFlow":true,"test":"x == a","assignmentArray":[],"nextTrue":4,"nextFalse":5},"4":{"id":4,"type":"node","shape":"square","isFlow":true,"test":null,"assignmentArray":[],"nextTrue":6,"nextFalse":null},"6":{"id":6,"type":"if","shape":"rhombus","isFlow":true,"test":"x == a","assignmentArray":[],"nextTrue":7,"nextFalse":8},"7":{"id":7,"type":"node","shape":"square","isFlow":true,"test":null,"assignmentArray":[],"nextTrue":10,"nextFalse":null},"8":{"id":8,"type":"node","shape":"square","isFlow":false,"test":null,"assignmentArray":[],"nextTrue":9,"nextFalse":null},"9":{"id":9,"type":"node","shape":"circle","isFlow":true,"test":null,"assignmentArray":[],"nextTrue":2,"nextFalse":null},"10":{"id":10,"type":"return","shape":"square","isFlow":true,"test":null,"assignmentArray":["return 2"],"nextTrue":null,"nextFalse":null}}'
        );
    });

    it('is parsing function with while inside if', () => {
        assert.equal(
            JSON.stringify(cfgParser('function f(x, y){\nlet a = x;\nif (x != a)\nwhile (x == a)\nreturn 2;\n}', 'x=1,y=0')[1]),
            '{"0":{"id":0,"type":"root","shape":"square","isFlow":true,"test":null,"assignmentArray":["a = x"],"nextTrue":2,"nextFalse":null},"2":{"id":2,"type":"if","shape":"rhombus","isFlow":true,"test":"x != a","assignmentArray":[],"nextTrue":3,"nextFalse":4},"3":{"id":3,"type":"node","shape":"square","isFlow":false,"test":null,"assignmentArray":[],"nextTrue":6,"nextFalse":null},"4":{"id":4,"type":"node","shape":"square","isFlow":true,"test":null,"assignmentArray":[],"nextTrue":5,"nextFalse":null},"5":{"id":5,"type":"node","shape":"circle","isFlow":true,"test":null,"assignmentArray":[],"nextTrue":null,"nextFalse":null},"6":{"id":6,"type":"node","shape":"square","isFlow":false,"test":null,"assignmentArray":["NULL"],"nextTrue":7,"nextFalse":null},"7":{"id":7,"type":"while","shape":"rhombus","isFlow":false,"test":"x == a","assignmentArray":[],"nextTrue":8,"nextFalse":9},"8":{"id":8,"type":"node","shape":"square","isFlow":false,"test":null,"assignmentArray":[],"nextTrue":10,"nextFalse":null},"9":{"id":9,"type":"node","shape":"square","isFlow":true,"test":null,"assignmentArray":[],"nextTrue":5,"nextFalse":null},"10":{"id":10,"type":"return","shape":"square","isFlow":false,"test":null,"assignmentArray":["return 2"],"nextTrue":null,"nextFalse":null}}'
        );
    });

    it('is parsing function with strings as args', () => {
        assert.equal(
            JSON.stringify(cfgParser('function f(x, y){\nlet a = x;\nif (\'hello\' == a)\nwhile (x == a)\nreturn 2;\n}', 'x="hello",y=0')[1]),
            '{"0":{"id":0,"type":"root","shape":"square","isFlow":true,"test":null,"assignmentArray":["a = x"],"nextTrue":2,"nextFalse":null},"2":{"id":2,"type":"if","shape":"rhombus","isFlow":true,"test":"\'hello\' == a","assignmentArray":[],"nextTrue":3,"nextFalse":4},"3":{"id":3,"type":"node","shape":"square","isFlow":true,"test":null,"assignmentArray":[],"nextTrue":6,"nextFalse":null},"4":{"id":4,"type":"node","shape":"square","isFlow":false,"test":null,"assignmentArray":[],"nextTrue":5,"nextFalse":null},"5":{"id":5,"type":"node","shape":"circle","isFlow":true,"test":null,"assignmentArray":[],"nextTrue":null,"nextFalse":null},"6":{"id":6,"type":"node","shape":"square","isFlow":true,"test":null,"assignmentArray":["NULL"],"nextTrue":7,"nextFalse":null},"7":{"id":7,"type":"while","shape":"rhombus","isFlow":true,"test":"x == a","assignmentArray":[],"nextTrue":8,"nextFalse":9},"8":{"id":8,"type":"node","shape":"square","isFlow":true,"test":null,"assignmentArray":[],"nextTrue":10,"nextFalse":null},"9":{"id":9,"type":"node","shape":"square","isFlow":false,"test":null,"assignmentArray":[],"nextTrue":5,"nextFalse":null},"10":{"id":10,"type":"return","shape":"square","isFlow":true,"test":null,"assignmentArray":["return 2"],"nextTrue":null,"nextFalse":null}}'
        );
    });

    it('is parsing function with strings as args 2', () => {
        assert.equal(
            JSON.stringify(cfgParser('function f(x, y){\nlet a = x;\nif (\'bye bye\' == a)\nwhile (x == a)\nreturn 2;\n}', 'x="hello",y=0')[1]),
            '{"0":{"id":0,"type":"root","shape":"square","isFlow":true,"test":null,"assignmentArray":["a = x"],"nextTrue":2,"nextFalse":null},"2":{"id":2,"type":"if","shape":"rhombus","isFlow":true,"test":"\'bye bye\' == a","assignmentArray":[],"nextTrue":3,"nextFalse":4},"3":{"id":3,"type":"node","shape":"square","isFlow":false,"test":null,"assignmentArray":[],"nextTrue":6,"nextFalse":null},"4":{"id":4,"type":"node","shape":"square","isFlow":true,"test":null,"assignmentArray":[],"nextTrue":5,"nextFalse":null},"5":{"id":5,"type":"node","shape":"circle","isFlow":true,"test":null,"assignmentArray":[],"nextTrue":null,"nextFalse":null},"6":{"id":6,"type":"node","shape":"square","isFlow":false,"test":null,"assignmentArray":["NULL"],"nextTrue":7,"nextFalse":null},"7":{"id":7,"type":"while","shape":"rhombus","isFlow":false,"test":"x == a","assignmentArray":[],"nextTrue":8,"nextFalse":9},"8":{"id":8,"type":"node","shape":"square","isFlow":false,"test":null,"assignmentArray":[],"nextTrue":10,"nextFalse":null},"9":{"id":9,"type":"node","shape":"square","isFlow":true,"test":null,"assignmentArray":[],"nextTrue":5,"nextFalse":null},"10":{"id":10,"type":"return","shape":"square","isFlow":false,"test":null,"assignmentArray":["return 2"],"nextTrue":null,"nextFalse":null}}'
        );
    });

    it('is parsing function with true as args', () => {
        assert.equal(
            JSON.stringify(cfgParser('function f(x, y){\nlet a = x;\nif (a)\nwhile (y)\nreturn 2;\n}', 'x=true,y=false')[1]),
            '{"0":{"id":0,"type":"root","shape":"square","isFlow":true,"test":null,"assignmentArray":["a = x"],"nextTrue":2,"nextFalse":null},"2":{"id":2,"type":"if","shape":"rhombus","isFlow":true,"test":"a","assignmentArray":[],"nextTrue":3,"nextFalse":4},"3":{"id":3,"type":"node","shape":"square","isFlow":true,"test":null,"assignmentArray":[],"nextTrue":6,"nextFalse":null},"4":{"id":4,"type":"node","shape":"square","isFlow":false,"test":null,"assignmentArray":[],"nextTrue":5,"nextFalse":null},"5":{"id":5,"type":"node","shape":"circle","isFlow":true,"test":null,"assignmentArray":[],"nextTrue":null,"nextFalse":null},"6":{"id":6,"type":"node","shape":"square","isFlow":true,"test":null,"assignmentArray":["NULL"],"nextTrue":7,"nextFalse":null},"7":{"id":7,"type":"while","shape":"rhombus","isFlow":true,"test":"y","assignmentArray":[],"nextTrue":8,"nextFalse":9},"8":{"id":8,"type":"node","shape":"square","isFlow":false,"test":null,"assignmentArray":[],"nextTrue":10,"nextFalse":null},"9":{"id":9,"type":"node","shape":"square","isFlow":true,"test":null,"assignmentArray":[],"nextTrue":5,"nextFalse":null},"10":{"id":10,"type":"return","shape":"square","isFlow":false,"test":null,"assignmentArray":["return 2"],"nextTrue":null,"nextFalse":null}}'
        );
    });

    it('is parsing function with false as args', () => {
        assert.equal(
            JSON.stringify(cfgParser('function f(x, y){\nlet a = x;\nif (a)\nwhile (y)\nreturn 2;\n}', 'x=false,y=true')[1]),
            '{"0":{"id":0,"type":"root","shape":"square","isFlow":true,"test":null,"assignmentArray":["a = x"],"nextTrue":2,"nextFalse":null},"2":{"id":2,"type":"if","shape":"rhombus","isFlow":true,"test":"a","assignmentArray":[],"nextTrue":3,"nextFalse":4},"3":{"id":3,"type":"node","shape":"square","isFlow":false,"test":null,"assignmentArray":[],"nextTrue":6,"nextFalse":null},"4":{"id":4,"type":"node","shape":"square","isFlow":true,"test":null,"assignmentArray":[],"nextTrue":5,"nextFalse":null},"5":{"id":5,"type":"node","shape":"circle","isFlow":true,"test":null,"assignmentArray":[],"nextTrue":null,"nextFalse":null},"6":{"id":6,"type":"node","shape":"square","isFlow":false,"test":null,"assignmentArray":["NULL"],"nextTrue":7,"nextFalse":null},"7":{"id":7,"type":"while","shape":"rhombus","isFlow":false,"test":"y","assignmentArray":[],"nextTrue":8,"nextFalse":9},"8":{"id":8,"type":"node","shape":"square","isFlow":false,"test":null,"assignmentArray":[],"nextTrue":10,"nextFalse":null},"9":{"id":9,"type":"node","shape":"square","isFlow":true,"test":null,"assignmentArray":[],"nextTrue":5,"nextFalse":null},"10":{"id":10,"type":"return","shape":"square","isFlow":false,"test":null,"assignmentArray":["return 2"],"nextTrue":null,"nextFalse":null}}'
        );
    });

    it('is parsing function with logical expression', () => {
        assert.equal(
            JSON.stringify(cfgParser('function f(x, y){\n' +
                'if (x == 1 && y)\n' +
                'return x + 1;\n' +
                '}', 'x=1,y=true')[1]),
            '{"0":{"id":0,"type":"root","shape":"square","isFlow":true,"test":null,"assignmentArray":[],"nextTrue":2,"nextFalse":null},"2":{"id":2,"type":"if","shape":"rhombus","isFlow":true,"test":"x == 1 && y","assignmentArray":[],"nextTrue":3,"nextFalse":4},"3":{"id":3,"type":"node","shape":"square","isFlow":true,"test":null,"assignmentArray":[],"nextTrue":6,"nextFalse":null},"4":{"id":4,"type":"node","shape":"square","isFlow":false,"test":null,"assignmentArray":[],"nextTrue":5,"nextFalse":null},"5":{"id":5,"type":"node","shape":"circle","isFlow":true,"test":null,"assignmentArray":[],"nextTrue":null,"nextFalse":null},"6":{"id":6,"type":"return","shape":"square","isFlow":true,"test":null,"assignmentArray":["return x + 1"],"nextTrue":null,"nextFalse":null}}'
        );
    });

    it('is parsing function with update', () => {
        assert.equal(
            JSON.stringify(cfgParser('function f(x){\nlet a = x;\na++;\n};', 'x=1')[1]),
            '{"0":{"id":0,"type":"root","shape":"square","isFlow":true,"test":null,"assignmentArray":["a = x","a++"],"nextTrue":null,"nextFalse":null}}'
        );
    });

    it('is parsing function with member expression', () => {
        assert.equal(
            JSON.stringify(cfgParser('function f(x){\nlet a = [1,2];\n}', 'x=1')[1]),
            '{"0":{"id":0,"type":"root","shape":"square","isFlow":true,"test":null,"assignmentArray":["a = [1,2]"],"nextTrue":null,"nextFalse":null}}'
        );
    });

    it('is parsing function with member expression 2', () => {
        assert.equal(
            JSON.stringify(cfgParser('function f(x){\nlet a = x[1];\n}', 'x=[1,2]')[1]),
            '{"0":{"id":0,"type":"root","shape":"square","isFlow":true,"test":null,"assignmentArray":["a = x[1]"],"nextTrue":null,"nextFalse":null}}'
        );
    });

    it('is parsing function with let if let', () => {
        assert.equal(
            JSON.stringify(cfgParser('function f(x){\nlet a = 1;\nif (a > x) {\nreturn true;\n}\nlet b = 2;\n}', 'x=1')[1]),
            '{"0":{"id":0,"type":"root","shape":"square","isFlow":true,"test":null,"assignmentArray":["a = 1"],"nextTrue":2,"nextFalse":null},"2":{"id":2,"type":"if","shape":"rhombus","isFlow":true,"test":"a > x","assignmentArray":[],"nextTrue":3,"nextFalse":4},"3":{"id":3,"type":"node","shape":"square","isFlow":false,"test":null,"assignmentArray":[],"nextTrue":6,"nextFalse":null},"4":{"id":4,"type":"node","shape":"square","isFlow":true,"test":null,"assignmentArray":[],"nextTrue":5,"nextFalse":null},"5":{"id":5,"type":"node","shape":"circle","isFlow":true,"test":null,"assignmentArray":[],"nextTrue":7,"nextFalse":null},"6":{"id":6,"type":"return","shape":"square","isFlow":false,"test":null,"assignmentArray":["return true"],"nextTrue":null,"nextFalse":null},"7":{"id":7,"type":"node","shape":"square","isFlow":true,"test":null,"assignmentArray":["b = 2"],"nextTrue":null,"nextFalse":null}}'
        );
    });

    it('is parsing function not flow in new block', () => {
        assert.equal(
            JSON.stringify(cfgParser('function f(x){\nlet a = 1;\nif (a > x) {\nlet b = 4;\nif (a > x) {\nreturn true;\n}\nlet c = 5;\n}\nlet b = 2;\n}', 'x=3')[1]),
            '{"0":{"id":0,"type":"root","shape":"square","isFlow":true,"test":null,"assignmentArray":["a = 1"],"nextTrue":2,"nextFalse":null},"2":{"id":2,"type":"if","shape":"rhombus","isFlow":true,"test":"a > x","assignmentArray":[],"nextTrue":3,"nextFalse":4},"3":{"id":3,"type":"node","shape":"square","isFlow":false,"test":null,"assignmentArray":["b = 4"],"nextTrue":6,"nextFalse":null},"4":{"id":4,"type":"node","shape":"square","isFlow":true,"test":null,"assignmentArray":[],"nextTrue":5,"nextFalse":null},"5":{"id":5,"type":"node","shape":"circle","isFlow":true,"test":null,"assignmentArray":[],"nextTrue":12,"nextFalse":null},"6":{"id":6,"type":"if","shape":"rhombus","isFlow":false,"test":"a > x","assignmentArray":[],"nextTrue":7,"nextFalse":8},"7":{"id":7,"type":"node","shape":"square","isFlow":false,"test":null,"assignmentArray":[],"nextTrue":10,"nextFalse":null},"8":{"id":8,"type":"node","shape":"square","isFlow":false,"test":null,"assignmentArray":[],"nextTrue":9,"nextFalse":null},"9":{"id":9,"type":"node","shape":"circle","isFlow":false,"test":null,"assignmentArray":[],"nextTrue":11,"nextFalse":null},"10":{"id":10,"type":"return","shape":"square","isFlow":false,"test":null,"assignmentArray":["return true"],"nextTrue":null,"nextFalse":null},"11":{"id":11,"type":"node","shape":"square","isFlow":false,"test":null,"assignmentArray":["c = 5"],"nextTrue":5,"nextFalse":null},"12":{"id":12,"type":"node","shape":"square","isFlow":true,"test":null,"assignmentArray":["b = 2"],"nextTrue":null,"nextFalse":null}}'
        );
    });

    it('is parsing node', () => {
        let node = new Node(0, 'node', 'square');
        assert.equal(
            node.toString(),
            '0[" "]'
        );
    });

    it('is parsing node with assignments', () => {
        let node = new Node(0, 'node', 'square');
        node.assignmentsArray.push('1');
        node.assignmentsArray.push('2');
        assert.equal(
            node.toString(),
            '0["1<br/>2"]'
        );
    });

    it('is parsing if node', () => {
        let node = new Node(0, 'if', 'rhombus');
        assert.equal(
            node.toString(),
            '0{"null"}'
        );
    });

    it('is parsing while node', () => {
        let node = new Node(0, 'while', 'rhombus');
        assert.equal(
            node.toString(),
            '0{"null"}'
        );
    });

    it('is parsing circle node', () => {
        let node = new Node(0, 'node', 'circle');
        assert.equal(
            node.toString(),
            '0((" "))'
        );
    });

    it('is parsing node for null next true', () => {
        let node = new Node(0, 'node', 'square');
        assert.equal(
            node.getLineTextOfNextTrue(),
            ''
        );
    });

    it('is parsing node for null next false', () => {
        let node = new Node(0, 'node', 'square');
        assert.equal(
            node.getLineTextOfNextFalse(),
            ''
        );
    });

    it('is parsing node for next true', () => {
        let node = new Node(0, 'node', 'square');
        node.nextFalse = '1';
        node.nextTrue = '2';
        assert.equal(
            node.getLineTextOfNextTrue(),
            '|T|'
        );
    });

    it('is parsing node for next false', () => {
        let node = new Node(0, 'node', 'square');
        node.nextTrue = '1';
        assert.equal(
            node.getLineTextOfNextFalse(),
            '|F|'
        );
    });

});