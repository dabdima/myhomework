$("#render-tool-path").on("click", function() {
	$("#right-container, #middle-container, #middle-container-thread, #left-container").css("display", "none");
	$("#render-container").css("display", "block");
});
$("#NXpost").on("click", function() {
	$("#render-container, #middle-container-thread").css("display", "none");
	$("#right-container, #middle-container, #left-container").css("display", "block");
});









$("#render-container").css("height", document.body.clientHeight + "px");

	
	function rendertoolpath() {
		var rangeX = toolStrParams.Xmax - toolStrParams.Xmin,
			rangeZ = toolStrParams.Zmax - toolStrParams.Zmin;
			console.log(rangeX + " rangeX " + rangeZ + " rangeZ ");
		var z0start = 100, x0start = 100,
			c = 9,  // zoom;
			lTh = 1; // line thickness
		var add = function(a, inc, i){
			if (i === "z") {
				return c*(+(a) - (toolStrParams.Zmin)) + (inc/2);
			}
			if (i === "x") {
				return c*(+(a) - (toolStrParams.Xmin)) + (inc/2);
			}
		}
		
		var Svg = document.getElementById("renderSvg");
		Svg.setAttribute("width",c*rangeZ + z0start);
		Svg.setAttribute("height",c*(rangeX/2) + x0start);
		//Svg.setAttribute("viewBox", "0 0 "+(c*rangeZ + z0start)+" "+(c*(rangeX/2) + x0start));
		
		
		/* var innerPath = document.createElementNS("http://www.w3.org/2000/svg", 'line');
		innerPath.setAttribute("x1","10"); //Set path's data
		innerPath.setAttribute("y1","10"); //Set path's data
		innerPath.setAttribute("x2","350"); //Set path's data
		innerPath.setAttribute("y2","200"); //Set path's data
		innerPath.style.stroke = "#fff"; //Set stroke colour
		innerPath.style.strokeWidth = "0.25px"; //Set stroke width
		Svg.appendChild(innerPath); */
		
		/* var svgDiv = document.createElement("svg");
		svgDiv.setAttribute('id', 'svg-block');
		svgDiv.setAttribute('width', 1000);
		svgDiv.setAttribute('height', 800);
		svgDiv.innerHTML = newqqq;
		
		(document.getElementById("render-envelope")).appendChild(svgDiv); */
		
		//svgDiv.innerHTML += "<title>Toolpath-tittle<\/title><desc>Toolpath-description<\/desc>";
		//svgDiv.innerHTML += "<g id=\"dsss\">" + "<line x1=\"" + 50+ "\" y1=\"" +50 + "\" x2=\"" + 200+ "\" y2=\"" +200 + "\"" + ""+ " style=\"stroke: black;\"  \/>" + "<\/g>";
		
		
		
		
		//$("#render-envelope").append(svgDiv);
		//$("#svg-block").append("<title>Toolpath-tittle<\/title><desc>Toolpath-description<\/desc>");
		
		//document.getElementById("svg-block").innerHTML += "<title>Toolpath-tittle<\/title><desc>Toolpath-description<\/desc>";

		var xPrev, zPrev,
			x, z, f, r,
			fCut, fIdle, 
			gGroup1Prev,
			gGroup1 = 1, //G1, G2, G3
			gGroup2, //G94, G95    //so far , I don't use
			
			regG1 = /G1 /,
			regG2 = /G2 /,
			regG3 = /G3 /,
			regG94 = /G94 /, //so far , I don't use
			regG95 = /G95 /, //so far , I don't use
			regX = /X-{0,1}\d+\.{0,1}\d{0,}/, //   X123.123
			regZ = /Z-{0,1}\d+\.{0,1}\d{0,}/, //   Z123.123
			regF = /F\d+\.{0,1}\d{0,}/, //   F123.123
			regR = /(CR=\d+\.{0,1}\d{0,})|(R\d+\.{0,1}\d{0,})/;
			
			
			
		/* var elem = document.createElement("line");
		elem.setAttribute('x1', 20);
		elem.setAttribute('y1', 20);
		elem.setAttribute('x2', 200);
		elem.setAttribute('y2', 200);
		elem.setAttribute('style', "stroke: black;");*/
		//var elem = "<line x1=\"" + 50+ "\" y1=\"" +50 + "\" x2=\"" + 200+ "\" y2=\"" +200 + "\"  \/>";
		//document.getElementById("svg-block").innerHTML +="<g id=\"dsss\">" + "<line x1=\"" + 50+ "\" y1=\"" +50 + "\" x2=\"" + 200+ "\" y2=\"" +200 + "\"" + ""+ " style=\"stroke: black;\"  \/>" + "<\/g>";
		//$("#svg-block").append(elem);
		
		for (i=0; i<renderBlArr.length; i++) {
	
	
			var newEl = document.createElement("div");
			newEl.innerHTML = "<span class=\"" + renderBlArr[i].blockStyle  + "\">" + renderBlArr[i].str    + "<\/span>";
			$("#blocks-list").append(newEl);
			
			
			if (regG1.test(renderBlArr[i].str)) {
				gGroup1 = 1;
				//console.log(gGroup1 + " g1 found");
			} else
			if (regG2.test(renderBlArr[i].str)) {
				gGroup1 = 2;
				//console.log(gGroup1 + " g2 found");
			} else
			if (regG3.test(renderBlArr[i].str)) {
				gGroup1 = 3;
				//console.log(gGroup1 + " g3 found");
			}
			
			if (regR.test(renderBlArr[i].str)) {
				r = ((renderBlArr[i].str).match(regR))[0];
				if ((/CR=\d+\.{0,1}\d{0,}/).test(r)) r = r.slice(3);
				else r = r.slice(1);
				//console.log(r + " R found");
			}
			
/* 			if gGroup1 {
				if (gGroup1Prev === undefined) gGroup1Prev = gGroup1;
			} */
			
			
			
			if (regX.test(renderBlArr[i].str)) {
				x = (((renderBlArr[i].str).match(regX))[0]).slice(1);
				//console.log(x + " X found");
				if (xPrev === undefined) {xPrev = x; //console.log(xPrev + " Xprev found");
				}
			}
			if (regZ.test(renderBlArr[i].str)) {
				z = (((renderBlArr[i].str).match(regZ))[0]).slice(1);
				//console.log(z + " Z found");
				if (zPrev === undefined) {zPrev = z; //console.log(zPrev + " Zprev found");
				}
			}
			if (regF.test(renderBlArr[i].str)) {
				f = (((renderBlArr[i].str).match(regF))[0]).slice(1);
				//console.log(f + " F found");
			}
		
			
			if ((xPrev !== undefined) && (zPrev !== undefined)) {
				if ((xPrev !== x) || (zPrev !== z)) {
					//console.log(gGroup1 + " --------------------------------");
					if (gGroup1 == 1) {
						//var elem = "<line x1=\"" + zPrev+ "\" y1=\"" +xPrev + "\" x2=\"" + z+ "\" y2=\"" +x + "\"  \/>";
						var innerPath = document.createElementNS("http://www.w3.org/2000/svg", 'line');
						innerPath.setAttribute("x1", add(zPrev, z0start, "z"));
						innerPath.setAttribute("y1", add(xPrev, x0start*2, "x")/2);
						innerPath.setAttribute("x2", add(z, z0start, "z"));
						innerPath.setAttribute("y2", add(x, x0start*2, "x")/2); 
						/* innerPath.setAttribute("x1", zPrev);
						innerPath.setAttribute("y1", xPrev);
						innerPath.setAttribute("x2", z);
						innerPath.setAttribute("y2", x);  */
						innerPath.setAttribute("class", renderBlArr[i].blockStyle);
						//innerPath.style.stroke = "#fff"; //Set stroke colour
						innerPath.style.strokeWidth = lTh +"px"; //Set stroke width
						Svg.appendChild(innerPath);
						
						
						xPrev = x, zPrev = z;
						//console.log(innerPath + " innerPath +!");
					} else 
					if ((gGroup1 == 2) || (gGroup1 == 3)) {
						var direction = gGroup1==2?0:1;
						//var elem = "<line x1=\"" + zPrev+ "\" y1=\"" +xPrev + "\" x2=\"" + z+ "\" y2=\"" +x + "\"  \/>";
						var innerPath = document.createElementNS("http://www.w3.org/2000/svg", 'path');
						innerPath.setAttribute("d", "M "+add(zPrev, z0start, "z")+","+add(xPrev, x0start*2, "x")/2+" A "+c*r+","+c*r+" 0 0, " + direction +" "+add(z, z0start, "z")+","+add(x, x0start*2, "x")/2); //Set path's data
						//innerPath.setAttribute("y1", xPrev); //Set path's data
						//innerPath.setAttribute("x2", z); //Set path's data
						//innerPath.setAttribute("y2", x); //Set path's data
						//innerPath.style.stroke = "#fff333"; //Set stroke colour
						innerPath.style.strokeWidth = lTh +"px"; 
						innerPath.style.fill = "none"; 
						innerPath.setAttribute("class", renderBlArr[i].blockStyle);
						Svg.appendChild(innerPath);
						
						
						xPrev = x, zPrev = z;
						//console.log(innerPath + " innerPath G2 +!");
					}
				}
			}
			
			
			
		
		}
		
		//console.log(toolStrParams.Zmin + ", " +toolStrParams.Zmax + ", " +toolStrParams.Xmin + ", " +toolStrParams.Xmax);
	
		//console.log(document.body.clientHeight + "высота браузера");
	}
	
	
	
	
	


