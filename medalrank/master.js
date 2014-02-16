$(document).ready(function() {
	var bronzeWorth = 1;
	var silverWorth = 5;
	var goldWorth = 25;
	$(".table").hide();
	var myurl = "http://olympics.clearlytech.com/api/v1/medals";
	$.getJSON('http://whateverorigin.org/get?url=' + encodeURIComponent(myurl) + '&callback=?', function(data){
		var countries = $.parseJSON(data.contents);
		for (var i = 0; i < countries.length; i++) {
			var score = countries[i].gold_count*goldWorth+countries[i].bronze_count*bronzeWorth+countries[i].silver_count*silverWorth;
			countries[i]["score"] = score;
		};
		countries.sort(function(a,b){
			return b["score"] - a["score"];
		});
		for (var i = 0; i <  countries.length;i++) {
			$(".table").append("<tr><td>" + (i+1) + "</td><td>" + countries[i]["country_name"] + "</td><td>" +  countries[i]["gold_count"] + "</td><td>" + countries[i]["silver_count"] + "</td><td>" + countries[i]["bronze_count"] + "</td><td>" + countries[i]["score"] + "</td></tr>");
		};
		$(".load").hide();
		$(".table").show();
	});
});

