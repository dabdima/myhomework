//"use strict";




console.log("задача №1:");//========================================
var initArr = [],
    initArrNum = 20;

for (i = 0; i < initArrNum; i++) {
    initArr[i] = Math.floor(Math.random()*(50+50+1)) - 50;
}
//console.log(initArr);

var arr = initArr.filter(function (item) {
    if ((item <= 10) && (item >= -10))
        return item;
});
console.log(arr);

console.log("задача №2:");//========================================
var initArr1 = [],
    initArrNum1 = 30;

for (i = 1; i < (initArrNum1 + 1); i++) {
    initArr1.push(i);
}
//console.log(initArr1);

var arr1 = [];
initArr1.forEach(function (item) {
    if ((item % 3 === 0) && (item % 5 === 0)){
        arr1.push('AB');
    } else

    if (item % 3 === 0){
        arr1.push('A');
    } else

    if (item % 5 === 0){
        arr1.push('B');
    } else
        arr1.push(item);
});
console.log(arr1);

console.log("задача №3:");//========================================

function testFunc() {
    if (arguments[3] !== undefined) {
        console.log(arguments[0] + arguments[1] + arguments[2] + arguments[3]);
    } else
    if (arguments[2] !== undefined) {
        console.log(arguments[0] * arguments[1] * arguments[2]);
    } else
        console.log(Math.pow(arguments[0], arguments[1]));
}

console.log("пример:");
testFunc(2,3);
testFunc(5,4,2);
testFunc(7,4,9,11);
