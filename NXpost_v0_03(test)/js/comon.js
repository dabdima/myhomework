
var clData = "";//init CL-data
var clDataArray;
var CNC = [],
	renderBlArr =[];
var TN = 0, TNlast = -1;
var toolName = "";
var coolant = -1;
 //reAB = /(-)?[0-9]+(\.)?([0-9]+)?/i;
var reAB = /[0-9]/;
var re = /(.+)?[SV][0-9]+M[34](.+)?/i;

var reJ = /[0-9]/i, 
	reDD = /([0-7])/i;

var fromExistance = 0;
var Fpast = 5000, 
	F = 0, 
	Xpast = 0, 
	Zpast = 0, 
	X = 0, 
	Z = 0, 
	GPathModePast = "G1", 
	GPathMode = "G1", 
	GFeedModePast = "G94", 
	GFeedMode = "G94";
var G1Factor = 1, 
	ArcGFactor = 0, 
	G94Factor = 1, 
	G95Factor = 0, 
	FFactor = "";
var Fcut = 0, 
	FIdle = 2000, 
	arcRadius = 0, 
	toolName = "", 
	iForN = 0, 
	iDelta = 5;
var IarcCenter = 0, 
	KarcCenter = 0;

var turnDataBack = function() {
	TN = 0, 
	TNlast = -1, 
	iForN=0,
	fromExistance = 0,
	 Fpast = 5000, 
	 F = 0, Xpast = 0, Zpast = 0, X = 0, Z = 0, 
	 GPathModePast = "G1", GPathMode = "G1", 
	 GFeedModePast = "G94", GFeedMode = "G94",
	 G1Factor = 1, ArcGFactor = 0, G94Factor = 1, 
	 G95Factor = 0, FFactor = ""; //FFactor - cutting feed mode G94 or G95
	 Fcut = 0, FIdle = 2000, arcRadius = 0, coolant = -1,
	 renderBlArr =[],
	  p = undefined;
	  toolStrParams.errorFactor = 0;
	  toolStrParams.Zmax = -999999, toolStrParams.Zmin = 999999, toolStrParams.Xmin = 999999, toolStrParams.Xmax = -999999; 
	};


//zerokiller
var shortened = function(n) {
	var num = Number(n);
	if ((num*1000)===(num.toFixed()*1000)) return  Number(num.toFixed());
	else return num;
}

//XXXX search at start of string
function getXXXX(str) {
	var trim = str.substr(0, 4);
	return trim;
}


//get tool number
function getToolNumber(str){
	var res = str.split(",");
	return res[1];
}

//get file information
function getInfo(str){
	var res = str.split(": ");
	return res[1];
}
//get pass name
function getPassName(str){
	var res = str.split("/");
	res1 = res[1].split(",");
	return res1[0];
}
//get tool name
function getToolName(str){
	var res = str.split("/");
	res1 = res[1].split(",");
	return res1[2];
}

//get feedrate
function getFeed(str){
	var res = str.split(",");
	return shortened((Number(res[1])).toFixed(3));
}
//get feedrate (w/o MMPM or MMPR inf.)
function getFeedNoModeInf(str){
	var res = str.split("/");
	return shortened((Number(res[1])).toFixed(3));
}
//get arc center (x,y) (for DF-2,3 CNC-600-1 shop num.60)
function getArcCenter(str){
	var res = str.split(",");
	IarcCenter = shortened(((Number(res[1]))*2).toFixed(3));
	res = res[0].split("/");
	KarcCenter = shortened((Number(res[1])).toFixed(3));
	return true;
}

//get idle feedrate
function getIdleFeed(X, Z, Xp, Zp){
	var squareDX = Math.pow(((X-Xp)/2),2), squareDZ = Math.pow((Z-Zp),2);
	var res = (Math.pow((squareDX+squareDZ),0.28))*100;
	 //console.log("X="+X+" Z="+Z+" Xp="+Xp+" Zp="+Zp+"\n");
	 //console.log("F="+res);
	if (res > 2000) res = 2000;
	return shortened(res.toFixed());
}

//X diam. extraction from clDataArray[i]
function getDiam(str) {
	var startIndex = str.indexOf(",") + 1 , num = str.lastIndexOf(",") - startIndex;
	var trim = str.substr(startIndex, num);
	return shortened((Number(trim)*2).toFixed(3));
}

//get X diam. from FROM-point
function getXFrom(str) {
	var array = str.split(",");
	var res = Number(array[1])*2;
	return shortened(res.toFixed(3));
}
//get thread pitch from clDataArray[i]
function getThrPitch(str) {
	var array = str.split(",");
	var res = Number(array[2]);
	return shortened(res.toFixed(3));
}
//get Z from FROM-point
function getZFrom(str) {
	var array = str.split("/");
	var res = Number(array[1].substr(0, array[1].indexOf(",")));
	return shortened(res.toFixed(3));
}

//Z extraction from clDataArray[i]
function getZ(str) {
	var startIndex = str.indexOf("/") + 1 , num = str.indexOf(",") - startIndex;
	var trim = str.substr(startIndex, num);
	return shortened((Number(trim)).toFixed(3));
}

//G2 OR G3 ISSUE
function getArcDirection(str){
	res = str.split(",");
	if ((Number(res[5])).toFixed() == 1) return 2;
	if ((Number(res[5])).toFixed() == -1) return 3;
	if ((Number(res[5]) != -1) && (Number(res[5]) != 1)) alert("function getArcDirection error: res[5] = "+res[5]);
}

//arc radius of G2/G3 interpolation
function getArcRadius(str){
	res = str.split(",");
	return shortened((Number(res[6])).toFixed(3));
}

//check coolant status and set "M8" or nothing
function checkCoolant() {
	if (coolant == -1) {
		CNC[i][26] = "M"+8+" ";
		coolant = 1;
	}
}

//block numeration
function nBlock(){
	iForN+= iDelta;
	return 'N'+iForN+'  ';
}

//TOOL string info
var toolStrParams = {
	"t": "",
	"r": "",
	"d1": "",
	"d2": "",
	"trabjddSet": "",
	"checkedByName": "",
	"range": "",
	"s": "",
	"m": "",
	"errorFactor": 0,
	"passName": "",
	"sMode": "",
	"Xmin": 999999,
	"Xmax": -999999,
	"Zmin": 999999,
	"Zmax": -999999
	
};
//get X Z max and min
function XZrange(){
	if ( getXFrom(clDataArray[i]) > toolStrParams.Xmax  ) toolStrParams.Xmax = getXFrom(clDataArray[i]);
	if ( getXFrom(clDataArray[i]) < toolStrParams.Xmin  ) toolStrParams.Xmin = getXFrom(clDataArray[i]);
	if ( getZFrom(clDataArray[i]) > toolStrParams.Zmax  ) toolStrParams.Zmax = getZFrom(clDataArray[i]);
	if ( getZFrom(clDataArray[i]) < toolStrParams.Zmin  ) toolStrParams.Zmin = getZFrom(clDataArray[i]);
}




function toolinf(str){
	var line = (str.split("/"))[1],
	lineArray = line.split(",");
	//getting radius of insert
	if ((lineArray[0] == "TURN") && (lineArray[1] != "BORBAR")  && (lineArray[1] != "BUTTON")) {
		toolStrParams.r = shortened(lineArray[3])/2;
	} else if ((lineArray[0] == "TURN") && (lineArray[1] == "BORBAR")) {
		toolStrParams.r = shortened(lineArray[4])/2;
	} else if ((lineArray[0] == "TURN") && (lineArray[1] == "BUTTON")) {
		toolStrParams.r = shortened(lineArray[4])/2;
	} else if ((lineArray[0] == "GROOVE") && (lineArray[1] == "LEFT")) {
		toolStrParams.r = shortened(lineArray[5]);
	} else if ((lineArray[0] == "GROOVE") && (lineArray[1] == "RIGHT")) {
		toolStrParams.r = shortened(lineArray[6]);
	} else if (lineArray[0] == "THREAD") {
		toolStrParams.r = 0;
	} else if (lineArray[0] == "DRILL") {
		toolStrParams.r = 0; //at least for spotdrill
	} else if  (!Number(toolStrParams.r)) {
		toolStrParams.errorFactor = 1;
		showAlertDiv("TLDATA incorrect, coordinate system incorrect", "#stringInputArea");
	} else {
		alert('\"toolinf\" function error')
	};
	//return toolStrParams;
}

