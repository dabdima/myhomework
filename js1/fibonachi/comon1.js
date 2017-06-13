//"use strict";

//раз нужен ряд чисел, то решил вернуть массыв
function fib(n) {

	var arr = [],
		calcFibonachi = function(x){
			if (x > 1) {
				return calcFibonachi(x - 1) + calcFibonachi(x - 2);
			}
			else {
				return x;
			}
		};
	for (var i = 0; i < n; i++) {
		arr.push(calcFibonachi(i));
	}
	return arr;
}

document.write("пример: ");
console.log("пример: ");

document.write(fib(20));
console.log(fib(20));