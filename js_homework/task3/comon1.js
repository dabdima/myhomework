//"use strict";

function reverse(num) {
	var temp,
		numArr = (num.toString().split(''));
	for (i = 0; i < (numArr.length / 2); i++) {
		temp = numArr[i];
		numArr[i] = numArr[numArr.length - 1 - i];
		numArr[numArr.length - 1 - i] = temp;
	}

	numArr = numArr.join("");
	return Number(numArr);
}


console.log("пример:");

console.log(reverse(57869));
console.log(reverse(4058));


