var machines = [
{name: "SBL500", listName: "SBL-500", lang: "sin"},
{name: "SE820", listName: "SE-820", lang: "sin"},
{name: "lynx300m", listName: "Lynx 300M", lang: "fan"},
{name: "pumaMX2600", listName: "PUMA MX2600", lang: "fan"}



];

for (i=0; i < machines.length; i++) {
console.log(machines[i]);

}


//конструктор для объекта machine 
function Machine(name, listName, lang) {
	this.name = name; //для js анализа
	this.listName = listName; //только для отображения в списке
	this.lang = lang;
	
	//Метод. Для представления введенного в блог в виде строки
	this.toString = function() {
		return "[" + (this.date.getMonth()+1) +"/" + this.date.getDate() +
					"/" + this.date.getFullYear() + "] " + this.body;
	};
	
	//Метод. Возвращаем форматированное HTML-представление записи
	this.toHTML = function(highlight) {
		//использование серого фона для выделения
		var blogHTML = "";
		blogHTML += highlight ? "<p style='background-color:#eee'>" : "<p>";
		//генерируем отформатированный код блога
		blogHTML += "<strong>" + (this.date.getMonth()+1) +"/" + this.date.getDate() +
					"/" + this.date.getFullYear() + "</strong><br />" + this.body +"</p>";
		return blogHTML;
	};
	
	//Метод. проверяем, содержит ли блог строку текста
	this.containsText = function(text) {
		return(this.body.toLowerCase().indexOf(text.toLowerCase()) != -1);
	};
}