//get D1, D2 from inputs to toolStrParams obj.
function getD1D2() {
	if ($("#d2-input").val()==="") {toolStrParams.d2 = $("#d2-input").attr("placeholder")} else { toolStrParams.d2 = $("#d2-input").val()};
	if ($("#d-input").val()==="") {toolStrParams.d1 = $("#d-input").attr("placeholder")} else { toolStrParams.d1 = $("#d-input").val()};
};

//function for alert div debuging
function debounce(f, ms) {
  var state = null;
  var COOLDOWN = 1;
  return function() {
	if (state) return;
	f.apply(this, arguments);
	state = COOLDOWN;
	setTimeout(function() { state = null }, ms);
  }
}
function f() { $('#alert-block').addClass('passive-cnc-set'); };
var f = debounce(f, 4000);

// showAlertDiv function
function showAlertDiv(note, errorBlock) {
	$("#alert-block").text(note);
	$("#alert-block").removeClass("passive-cnc-set");
	$("#alert-block").css("box-shadow", "2px 1px 80px 3px #F15C5D, inset 2px 1px 80px 3px #F15C5D");
	$("#alert-block").css("border-color", "#F15C5D");
	$(errorBlock).addClass("red-shadow");
	setTimeout( function() { 
		$(errorBlock).removeClass("red-shadow");
	}, 5000);
	setTimeout( function() { f() }, 4000);
}

//setSpindleByHadLine 
// if contains  S...M... or V...M...
//example: ..S120M4.., ..V112M3.., ..S40M3.., ...
function setSpindleByHadLine() {
	if (re.exec(toolStrParams.passName) === null) {
		toolStrParams.errorFactor = 1;
		showAlertDiv("spindle speed data cannot be identified by headline", "#stringInputArea");
	} else {
		var sPrev;
		if (((re.exec(toolStrParams.passName))[2] != undefined)&&((re.exec(toolStrParams.passName))[1] != undefined)) {
			sPrev = toolStrParams.passName.substr(0, (toolStrParams.passName.length - ((re.exec(toolStrParams.passName))[2]).length)); //cut right part
			sPrev = sPrev.substr(((re.exec(toolStrParams.passName))[1]).length, (sPrev.length-(((re.exec(toolStrParams.passName))[1]).length))); //cut left part
		} else if ((re.exec(toolStrParams.passName))[2] != undefined) {
			sPrev = toolStrParams.passName.substr(0, (toolStrParams.passName.length-(((re.exec(toolStrParams.passName))[2]).length))); //cut left part
		} else if ((re.exec(toolStrParams.passName))[1] != undefined) {
			sPrev = toolStrParams.passName.substr(((re.exec(toolStrParams.passName))[1]).length, (toolStrParams.passName.length - ((re.exec(toolStrParams.passName))[1]).length)); //cut right part
		} else if (((re.exec(toolStrParams.passName))[2] == undefined)&&((re.exec(toolStrParams.passName))[1] == undefined)) {
			sPrev = toolStrParams.passName;
			//console.log("regExp case3 (right&left free): " + sPrev);
		} else {
			toolStrParams.errorFactor = 1;
			showAlertDiv("something wrong. Ask Dima to debug \"comon.js\"");
		}
		toolStrParams.m = sPrev.substr((sPrev.length-1),2);
		toolStrParams.s = ((sPrev.split("M"))[0]).substr(1,((sPrev.split("M"))[0]).length);
		if (sPrev.substr(0,1) === "S") {toolStrParams.sMode = "G97"};
		if (sPrev.substr(0,1) === "V") {toolStrParams.sMode = "G96"};
	}
}


