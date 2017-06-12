//"use strict";


function checkYear(year) {
	var now = new Date();
	now.setFullYear(year);
	now.setMonth(1);
	now.setDate(29);
	if (now.getDate() === 29) 
		return true
	else
		return false;
}


console.log("пример:");

var a = checkYear(2017);
console.log(a);

a = checkYear(2020);
console.log(a);

a = checkYear(1954);
console.log(a);

