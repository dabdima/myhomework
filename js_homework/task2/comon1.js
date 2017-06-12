//"use strict";


function calcLetters(initStr) {
	console.log(initStr);

	var str = (initStr.toLowerCase()).split(''),
		quantity = 1,
		checked = "",
		compare1 = function (a, b) {
			if (a > b) return -1;
			if (a < b) return 1;
		};

	str.sort(compare1);

	for (i = 0; i < str.length; i++) {
		if (checked.indexOf(str[i]) === -1) {
			for (j = i; str[j] === str[j+1]; j++) {
				quantity++;
			}
			console.log("\"" + str[i] + "\" - " + quantity);
			quantity = 1;
			checked = checked + str[i];
		}
	}
}


 console.log("пример:");

 calcLetters("Array123");
 calcLetters("fkAsjaa24");


