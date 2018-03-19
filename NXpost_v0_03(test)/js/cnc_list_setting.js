$(document).ready(function(){
	
		//localStorage setting for #cnc-type
	if (localStorage.getItem('lastSelectedCnc') === "") {
		localStorage.setItem('lastSelectedCnc', $("#cusel-scroll-cnc-type .cuselActive").text());
	} else
	if ((localStorage.getItem('lastSelectedCnc') != "") && (localStorage.getItem('lastSelectedCnc') != $("#cusel-scroll-cnc-type span").eq(0).text())) {
		$("#cusel-scroll-cnc-type .cuselActive").toggleClass("cuselActive");
		var t = localStorage.getItem('lastSelectedCnc');
		//console.log($("#cusel-scroll-cnc-type span:contains(t)"));
		for (i=0; i<$("#cusel-scroll-cnc-type span").length; i++) {
			if ($("#cusel-scroll-cnc-type span").eq(i).text() === t) {
				$("#cusel-scroll-cnc-type span").eq(i).addClass("cuselActive");
			}
		}
		$("#cuselFrame-cnc-type .cuselText").text($("#cusel-scroll-cnc-type .cuselActive").text());
	}
	
	
	//event "on"
	$("#cuselFrame-cnc-type .cusel-scroll-wrap").on("mouseout", function() {
		//console.log(productionСapacity.cncTypes[0].text + "qqq");
		localStorage.setItem('lastSelectedCnc', $("#cusel-scroll-cnc-type .cuselActive").text());
		
		//console.log($("#cusel-scroll-cnc-type .cuselActive").text());
		//console.log(productionСapacity.cncTypes[0].text);
		
		// active/passive div set (on event "on")
		for (i=0; i<productionСapacity.cncTypes.length; i++) {
			if (localStorage.getItem('lastSelectedCnc') === productionСapacity.cncTypes[i].text) {
				if ($(".left-column-setting .left-column-setting-div").eq(productionСapacity.cncTypes[i].value).hasClass("active-cnc-set")) {
					$(".left-column-setting .left-column-setting-div").eq(productionСapacity.cncTypes[i].value).removeClass("active-cnc-set");
				}   
				if ($(".left-column-setting .left-column-setting-div").eq(productionСapacity.cncTypes[i].value).hasClass("passive-cnc-set")) {
					$(".left-column-setting .left-column-setting-div").eq(productionСapacity.cncTypes[i].value).removeClass("passive-cnc-set");
				} 
				$(".left-column-setting .left-column-setting-div").eq(productionСapacity.cncTypes[i].value).addClass("active-cnc-set");
			} else {
				if ($(".left-column-setting .left-column-setting-div").eq(productionСapacity.cncTypes[i].value).hasClass("active-cnc-set")) {
					$(".left-column-setting .left-column-setting-div").eq(productionСapacity.cncTypes[i].value).removeClass("active-cnc-set");
				}   
				if ($(".left-column-setting .left-column-setting-div").eq(productionСapacity.cncTypes[i].value).hasClass("passive-cnc-set")) {
					$(".left-column-setting .left-column-setting-div").eq(productionСapacity.cncTypes[i].value).removeClass("passive-cnc-set");
				} 
				$(".left-column-setting .left-column-setting-div").eq(productionСapacity.cncTypes[i].value).addClass("passive-cnc-set");
			}
		}
	});
	
	
	// active/passive div set (on load)
	for (i=0; i<productionСapacity.cncTypes.length; i++) {
		if (localStorage.getItem('lastSelectedCnc') === productionСapacity.cncTypes[i].text) {
			if ($(".left-column-setting .left-column-setting-div").eq(productionСapacity.cncTypes[i].value).hasClass("active-cnc-set")) {
				$(".left-column-setting .left-column-setting-div").eq(productionСapacity.cncTypes[i].value).removeClass("active-cnc-set");
			}   
			if ($(".left-column-setting .left-column-setting-div").eq(productionСapacity.cncTypes[i].value).hasClass("passive-cnc-set")) {
				$(".left-column-setting .left-column-setting-div").eq(productionСapacity.cncTypes[i].value).removeClass("passive-cnc-set");
			} 
			$(".left-column-setting .left-column-setting-div").eq(productionСapacity.cncTypes[i].value).addClass("active-cnc-set");
		} else {
			if ($(".left-column-setting .left-column-setting-div").eq(productionСapacity.cncTypes[i].value).hasClass("active-cnc-set")) {
				$(".left-column-setting .left-column-setting-div").eq(productionСapacity.cncTypes[i].value).removeClass("active-cnc-set");
			}   
			if ($(".left-column-setting .left-column-setting-div").eq(productionСapacity.cncTypes[i].value).hasClass("passive-cnc-set")) {
				$(".left-column-setting .left-column-setting-div").eq(productionСapacity.cncTypes[i].value).removeClass("passive-cnc-set");
			} 
			$(".left-column-setting .left-column-setting-div").eq(productionСapacity.cncTypes[i].value).addClass("passive-cnc-set");
		}
	}
	
	
/* 	//localStorage setting for #cnc-machine
	if (localStorage.getItem('lastSelectedMachine') === "") {
		localStorage.setItem('lastSelectedMachine', $(".active-cnc-set div .cuselText").text());
	} else
	if ((localStorage.getItem('lastSelectedCnc') != "") && (localStorage.getItem('lastSelectedCnc') != $("#cusel-scroll-cnc-type span").eq(0).text())) {
		$("#cusel-scroll-cnc-type .cuselActive").toggleClass("cuselActive");
		var t = localStorage.getItem('lastSelectedCnc');
		console.log($("#cusel-scroll-cnc-type span:contains(t)"));
		for (i=0; i<$("#cusel-scroll-cnc-type span").length; i++) {
			if ($("#cusel-scroll-cnc-type span").eq(i).text() === t) {
				$("#cusel-scroll-cnc-type span").eq(i).addClass("cuselActive");
			}
		}
		$("#cuselFrame-cnc-type .cuselText").text($("#cusel-scroll-cnc-type .cuselActive").text());
	}
	 */
	
	
	//event "on" for active machine div
	$(".active-cnc-set div .cusel-scroll-wrap").on("mouseout", function() {
		localStorage.setItem('lastSelectedMachine', $('.active-cnc-set div .cuselText').text());
		
		console.log($(".active-cnc-set div .cuselText").text() +" 1st");
		console.log($(".active-cnc-set div div div .cuselActive").text());
		
		// active/passive div tool-offset rules

	});
	/* $(".active-cnc-set div .cusel-scroll-wrap .jScrollPaneContainer .cusel-scroll-pane span").on("mouseout", function() {
		localStorage.setItem('lastSelectedMachine', $('.active-cnc-set div .cuselText').text());
		
		console.log($(".active-cnc-set div .cuselText").text() +" 1st");
		console.log($(".active-cnc-set div div div .cuselActive").text());
		
		// active/passive div tool-offset rules

	}); */
	
	$("#cuselFrame-cnc-type .cusel-scroll-wrap").on("mouseout", function() {
		localStorage.setItem('lastSelectedMachine', $(".active-cnc-set div .cuselText").text());
		
		console.log($(".active-cnc-set div .cuselText").text() +" 1st");
		console.log($(".active-cnc-set div div div .cuselActive").text());
	});
	
	
	
	
	
	
	
	
//tool parameters divs setting
	function settingSBL500() {
		if  (($(".active-cnc-set div .cuselText").text() == "SBL-500"||"Lynx300M"||"Puma MX2600 (not ready)")&&(!$("#tool-parameters").hasClass("passive-cnc-set"))) {
			$("#tool-parameters").addClass("passive-cnc-set");
		}
	};
	settingSBL500();
	function settingSE820() {
		if  (($(".active-cnc-set div .cuselText").text() == "SE-820")&&($("#tool-parameters").hasClass("passive-cnc-set"))) {
			$("#tool-parameters").removeClass("passive-cnc-set");
		}
	};
	settingSE820();
	$("#cuselFrame-cnc-type .cusel-scroll-wrap, .active-cnc-set div .cusel-scroll-wrap, #cusel-scroll-cnc-machine-set1 span").on("mouseout", function() {
		settingSBL500();
		settingSE820();
	});
	
	
	
	
	
	
});