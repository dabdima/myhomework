//"use strict";




function stepen(a, b){
	if (b > 1) {
		return stepen(a, (b - 1)) * a;
	} else{
		return a;
	}
}



document.write("пример: ");
console.log("пример: ");

document.write(stepen(2, 4));
console.log(stepen(2, 4));