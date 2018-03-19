
var thread = {
p: 0, 
deff: 0, 
d: 0, 
q: 0, 
depth: 0
}; 



function getDepth(){
	
	thread.depth = ((thread.p*0.25)/Math.tan(getToRad(30))) - thread.q + (Math.abs(thread.d - thread.deff))/2;
	thread.depth = Number((shortened(thread.depth)).toFixed(3));
	

};


function getToRad(deg){	return deg / 180 * Math.PI;
};


function getQ(){

	
	switch (thread.p) {
		case 1.5:
			thread.q = 0.187;
			break
		case 1:
			thread.q = 0.125;
			break
		case 2:
			thread.q = 0.249;
			break
		case 0.75:
			thread.q = 0.093;
			break
		default:
			showAlertDiv("\'q\' cannot be defined", "#p-input");
	}
};




$("#thread-res").on("click", function() {
	
	
	if (($("#pr-input").val() != 0) && ($("#effd-input").val() != 0) && ($("#p-input").val() != 0)){

		thread.q = 0;
		thread.depth = 0;
		
		thread.d = Number($("#pr-input").val());
		thread.deff = Number($("#effd-input").val());
		thread.p = Number($("#p-input").val());
		

		
		getQ();
		getDepth();


		document.getElementById("depth-input").value = thread.depth;
		document.getElementById("q-input").value = thread.q;
		
		if (thread.q === 0) {
			document.getElementById("q-input").value = "undefined";
			document.getElementById("depth-input").value = "undefined";
		}
				
	} 

});



$("#get-thread").on('click', function() {
	$("#middle-container, #render-container").css("display", "none");
	$("#middle-container-thread").css("display", "block");
	

});



