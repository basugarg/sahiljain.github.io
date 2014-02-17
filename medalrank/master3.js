	var failed = true;

$(document).ready(function($) {
		$(".table").hide();
});

function kimonoCallback(data) {
	var bronzeWorth = 1;
	var silverWorth = 5;
	var goldWorth = 25;

	failed = false;
	//console.log(data);
    var countries = data.data;
    if(countries.length < 2){
    	alert("Could not load data, sryz");
    	return;
    }
		for (var i = 0; i < countries.length; i++) {
			var score = countries[i].medals.gold*goldWorth+countries[i].medals.bronze*bronzeWorth+countries[i].medals.silver*silverWorth;
			countries[i]["score"] = score;
		};
		countries.sort(function(a,b){
			return b["score"] - a["score"];
		});
		for (var i = 0; i <  countries.length;i++) {
			$(".table").append("<tr><td>" + (i+1) + "</td><td>" + countries[i]["name"] + "</td><td>" +  countries[i]["medals"]["gold"] + "</td><td>" + countries[i]["medals"]["silver"] + "</td><td>" + countries[i]["medals"]["bronze"] + "</td><td>" + countries[i]["score"] + "</td></tr>");
		};
		$(".load").hide();
		$(".table").show();
}

$.ajax({
    "url":"http://sochi.kimonolabs.com/api/countries?fields=name,medals&limit=100&apikey=1951128d06008e5342058ed90cd155de&callback=kimonoCallback",
    "crossDomain":true,
    "dataType":"jsonp",
});

setTimeout(function() {
	if(failed){
		location.reload();
	}
}, 2200);