function getResult() {




	clData = document.getElementById("stringInputArea").value;
	if (clData == "") {
		toolStrParams.errorFactor = 1;
		showAlertDiv("enter CL-data", "#stringInputArea");
		return false;
	}
	clDataArray = clData.split("\n");
	
	for (i = 0; i < clDataArray.length; i++) {
		CNC[i] = [];
		for (j=0; j < 31; j++) {
			CNC[i][j] = "";
		}
	}
	
	for (i = 0; i < clDataArray.length; i++) {
	
	//console.log("Xmin="+toolStrParams.Xmin+" Xmax="+toolStrParams.Xmax+" Zmin="+toolStrParams.Zmin+" Zmax="+toolStrParams.Zmax);
		
		CNC[i][30] = "\n";
		
		if ((getXXXX(clDataArray[i]) == "Инфо") && (getXXXX(clDataArray[i+1]) == "Дата") &&
			(getXXXX(clDataArray[i+2]) == "Теку") &&  
			(getXXXX(clDataArray[i+5]) == "TOOL")) {
			
			getD1D2();		
			
			if (TN == 0) {
				if (($(".active-cnc-set div .cuselText").text() == "SBL-500")||($(".active-cnc-set div .cuselText").text() == "SE-820")) {
					CNC[i][0] = "<span class=\"colorNOMORE\">" //needed for closure "</span>" for color mode
					CNC[i][1] = "; User: " + getInfo(clDataArray[i]) + ", " + "date: " + getInfo(clDataArray[i+1]);
					CNC[i+1][1] = "; Proj. path: " + getInfo(clDataArray[i+2]);
				} else {
					CNC[i][0] = "<span class=\"colorNOMORE\">" //needed for closure "</span>" for color mode
					CNC[i][1] = "(User: " + getInfo(clDataArray[i]) + ", " + "date: " + getInfo(clDataArray[i+1])+")";
					CNC[i+1][1] = "(Proj. path: " + getInfo(clDataArray[i+2])+")";
				}
			}
			if (($(".active-cnc-set div .cuselText").text() == "SBL-500")||($(".active-cnc-set div .cuselText").text() == "SE-820")) {
				CNC[i+2][1] = "; Pass name: " + getPassName(clDataArray[i+5]);
			} else {
				CNC[i+2][1] = "(Pass name: " + getPassName(clDataArray[i+5]);
			}
			if (i < 10) {toolStrParams.passName = getPassName(clDataArray[i+5]);}
			if (toolName != -1) {
				toolName = getToolName(clDataArray[i+5]);
				
				if (($(".active-cnc-set div .cuselText").text() == "SBL-500")||($(".active-cnc-set div .cuselText").text() == "SE-820")) {
					CNC[i+2][3] = ", tool name: " + toolName;
				} else {
					CNC[i+2][3] = ", tool name: " + toolName+")";
				}
				//toolName = -1;
			}
			continue;
		}
		
		if ((getXXXX(clDataArray[i]) == "TOOL") && (i > 10)) {
			toolStrParams.passName = getPassName(clDataArray[i]);
			console.log('toolinf!!!! ' + getPassName(clDataArray[i]));
			if (($(".active-cnc-set div .cuselText").text() == "SBL-500")||($(".active-cnc-set div .cuselText").text() == "SE-820")) {
				CNC[i][0] = "; Pass name: " + toolStrParams.passName + "";
			} else {
				CNC[i][0] = "(Pass name: " + toolStrParams.passName + ")";
			}
			//continue;
		}
		if ((getXXXX(clDataArray[i]) == "TOOL") && (i > 10) && (toolStrParams.checkedByName == "y")) { // allows to change spindle speed every new path (spindle by headline mode only)
			toolStrParams.passName = getPassName(clDataArray[i]);
			
			/* if (($(".active-cnc-set div .cuselText").text() == "SBL-500")||($(".active-cnc-set div .cuselText").text() == "SE-820")) {
				CNC[i][1] = "; Pass name: " + toolStrParams.passName + "/n";
			} else {
				CNC[i][1] = "(Pass name: " + toolStrParams.passName + ")/n";
			} */
			
			
			if (re.exec(toolStrParams.passName) === null) { continue } else {
				var mPrev = toolStrParams.m;
				setSpindleByHadLine();
				if (mPrev != toolStrParams.m) {
					//if (($(".active-cnc-set div .cuselText").text() == "SBL-500")||($(".active-cnc-set div .cuselText").text() == "Lynx300M")||($(".active-cnc-set div .cuselText").text() == "SE-820")) {
						CNC[i][0] += "\n" + nBlock() + "M5 \n"+ nBlock() +"G97 S"+toolStrParams.s+" M"+toolStrParams.m + " ";
					} else {
						iForN+= iDelta;
						CNC[i][0] +="\n" + nBlock() +toolStrParams.range+" S"+toolStrParams.s+" M"+toolStrParams.m + " ";
					}
				
				
			};
		}
		
		if (getXXXX(clDataArray[i]) == "TLDA") { //getting tool parameters
			toolinf(clDataArray[i]);
			//console.log('toolinf ' + toolStrParams.r + ', ' + toolStrParams.t);
			continue;
		}
		
		if ((getXXXX(clDataArray[i]) == "PAIN") && (getXXXX(getPassName(clDataArray[i])) == "COLO")) {
			//console.log(getToolNumber(clDataArray[i])); // color №
			CNC[i][0] = "</span>" + "<span class=\"color" + getToolNumber(clDataArray[i]) + "\">";
			//continue;
		}
		if ((getXXXX(clDataArray[i]) == "PAIN") && (getXXXX(getPassName(clDataArray[i])) == "TOOL")) {
			//console.log(getToolNumber(clDataArray[i])); // "PAINT/TOOL,NOMORE" to activate comment mode
			CNC[i][0] = "</span>" + "<span class=\"color" + getToolNumber(clDataArray[i]) + "\">";
			//continue;
		}
		
		if ((i<(clDataArray.length-1)) && (getXXXX(clDataArray[i+1]) == "TURR")) { // get tool number & generate starting block
			TN = getToolNumber(clDataArray[i+1]);
			toolStrParams.t = TN;
			console.log("tn= " + TN); 
			if (TN != TNlast) {
					var blockAddress;
				if ($("#cuselFrame-cnc-type .cuselText").text() == "FANUC") {
					blockAddress = "N";
				} else if ($("#cuselFrame-cnc-type .cuselText").text() == "SINUMERIK") {
					blockAddress = ":";
				} else { toolStrParams.errorFactor = 1;
					showAlertDiv("unknown cnc machine to get starting block address", "#cuselFrame-cnc-type");
					blockAddress = ":";
				}
				
				if ($("#starting-block-input").val() != "") { 
					startBlockNo = $("#starting-block-input").val();
					localStorage.setItem('startingBlock', $("#starting-block-input").val());
				} else {
					startBlockNo = $("#starting-block-input").attr("placeholder");
				}
				
				if (toolStrParams.checkedByName == "n") {
					if (((Number($("#spindle-speed-input").val())*Number($("#spindle-speed-input").val())) > 0) && (Number($("#spindle-speed-input").val()) >= 0)) {
						toolStrParams.s = $("#spindle-speed-input").val();
						//console.log("asdfg "+($("#spindle-speed-input").val()+1));
					} else { 
						toolStrParams.errorFactor = 1;
						showAlertDiv("incorrect spindle speed data", "#spindle-speed-input");
						}
					if ($("#payt1").attr("checked") == "checked"){
						toolStrParams.sMode = "G96";
						//console.log("payt1 checked");
					} else { 
						toolStrParams.sMode = "G97";
						//console.log("payt1  not checked");
					}
					if ($("#payt2").attr("checked") == "checked"){
						toolStrParams.m = "3";
						//console.log("payt2 checked");
					} else { 
						toolStrParams.m = "4";
						//console.log("payt2  not checked");
					}
				} else if (toolStrParams.checkedByName == "y") {   //when we get tool parameters by head line 0_o
					//var re = /\d/i;
					setSpindleByHadLine();
				}
				
				if ($(".active-cnc-set div .cuselText").text() == "Lynx300M") {
					if (TN<10) {
						CNC[i-6][0] = blockAddress + startBlockNo +" G80 G90 G94 \n"+nBlock()+"G28 U0 W0 \n"+nBlock()+"T0"+TN+"00 \n"+nBlock()+"G54 \n"+nBlock()+"T0"+TN+"0"+TN;
					} else {
						CNC[i-6][0] = blockAddress + startBlockNo +" G80 G90 G94 \n"+nBlock()+"G28 U0 W0 \n"+nBlock()+"T"+TN+"00 \n"+nBlock()+"G54 \n"+nBlock()+"T"+TN+TN;
					}
					CNC[i-6][0]+= "\n"+nBlock()+"G97 " +"S"+toolStrParams.s+" M"+toolStrParams.m +" P11";
				}
				if ($(".active-cnc-set div .cuselText").text() == "SBL-500") {
					CNC[i-6][0] = blockAddress + startBlockNo +" T"+TN+" D1"+" \n"+nBlock()+"G18 \n"+nBlock()+"G64 G90 G94 \n"+nBlock()+"G97" +" S"+toolStrParams.s+" M"+toolStrParams.m + " ";
				}
				if ($(".active-cnc-set div .cuselText").text() == "SE-820") {
					if (Number(toolStrParams.s) <= 20) {toolStrParams.range = "M41"} else if (Number(toolStrParams.s) > 20) {toolStrParams.range = "M42"};
					toolStrParams.trabjddSet = "("+toolStrParams.t+","+toolStrParams.r+","+$("#a-input").val()+","+$("#b-input").val()+","+$("#j-input").val()+","+toolStrParams.d1+","+toolStrParams.d2+")";
					CNC[i-6][0] = blockAddress + startBlockNo +" T"+TN+" \n"+nBlock()+"TOOLPARAMS"+toolStrParams.trabjddSet+" \n"+nBlock()+"G64 G90 G94"+" \n"+nBlock()+"G97 "+toolStrParams.range+" S"+
					toolStrParams.s+" M"+toolStrParams.m + " ";
					
					
					
					if (($("#a-input").val())&&(reAB.test($("#a-input").val()))){}else{
						toolStrParams.errorFactor = 1;
						showAlertDiv("enter(check) tool parameters", "#a-input");}
					if (($("#b-input").val())&&(reAB.test($("#b-input").val()))){}else{
						toolStrParams.errorFactor = 1;
						showAlertDiv("enter(check) tool parameters", "#b-input");}
					if (($("#j-input").val())&&(reJ.test($("#j-input").val()))&& (Number($("#j-input").val())>=0)&& (Number($("#j-input").val())<=9)){}else{
						toolStrParams.errorFactor = 1;
						showAlertDiv("enter(check) tool parameters", "#j-input");}	
					if ((reDD.test($("#d-input").val()))||($("#d-input").val()==="")){}else{
						toolStrParams.errorFactor = 1;
						showAlertDiv("enter(check) tool parameters", "#d-input");}	
					if ((reDD.test($("#d2-input").val()))||($("#d2-input").val()==="")){}else{
						toolStrParams.errorFactor = 1;
						showAlertDiv("enter(check) tool parameters", "#d2-input");}		
					
					
					/* if (($("#a-input").val())&&($("#b-input").val())&&($("#j-input").val())&&(reAB.test($("#a-input").val()))&&(reAB.test($("#b-input").val()))&&(reJ.test($("#j-input").val()))&&(Number($("#j-input").val())>=0)&&(Number($("#j-input").val())<=9)&&      ((reDD.test($("#d-input").val()))||($("#d-input").val()===""))&&               ((reDD.test($("#d2-input").val()))||($("#d2-input").val()===""))            ) {

					}else {toolStrParams.errorFactor = 1;
						showAlertDiv("enter(check) tool parameters");
					}; */
				}

				
				
				
				
				/* 	CNC[i-7][0] = blockAddress + startBlockNo + " " +"T"+TN+" "+"D1 " + "M6 ";
					localStorage.setItem('startingBlock', $("#starting-block-input").val());
				} else {
					CNC[i-7][0] = blockAddress + startBlockNo + " " +"T"+TN+" "+"D1 " + "M6 ";
				} */
				
				//fromExistance = 0;
			}
			
			
			
			
			if (getXXXX(clDataArray[i]) == "FROM") { // FROM-point search
				if ($(".active-cnc-set div .cuselText").text() == "SE-820") {
					CNC[i-1][1] = nBlock()+"G54 "+ "<br\/>";
					CNC[i][27] = "F"+ Fpast + " ";
					if (i<20) { CNC[i][27]+= " D" + toolStrParams.d1;
					} else {
					CNC[i-1][1] = nBlock()+"G54 G90 G94 G64"+ "<br\/>";
					CNC[i][27] = "F"+ Fpast + " ";
					}
				}
				if ($(".active-cnc-set div .cuselText").text() == "SBL-500") {
					CNC[i-1][1] = nBlock()+"G54 "+ "<br\/>";
					CNC[i][27] = "F"+ Fpast + " ";
				}
				CNC[i][1] = nBlock();
				CNC[i][3] = "G1"+" ";
				CNC[i][5] = "G94"+" "+"G9"+ " ";
				CNC[i][9] = "X" + getXFrom(clDataArray[i]) + " ";
				Xpast = getXFrom(clDataArray[i]);
				CNC[i][13] = "Z" + getZFrom(clDataArray[i]) + " ";
				Zpast = getZFrom(clDataArray[i]);
				G94Factor = 0;
				fromExistance = 1;
				XZrange();
			} else
			if (TN != TNlast) {
				CNC[i-6][0]+= '\n\n;there\'s no FROM point. Toolpath starts here: .........\n\n G54';
				//CNC[i-7][0] = CNC[i-7][0] + '\n\n;there\'s no FROM point. Toolpath starts here: .........\n';
			}
			TNlast = TN;
			continue;
		}
		//console.log(localStorage.getItem('startingBlock')+" gyui");
		
		
		/*if (getXXXX(clDataArray[i]) == "FROM") { // FROM-point search
			if ($(".active-cnc-set div .cuselText").text() == "SE-820") {
				CNC[i-1][1] = nBlock()+"G54 "+ "<br\/>";
				CNC[i][27] = "F"+ Fpast + " ";
				if (i<20) { CNC[i][27]+= " D" + toolStrParams.d1;
				} else {
				CNC[i-1][1] = nBlock()+"G54 G90 G94 G64"+ "<br\/>";
				CNC[i][27] = "F"+ Fpast + " ";
				}
			}
			if ($(".active-cnc-set div .cuselText").text() == "SBL-500") {
				CNC[i-1][1] = nBlock()+"G54 "+ "<br\/>";
				CNC[i][27] = "F"+ Fpast + " ";
			}
			CNC[i][1] = nBlock();
			CNC[i][3] = "G1"+" ";
			CNC[i][5] = "G94"+" "+"G9"+ " ";
			CNC[i][9] = "X" + getXFrom(clDataArray[i]) + " ";
			Xpast = getXFrom(clDataArray[i]);
			CNC[i][13] = "Z" + getZFrom(clDataArray[i]) + " ";
			Zpast = getZFrom(clDataArray[i]);
			G94Factor = 0;
			fromExistance = 1;
			XZrange();
			continue;
		}*/
		
		if (getXXXX(clDataArray[i]) == "GOHO") { // GOHOME-point search
			CNC[i][1] = nBlock();
			CNC[i][3] = "G1"+" ";
			CNC[i][5] = "G94"+" "+"G9"+ " ";
			if ($(".active-cnc-set div .cuselText").text() == "Lynx300M") {
				CNC[i][27] = "F"+ 5000 + " M9 ";
			} else {
				CNC[i][27] = "F"+ 5000 + " M9 \n"+nBlock()+"M5 ";
			}
			CNC[i][9] = "X" + getXFrom(clDataArray[i]) + " ";
			Xpast = getXFrom(clDataArray[i]);
			CNC[i][13] = "Z" + getZFrom(clDataArray[i]) + " ";
			Zpast = getZFrom(clDataArray[i]);
			CNC[i+1][1] = nBlock()+"M0 ";
			
			
			
			
			
			
			if ($(".active-cnc-set div .cuselText").text() == "Lynx300M") {
				if (TN<10) {
					CNC[i+1][1] = nBlock()+"G28 U0 W0 \n"+nBlock()+"M5 P11 \n"+nBlock()+"T0"+TN+"00" + " \n"+nBlock()+"M0 ";
						//CNC[i-7][0] = blockAddress + startBlockNo +" G80 G90 G94\nN1 G28 U0 W0\nN2 T0"+TN+"00\nN3 G54\nN4 T0"+TN+"0"+TN;
				} else {
					CNC[i+1][1] = nBlock()+"G28 U0 W0 \n"+nBlock()+"M5 P11 \n"+nBlock()+"T"+TN+"00" + " \n"+nBlock()+"M0 ";
					//CNC[i-7][0] = blockAddress + startBlockNo +" G80 G90 G94\nN1 G28 U0 W0\nN2 T"+TN+"00\nN3 G54\nN4 T"+TN+TN;
				}
			}
			
			XZrange();
			continue;
		}
		
		if (getXXXX(clDataArray[i]) == "FEDR") {
			if (clDataArray[i].substr(7, 4) == "MMPR"){
				Fcut = getFeed(clDataArray[i]);
				G95Factor = 1;
				GFeedMode = "G95";
				FFactor = "G95"
			} else /*else {
				F = getFeed(clDataArray[i]);
				//console.log(F);
			 } */
			if (clDataArray[i].substr(7, 4) == "MMPM"){
				Fcut = getFeed(clDataArray[i]);
				G94Factor = 1;
				G95Factor = 0;
				GFeedMode = "G94";
				FFactor = "G94"
			} else /* else {
				F = getFeed(clDataArray[i]);
				//console.log(F);
			} */
			{
				Fcut = getFeedNoModeInf(clDataArray[i]);
				/* G94Factor = 1;
				G95Factor = 0;
				GFeedMode = "G94";
				FFactor = "G94" */
			}
		}
		
		if ( (getXXXX(clDataArray[i]) == "DELA") ) { //getting delay parameters
			
			//for SINUMERIK
			if ($("#cusel-scroll-cnc-type .cuselActive").text() === productionСapacity.cncTypes[0].text) {
				CNC[i][1] = nBlock();
				CNC[i][3] = "G4"+" ";
				if ((/DELAY\/REV/).test(clDataArray[i])) {
					CNC[i][3] += "S";
					CNC[i][3] += Number((clDataArray[i].split(","))[1]);
				} else {
					CNC[i][3] += "F";
					CNC[i][3] += Number((clDataArray[i].split("\/"))[1]);
				}
			}
		}
		
		

		if ((getXXXX(clDataArray[i]) == "GOTO") && (getXXXX(clDataArray[i-1]) != "CIRC") && (getXXXX(clDataArray[i-1]) != "RAPI") && (getXXXX(clDataArray[i-2]) != "THRE"))  {
		
			//checkCoolant();
			if (coolant == -1) {
				CNC[i][26] = "M"+8+" ";
				coolant = 1;
			}
	
			if (G1Factor == 1) {
				CNC[i][3] = "G1"+" ";
				G1Factor = 0;
				GPathMode = "G1";
			}
			
		
			if (G95Factor == 1) {
				if (toolStrParams.sMode === "G96") {
					CNC[i][5] = "G96 S"+ toolStrParams.s+" ";
				} else if (toolStrParams.sMode === "G97") {
					CNC[i][5] = "G95"+" ";
				} else {toolStrParams.errorFactor = 1;
						showAlertDiv("cannot set G95/G96");}
				
				//CNC[i][5] = "G95"+" ";
				G95Factor = 0;
				GFeedMode = "G95";
			} else if (G94Factor == 1) {
				CNC[i][5] = "G94"+" ";
				G94Factor = 0;
				GFeedMode = "G94";
			}
			
			CNC[i][1] = nBlock();
			
			X = getXFrom(clDataArray[i]);
			//if ((X != Xpast) && (X != 0))   test changing
			if (X != Xpast) {
				CNC[i][9] = "X" + getXFrom(clDataArray[i]) + " ";
			}
			
			Z = getZFrom(clDataArray[i]);
			//if ((Z != Zpast) && (Z != 0))   test changing
			if (Z != Zpast) {
				CNC[i][13] = "Z" + getZFrom(clDataArray[i]) + " ";
			}
			
			if ((Fcut != Fpast) && (Fcut != 0)) {
				CNC[i][27] = "F"+ Fcut + " ";
				Fpast = Fcut;
			}
			
			Xpast = X;
			Zpast = Z;
			
			XZrange();
			
			GFeedModePast = GFeedMode;
			GPathModePast = "G1";
		}
		
		if ((getXXXX(clDataArray[i]) == "GOTO") && (getXXXX(clDataArray[i-1]) != "CIRC") && (getXXXX(clDataArray[i-1]) != "RAPI") && 
		((getXXXX(clDataArray[i-2]) == "THRE") || 
		((getXXXX(clDataArray[i-3]) == "THRE") && (getXXXX(clDataArray[i-1]) == "FEDR"))))  {
			
				CNC[i][3] = "G33"+" ";
				G1Factor = 1;
				GPathMode = "G33";
				
				CNC[i][27] = "";
				

		
			/* if (G95Factor == 1) {
				if (toolStrParams.sMode === "G96") {
					CNC[i][5] = "G96 S"+ toolStrParams.s+" ";
				} else if (toolStrParams.sMode === "G97") {
					CNC[i][5] = "G95"+" ";
				} else {toolStrParams.errorFactor = 1;
						showAlertDiv("cannot set G95/G96");}
				
				G95Factor = 0;
				GFeedMode = "G95";
			} else if (G94Factor == 1) {
				CNC[i][5] = "G94"+" ";
				G94Factor = 0;
				GFeedMode = "G94";
			} */
			
			CNC[i][1] = nBlock();
			
			X = getXFrom(clDataArray[i]);
			//if ((X != Xpast) && (X != 0))   test changing
			if (X != Xpast) {
				CNC[i][9] = "X" + getXFrom(clDataArray[i]) + " ";
			}
			
			Z = getZFrom(clDataArray[i]);
			//if ((Z != Zpast) && (Z != 0))   test changing
			if (Z != Zpast) {
				CNC[i][13] = "Z" + getZFrom(clDataArray[i]) + " ";
			}
			
			/* if ((Fcut != Fpast) && (Fcut != 0)) {
				CNC[i][27] = "F"+ Fcut;
				Fpast = Fcut;
			} */
			
			if (( p === null ) || ( p == undefined )) {
				var p;
				if (getXXXX(clDataArray[i-2]) == "THRE") 
					p = getThrPitch(clDataArray[i-2])
				else
					p = getThrPitch(clDataArray[i-3]);
			}
				
			CNC[i][13] += "K" + p + " ";
			
			Xpast = X;
			Zpast = Z;
			
			XZrange();
			
			//GFeedModePast = GFeedMode;
			GPathModePast = "G33";
		}
		
		if ((i > 0) && (getXXXX(clDataArray[i-1]) == "RAPI") && (getXXXX(clDataArray[i]) == "GOTO")) {
			
			//checkCoolant();
			if (coolant == -1) {
				CNC[i][26] = "M"+8+" ";
				coolant = 1;
			}
			
			if (fromExistance == 0) {
				Xpast = 99999;
				Zpast = 99999;
				CNC[i][1] = nBlock();
				CNC[i][3] = "G1"+" ";
				CNC[i][5] = "G94"+" "+"G9"+ " ";
				CNC[i][27] = "F"+ 500+" ";
				G94Factor = 0;
				fromExistance = 1;
			}
			
			if (GFeedModePast == "G95") {
				G94Factor = 1;
			} else
			if (GFeedModePast == "G94") {
				G94Factor = 0;
			}
			
			
			if (G94Factor == 0) {
				CNC[i][5] = "G9"+ " ";
			} else {
				CNC[i][5] = "G94"+" "+"G9"+ " ";
				G94Factor = 0;
			}
			
			if (GPathModePast == "G1") {
				G1Factor = 0;
			}
			
			if (G1Factor == 1) {
				CNC[i][3] = "G1"+" ";
				G1Factor = 0;
				GPathMode = "G1";
			}
			
			CNC[i][1] = nBlock();
			
			X = getXFrom(clDataArray[i]);
			//if ((X != Xpast) && (X != 0))   test changing
			if (X != Xpast) {
				CNC[i][9] = "X" + getXFrom(clDataArray[i]) + " ";
			}
			
			Z = getZFrom(clDataArray[i]);
			//if ((Z != Zpast) && (Z != 0))   test changing
			if (Z != Zpast) {
				CNC[i][13] = "Z" + getZFrom(clDataArray[i]) + " ";
			}
			
			F = getIdleFeed(X, Z, Xpast, Zpast);
			
			if ((F != Fpast) && (F != 0)) {
				CNC[i][27] = "F"+ F + " ";
				Fpast = F;
			} 
			
			Xpast = X;
			Zpast = Z;
			
			XZrange();
			
			GFeedModePast = "G94";
			if (FFactor == "G95") {G95Factor = 1;}
			GPathModePast = "G1";
		}
		
		
		if (getXXXX(clDataArray[i]) == "CIRC"){
		//alert("circ");
		continue}
		if ((i > 1) && (getXXXX(clDataArray[i-1]) == "CIRC") && (getXXXX(clDataArray[i]) == "GOTO") && (getXXXX(clDataArray[i-2]) != "RAPI")) { //"CIRCLE" searching
			arcRadius = getArcRadius(clDataArray[i-1]);
			//console.log(arcRadius);
			if ((getArcDirection(clDataArray[i-1]) == 2) || (getArcDirection(clDataArray[i-1]) == 3)) {
				ArcGFactor = getArcDirection(clDataArray[i-1]);
				G1Factor = 0;
				GPathMode = "G" + ArcGFactor;
			} else {alert("CIRCLE searching error!")}
			
			
			
			if (GPathMode != GPathModePast) {
				CNC[i][3] = "G" + ArcGFactor +" ";
				GPathModePast = GPathMode;
			}
			
			/* if (GFeedMode == "G95") {
				G95Factor = 0;
			} else
			if (GFeedMode == "G94") {
				G95Factor = 1;
			} */
			
			
			if (G95Factor == 1) {
				if (toolStrParams.sMode === "G96") {
					CNC[i][5] = "G96 S"+ toolStrParams.s+" ";
				} else if (toolStrParams.sMode === "G97") {
					CNC[i][5] = "G95"+" ";
				} else {toolStrParams.errorFactor = 1;
						showAlertDiv("cannot set G95/G96");}

				//CNC[i][5] = "G95"+" ";
				G95Factor = 0;
				GFeedMode = "G95";
			} else if (G94Factor == 1) {
				CNC[i][5] = "G94"+" ";
				G94Factor = 0;
				GFeedMode = "G94";
			}
			
			if ($(".active-cnc-set div .cuselText").text() == "Lynx300M") {
				CNC[i][21] = "R"+arcRadius+" ";
			} else {
				CNC[i][21] = "CR="+arcRadius+" ";
			}
			if ($(".active-cnc-set div .cuselText").text() == "DF2_3_CNC_H_600") {
				getArcCenter(clDataArray[i-1]);
				CNC[i][21] = "I"+ IarcCenter + " K" + KarcCenter;
			}
			
			
			CNC[i][1] = nBlock();

			X = getXFrom(clDataArray[i]);
			//if ((X != Xpast) && (X != 0))   test changing
			if (X != Xpast) {
				CNC[i][9] = "X" + getXFrom(clDataArray[i]) + " ";
			}
			
			Z = getZFrom(clDataArray[i]);
			//if ((Z != Zpast) && (Z != 0))   test changing
			if (Z != Zpast) {
				CNC[i][13] = "Z" + getZFrom(clDataArray[i]) + " ";
			}
			
			if ((Fcut != Fpast) && (Fcut != 0)) {
				CNC[i][27] = "F"+ Fcut + " ";
				Fpast = Fcut;
			}
			
			Xpast = X;
			Zpast = Z;
			
			XZrange();
			
			G1Factor = 1;
			
			GFeedModePast = GFeedMode;
			
				
		}
		
//document.getElementById("resultArea").value = CNC;
	}
	
	
	
	console.log("CNC = " + CNC);
	//document.getElementById("resultArea").value = CNC;
	
	var string1 ="", string2 ="", string3 = "";
	for (i=0; i<clDataArray.length; i++) {
		for (j=0; j<31; j++) {
			string1 += CNC[i][j];
		}
		if (string1.length < 2) {
			string1 = "";} else if (getXXXX(string1) == "</sp") {
				string2 += string1 ;
			} else {
				
				string2 += string1 + "<br\/>";
			}
		string1 = "";
	}
	//string2 = ((string2 + "<\/span>").split('\n')).join('<br\/>');
	//string2 = (string2.split('<br\/><br\/>')).join('<br\/>');
	$("#resultArea-incolor").html(string2 + "<\/span>"); // string2 - for div , as result
	console.log("string2 = " + string2);
	
	
	
	
	
	
	
	
	
	
	
	var currentBlSt = "colorNOMORE", 
		regN = /(^N\d+  )|(^; )|(^:\d+ )|(^\()/, regNInside =  / \nN\d+  /, regBlSt = /\<span\ class\=\"\w+\"\>/;
		
	/* if ($("#cusel-scroll-cnc-type .cuselActive").text() === productionСapacity.cncTypes[1].text) { //for FANUC
		
	} */
	
	for (i=0; i<clDataArray.length; i++) {
		for (j=0; j<31; j++) {
			
			// getting styles for renderBlArr (start) >----
				if (regBlSt.test(CNC[i][j])) {
					var tempStr = ((CNC[i][j]).match(regBlSt))[0];
					currentBlSt = (tempStr.split("\""))[1];
					console.log("currentBlSt = " + currentBlSt);
				}
			// getting styles for renderBlArr ----<(end)
			
			if (CNC[i][j] == "<span class=\"colorNOMORE\">") {
				CNC[i][j] = "";
				currentBlSt = "colorNOMORE";
			}
			var reg = /^\<\/\w+\>.+$/;
			if (reg.test(CNC[i][j])) CNC[i][j] = "";
			if ((CNC[i][j].split("\<"))[1] == "br\/>") {
				CNC[i][j] = (CNC[i][j].split("\<"))[0];
			};
			string1 += CNC[i][j];
			
			
			// greating renderBlArr (start) >----
			if (regN.test(CNC[i][j])) {
				renderBlArr.push({ str: "", blockStyle: "" });
				renderBlArr[renderBlArr.length - 1].blockStyle = currentBlSt; // setting property for styling 
			} 
			if (regNInside.test(CNC[i][j])) {
				var tempArr = (CNC[i][j]).split(/\n/g);
				for (k = 0; k < tempArr.length; k++) {
					if ((/^N\d+  /).test(tempArr[k]) === false) renderBlArr[renderBlArr.length - 1].str += tempArr[k];
					else {
						if ((renderBlArr[renderBlArr.length - 1]).length !== 0 ) {
							renderBlArr.push({ str: tempArr[k], blockStyle: "" });
							renderBlArr[renderBlArr.length - 1].blockStyle = currentBlSt; // setting property for styling 
						}
						else renderBlArr[renderBlArr.length - 1].str += tempArr[k];
					}
				}
			} else
			if ((CNC[i][j] !== "") && (CNC[i][j] !== "\n")) {
				if (renderBlArr.length >= 1) renderBlArr[renderBlArr.length - 1].str += CNC[i][j];
			}
			// greating renderBlArr ----<(end)
			
			
			
			
			
			
		}
		if (string1.length < 2) {
			string1 = "";} else {
				string3 += string1;
			}
		string1 = "";
	}
	

	console.log(renderBlArr);
	
	/* for (i=0; i<clDataArray.length; i++) { //initial fragment
		for (j=0; j<31; j++) {
			if (CNC[i][j] == "<span style='font-style: italic;'>") CNC[i][j] = "";
			var reg = /^\<\/\w+\>.+$/;
			if (reg.test(CNC[i][j])) CNC[i][j] = "";
			if ((CNC[i][j].split("\<"))[1] == "br\/>") {
				CNC[i][j] = (CNC[i][j].split("\<"))[0];
			};
			string1 += CNC[i][j];
		}
		if (string1.length < 2) {
			string1 = "";} else {
				string3 += string1;
			}
		string1 = "";
	} */
	
	document.getElementById("resultArea").value = string3; // string3 - for textarea , as result
	//console.log(string3);
	//console.log(CNC);
	
	
	rendertoolpath();
	
	
}


$("#inputBtn").on("click", function() {
	getResult();
	try {
		if ((getXXXX(clDataArray[0]) != "====") || (getXXXX(clDataArray[1]) != "Инфо") || (getXXXX(clDataArray[4]) != "Имя ") ||
			(getXXXX(clDataArray[2]) != "Дата") || (getXXXX(clDataArray[3]) != "Теку") || (getXXXX(clDataArray[5]) != "====")) {
			toolStrParams.errorFactor = 1;
			showAlertDiv("enter full CL-data or CL-data set", "#stringInputArea");
		}
	} catch(e) {
		toolStrParams.errorFactor = 1;
		showAlertDiv("enter full CL-data or CL-data set", "#stringInputArea");
		document.getElementById("resultArea").value = "error occurred: \n" + e.name + ":" + e.message + "\n" + e.stack;
	}
	
	if (toolStrParams.errorFactor != 0) {
		$("#resultArea-incolor").html("error occurred"); // string2 - for div , as result
		document.getElementById("resultArea").value = "error occurred"; // string3 - for textarea , as result
	} else {
		if ((fromExistance == 0)&&(toolStrParams.errorFactor == 0)) {
			//toolStrParams.errorFactor = 1;
			showAlertDiv("reference point is not defined", "#stringInputArea");
		} else {
			$("#alert-block").text("successful operation");
			$("#alert-block").removeClass("passive-cnc-set");
			$("#alert-block").css("box-shadow", "2px 1px 80px 3px #7699AE, inset 2px 1px 80px 3px #7699AE");
			$("#alert-block").css("border-color", "#7699AE");
		};
		setTimeout( function() { f() }, 4000);
	}
	
	turnDataBack();
	
	
	
	

});






/* 
$(document).ready(function () {
	$(".wraper").mousemove(function (e) {
		var moveX = (e.pageX * -1 / 40);
		var moveY = (e.pageY * -1 / 40);
		$(this).css("background-position", moveX + "px " + moveY + "px");
	});
});

 */




//(document.body.clientHeight-100)*0.9;




var userName;

function rockSays(x) {
	document.getElementById('rock-says').innerHTML = x;
}
function rockSaysHello() {
	document.getElementById('rock-says').innerHTML = '<br /><br />Hello, I \'m your pet Rock.';
}
function showCloud() {
	document.getElementById('cloud').style = 'display: block;';
}
function hideCloud() {
	document.getElementById('cloud').style = 'display: none;';
}



function greetUser() {
	if (navigator.cookieEnabled)
	userName = readCookie("irock_username");
	if (userName){
		setTimeout("showCloud()", 2000);
		setTimeout("rockSays('<br /><br />' + 'Hello ' + userName + ', I missed you.')", 2200);
		setTimeout("rockSays('')", 10800);
		setTimeout("hideCloud()", 11000);
	}
	else{
		setTimeout("document.getElementById('rockImg').src = 'img/iRock-look.png';", 1500);
		setTimeout("showCloud()", 2000);
		setTimeout("rockSaysHello()", 2200);
		setTimeout("rockSays('<br /><br />I am quite useful, I can transform your NX CL-data to NC program!')", 10000);
		setTimeout("rockSays('')", 17800);
		setTimeout("hideCloud()", 18000);
		setTimeout("document.getElementById('rockImg').src = 'img/iRock.png';", 19500);
	}
}




function touchRock() {
	if (userName) {
		alert("I like the attention, " + userName +". Thank you :)");
	}
	else {
		userName = prompt("What \'s your name?", "Enter your name here.");
		if 	(userName) {
			alert("It\'s good to meet you, " + userName +".");
			if (navigator.cookieEnabled)
				writeCookie("irock_username", userName, 5*365);
			else
				alert("Sorry, Cookies aren\'t supported/enabled in your browser, wich means I won\'t remember you later :( But you can try another browser.");
				alert("Sorry, Cookies aren\'t supported/enabled in your browser, wich means I won\'t remember you later :( But you can try another browser.");
		}
	}
	document.getElementById("rockImg").src = "img/rock_happy.png";
	setTimeout("document.getElementById('rockImg').src = 'img/iRock.png';", 5000);
}





/* function touchRock() {
	
	
	if (userName) {
		document.getElementById("rockImg").src = "img/rock_happy.png";
		alert("I like the attention, " + userName +". Thank you.");
		setTimeout("document.getElementById('rockImg').src = 'img/iRock.png';", 5000);
	}
	else {
		userName = prompt("What \'s your name?", "Enter your name.");
	if 	(userName) {
		alert("It\'s good to see you, " + userName +".");
	}
		document.getElementById("rockImg").src = "img/rock_happy.png";
		setTimeout("document.getElementById('rockImg').src = 'img/iRock.png';", 5000);
	}
} */


/*

function xTransform() {
	var initString;
	var	 initStringLength;
	var	initX;
	var	 initXwoX;
	var Xnum="";
	var strBefore="", strAfter="", resStr="";
	
	 initString = document.getElementById("stringInputArea").value;
	 initStringLength = initString.length;
	 initX = initString.match(/[Xx]\d+[.]\d+|[Xx]\d+|[Xx]-\d+[.]\d+|[Xx]-\d+/);
	 
	 var initX_ ="";
	 initX_ = initX[0];
	 
	for (i=1; i<initX_.length; i++) {
		Xnum = Xnum + initX_.charAt(i);
	}

	 Xnum=Number(Xnum)*2;
	 
	 /* console.log(initString);
	 console.log('before'+'\n'+'next');
	 console.log(initX);
	 console.log(initX.index);
	 console.log(initX[0]);
	 console.log(initX_.length);
	 console.log(Xnum); 
	 
	for (i=0; i<(initX.index+1); i++) {
		strBefore = strBefore + initString.charAt(i);
	}
	 
	 //console.log(strBefore);
 
	for (i=(strBefore.length+initX_.length-1); i<initStringLength; i++) {
		strAfter = strAfter + initString.charAt(i);
	}

	 //console.log(strAfter+'qqq1'+'\n'+'qqq2');

	resStr = strBefore + Xnum + strAfter;
	
	return resStr;
}

function getResult() {
	document.getElementById("resultArea").value = xTransform();
}

 */
 
if (localStorage.getItem('lastSelectedCnc') === null) {
	localStorage.setItem('lastSelectedCnc', '');
}
if (localStorage.getItem('lastSelectedMachine') === null) {
	localStorage.setItem('lastSelectedMachine', '');
}
if (localStorage.getItem('checkBox01') === null) {
	localStorage.setItem('checkBox01', '');
}
if (localStorage.getItem('startingBlock') === null) {
	localStorage.setItem('startingBlock', '');
}



if (localStorage.getItem('startingBlock') === '') {
	localStorage.setItem('startingBlock', $("#starting-block-input").attr("placeholder"));
} else if (localStorage.getItem('startingBlock') != $("#starting-block-input").attr("placeholder")) {
	$("#starting-block-input").attr("placeholder", localStorage.getItem('startingBlock'));
}
 
 
var productionСapacity = {
            user: "User1",
			cncTypes: [{ value: 1, text: "SINUMERIK" },
                { value: 2, text: "FANUC" },
                { value: 3, text: "-" },
                { value: 4, text: "--" },
                { value: 5, text: "---" }],
            /* machines: [{ name: "SBL-500", cnc_type: "SINUMERIK" },
                { name: "Lynx300M", cnc_type: "FANUC" },
                { name: "SE-820", cnc_type: "SINUMERIK" },
                { name: "Puma MX2600", cnc_type: "FANUC" },
				{ name: "Puma MX2600", cnc_type: "FANUC" },
				{ name: "++", cnc_type: "SINUMERIK" },
				{ name: "+++", cnc_type: "SINUMERIK" },
                { name: "+", cnc_type: "-" }] */
    };

	
	
	
	
$(document).ready(function(){
	//productionСapacity.cncTypes options integration
	for (i=0; i<productionСapacity.cncTypes.length; i++) {
		$("#cnc-type").append("<option></option>");
		$("#cnc-type option").eq(i).val(productionСapacity.cncTypes[i].text);
		$("#cnc-type option").eq(i).text(productionСapacity.cncTypes[i].text);

	}
	
	


	
		
	//spinlde speed checkboxes behaviour
	if (localStorage.getItem('checkBox01') === '') {
		$("#checkBox01").removeAttr("checked");
		localStorage.setItem('checkBox01', 'not checked');
	}
	if (localStorage.getItem('checkBox01') === 'not checked') {
		$("#checkBox01").removeAttr("checked");
	} else if (localStorage.getItem('checkBox01') === 'checked') {
		$("#checkBox01").attr("checked", "checked");
	}
	function checkBox01_condition() {
		if ($("#checkBox01").attr("checked") == "checked") {
			//console.log("checked");
			toolStrParams.checkedByName = "y";
			$("#spindle-speed-input, #payt1").addClass("checkBox01-not-checked");
			//$("#payt1").addClass("checkBox01-not-checked");
			$(".payt1-choice, #unit").addClass("checkBox01-not-checked-p");
			//$("#unit").addClass("checkBox01-not-checked-p");
			
			$("#spindle-speed-input, #payt1, , #payt2").attr("disabled", "disabled");
			//$("#payt1").attr("disabled", "disabled");
			localStorage.setItem('checkBox01', 'checked');
		} else if ($("#checkBox01").attr("checked") != "checked") {
			//console.log("not checked");
			toolStrParams.checkedByName = "n";
			$("#spindle-speed-input, #payt1").removeClass("checkBox01-not-checked");
			//$("#payt1").removeClass("checkBox01-not-checked");
			$(".payt1-choice, #unit").removeClass("checkBox01-not-checked-p");
			//$("#unit").removeClass("checkBox01-not-checked-p");
			
			$("#spindle-speed-input, #payt1, #payt2").removeAttr("disabled");
			//$("#payt1").removeAttr("disabled");
			localStorage.setItem('checkBox01', 'not checked');
		}
	}
	checkBox01_condition();
	$("#checkBox01").on("click", function() {
			checkBox01_condition();
			//$('#unit').addClass('white-flash');
			//setTimeout("$('#unit').removeClass('white-flash');", 300);
	});
	
	//animation on #payt1
	$("#payt1").on("click", function() {
		if ($("#payt1").attr("checked") != "checked") {
			//console.log("not checked");
			$("#unit").html("rpm");
			$('#unit').addClass('white-flash');
			setTimeout("$('#unit').removeClass('white-flash');", 300);
		} else if ($("#payt1").attr("checked") == "checked") {
			//console.log("checked");
			$("#unit").html("mmpm");
			$('#unit').addClass('white-flash');
			setTimeout("$('#unit').removeClass('white-flash');", 300);
			
		}
		

	});
	
	
	/* $("#starting-block-input, #radius-input, #a-input, #b-input, #d-input, #d2-input, #j-input, #spindle-speed-input, #colormodeBtn, .thread-input").on("mouseover", function() {
		$(this).css("box-shadow", "2px 1px 7px 3px gray");
	});
	$("#starting-block-input, #radius-input, #a-input, #b-input, #d-input, #d2-input, #j-input, #spindle-speed-input, #colormodeBtn, .thread-input").on("mouseout", function() {
		$(this).css("box-shadow", "");
	}); */
	
	

	$('#logo').addClass('white-flash');
	//$('#logo').css('top', '50px');
	setTimeout(function() {
		$('#logo').removeClass('white-flash');
		//$('#logo').css('top', '');
	} , 1000);
	
/* 	setTimeout(function() {
		$('#spindle-speed h3').addClass('for-spindle-speed-h3');
		//$('#logo').css('top', '');
	} , 100); */
	
	//animation cancel 
	setTimeout(function() {
		$('#cuselFrame-cnc-machine-set2, #cuselFrame-cnc-machine-set1, .inputArea, #resultArea').css('animation', 'q');
		$('#cuselFrame-cnc-machine-set2, #cuselFrame-cnc-machine-set1, .inputArea, #resultArea').css('-webkit-animation', 'q');
		$('#cuselFrame-cnc-machine-set2, #cuselFrame-cnc-machine-set1, .inputArea, #resultArea').css('-moz-animation', 'q');
		$('#cuselFrame-cnc-machine-set2, #cuselFrame-cnc-machine-set1, .inputArea, #resultArea').css('-o-animation', 'q');
	} , 2000);
	
	
	
			//middle column:
	
	
		//right column:
		

		
		
		
		
		
		
		$(".inputArea-incolor").addClass("passive-cnc-set");
		
		$("#colormodeBtn").on("click", function() {
			//$(".inputArea-incolor").toggleClass("passive-cnc-set");
			//$(".inputArea").toggleClass("passive-cnc-set");
			$("#resultArea-incolor").toggleClass("passive-cnc-set");
			$("#resultArea").toggleClass("passive-cnc-set");
			if ($("#resultArea-incolor").hasClass("passive-cnc-set")){ 
				$("#alert-block").text("NX color mode\'s off");
			} else {
				$("#alert-block").text("NX color mode has been applied");
			}
			$("#alert-block").removeClass("passive-cnc-set");
			$("#alert-block").css("box-shadow", "2px 1px 80px 3px #7699AE, inset 2px 1px 80px 3px #7699AE");
			$("#alert-block").css("border-color", "#7699AE");
			
			//clearTimeout(delay1);
			setTimeout( function() { f() }, 4000);
			//setTimeout("$('#alert-block').addClass('passive-cnc-set');", 4000);
			
		});
		
		
		
		
		//alert div seting
		

		/* $("#starting-block-input").on("click", function() {
			$(this).attr("placeholder", "");
			$(this).attr("value", "");
		}); */
		$("#starting-block-input").on("blur", function() {
			if ($(this).val() != "") {
				localStorage.setItem('startingBlock', $("#starting-block-input").val());
				}
				/* $(this).addClass("red-shadow");
				showAlertDiv("Enter the number of starting block");
			} else {$(this).removeClass("red-shadow");} */
		});
	
	
	
	
	
	
	
	//auto CL copy to clipboard
	var cutTextareaBtn1 = document.querySelector('#copy-cl-btn');

	cutTextareaBtn1.addEventListener('click', function(event) {  
    var cutTextarea1 = document.querySelector('#stringInputArea');  
    cutTextarea1.select();

    try {  
    var successful1 = document.execCommand('copy');  
    var msg = successful1 ? 'successful' : 'unsuccessful';  
    console.log('Cutting text command was ' + msg);  
    } catch(err) {  
    console.log('Oops, unable to cut');  
    }
	$("#alert-block").text("CL-data has been copied to clipboard");
	$("#alert-block").removeClass("passive-cnc-set");
	$("#alert-block").css("box-shadow", "2px 1px 80px 3px #7699AE, inset 2px 1px 80px 3px #7699AE");
	$("#alert-block").css("border-color", "#7699AE");
	
	//clearTimeout(delay1);
	setTimeout( function() { f() }, 4000);
	//setTimeout("$('#alert-block').addClass('passive-cnc-set');", 4000);
    });
	
	//auto NC copy to clipboard
	var cutTextareaBtn2 = document.querySelector('#copy-nc-btn');

	cutTextareaBtn2.addEventListener('click', function(event) {  
    if ($("#resultArea-incolor").hasClass("passive-cnc-set")) {
		var cutTextarea2 = document.querySelector('#resultArea');
	} else { 
		$("#resultArea-incolor").toggleClass("passive-cnc-set");
		$("#resultArea").toggleClass("passive-cnc-set");
		var cutTextarea2 = document.querySelector('#resultArea');
	}
	cutTextarea2.select();
	
    try {  
    var successful2 = document.execCommand('copy');  
    var msg = successful2 ? 'successful' : 'unsuccessful';  
    console.log('Cutting text command was ' + msg);  
    } catch(err) {  
    console.log('Oops, unable to cut');  
    } 
	$("#alert-block").text("NC has been copied to clipboard");
	$("#alert-block").removeClass("passive-cnc-set");
	$("#alert-block").css("box-shadow", "2px 1px 80px 3px #7699AE, inset 2px 1px 80px 3px #7699AE");
	$("#alert-block").css("border-color", "#7699AE");
	
	//clearTimeout(delay1);
	setTimeout( function() { f() }, 4000);
	//setTimeout("$('#alert-block').addClass('passive-cnc-set');", 4000);
    });
	
	//erase btn event listener
	$("#erase-cl-btn").on("click", function() {
		$("#stringInputArea").val("");
		
		$("#alert-block").text("CL input area has been cleaned");
		$("#alert-block").removeClass("passive-cnc-set");
		$("#alert-block").css("box-shadow", "2px 1px 80px 3px #7699AE, inset 2px 1px 80px 3px #7699AE");
		$("#alert-block").css("border-color", "#7699AE");
		
		setTimeout( function() { f() }, 4000);
		//setTimeout("$('#alert-block').addClass('passive-cnc-set');", 4000);
		
		//clearTimeout(delay1);
		
	});
	
	
	$("#j-input").on("focus", function() {
		$("#payt1-container img").css("display", "block");
		setTimeout( function() { $('#payt1-container img').css('display', 'none'); 
		}, 4000);
	});
	/* $("#j-input").on("blur", function() {
		$("#payt1-container img").css("display", "none");
	}); */
	
	
	
	$("#about").on("click", function() {
		//$("#about-information").toggleClass("passive-cnc-set");
		//$("#about-information").removeClass("passive-cnc-set");
		$("#about-information").toggleClass("moveright");
		//a1 = 0;
	});
	$("#about").on("mouseover", function() {
		b1 = 1;
	});
	$("#about").on("mouseout", function() {
		b1 = 0;
	});
	var a1 = 0,
		b1 = 0;
	$("#about-information, #about-information p").on("mouseout", function() {
		a1 = 0;
	});
	$("#about-information, #about-information p").on("mouseover", function() {
		a1 = 1;
	});
	$("*:not(#about-information, #about)").on('click', function(event) {  
		if ((a1===0)&&(b1===0)&& (!($("#about-information").hasClass("moveright")))) {
			$("#about-information").addClass("moveright");
		} 
	});
	
	
	
	
	
	
	//acurate height setting of middle clocks-----(start)
	function postGetBlockSizes()  {
		$("#stringInputArea").css("height", (((document.body.clientHeight)/2)-100) + "px");
		$("#resultArea").css("height", ((document.body.clientHeight)/2-40 -8 ) + "px");
		$("#resultArea-incolor").css("height", ((document.body.clientHeight)/2-40 -2 ) + "px");
		//console.log($("#render-envelope").css("width"));
	}
	$(window).on("load", postGetBlockSizes); 
	$(window).on("resize", postGetBlockSizes); 
	//acurate height setting of middle clocks ---------(end)
	 
	 
	//console.log($("#render-envelope").css("width"));
});








