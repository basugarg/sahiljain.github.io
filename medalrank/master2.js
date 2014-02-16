	var bronzeWorth = 1;
	var silverWorth = 5;
	var goldWorth = 25;
	var failed = true;

$(document).ready(function($) {
		$(".table").hide();
});

function kimonoCallback(data) {

	failed = false;
	//console.log(data);
    var countries = data.results.collection1;
    if(countries.length < 2){
    	alert("Could not load data, sryz");
    	return;
    }
		for (var i = 0; i < countries.length; i++) {
			var score = countries[i].Gold*goldWorth+countries[i].Bronze*bronzeWorth+countries[i].Silver*silverWorth;
			countries[i]["score"] = score;
		};
		countries.sort(function(a,b){
			return b["score"] - a["score"];
		});
		for (var i = 0; i <  countries.length;i++) {
			$(".table").append("<tr><td>" + (i+1) + "</td><td>" + countries[i]["Country"]["text"] + "</td><td>" +  countries[i]["Gold"] + "</td><td>" + countries[i]["Silver"] + "</td><td>" + countries[i]["Bronze"] + "</td><td>" + countries[i]["score"] + "</td></tr>");
		};
		$(".load").hide();
		$(".table").show();
}

$.ajax({
    "url":"http://www.kimonolabs.com/api/5cvbjyj4?apikey=1951128d06008e5342058ed90cd155de&callback=kimonoCallback",
    "crossDomain":true,
    "dataType":"jsonp",
  

});

setTimeout(function() {
	if(failed){
		location.reload();
	}
}, 1000);
