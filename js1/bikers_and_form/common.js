

//1. При помощи JS заполнить поле для ввода email значением.
document.querySelector("input[type='email']").value = "qqqqq@gmail.com";

//2. Поля для ввода имени и фамилии - сделать границу красной. 
var inputText = document.querySelectorAll("input[type='text']");
inputText[0].style.borderColor = "red";
inputText[1].style.borderColor = "red";

//3. Поставить галочку в чекбокс.
document.querySelector("#check").setAttribute("checked", "checked");

//4. Изменить цвет и надпись в submit.
document.querySelector("#create").style.background = "green";
document.querySelector("#create").value = "Submit";
