function MyMathModule(global) {
    "use asm";
    var exp = global.Math.exp;
    function doubleExp(value) {
        value = +value;
        return +(+exp(+value) * 2.0);
    }
    return { doubleExp: doubleExp };
}
