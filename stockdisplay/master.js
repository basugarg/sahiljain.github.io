var canvasWidth, canvasHeight;
var stickWidth = 15;
var stickGap = 10;

$(document).ready(function($) {

	canvasWidth = $(window).width()-3*parseInt($("canvas").css("margin-right"));
	canvasHeight = 600;

	document.getElementById("canvas").width = canvasWidth;
	document.getElementById("canvas").height = canvasHeight;
	var canv = document.getElementById("canvas");
	if(canv.getContext){
		var canvas = canv.getContext("2d");
	}else{
		alert("Sorry, your browser is not supported");
	}

	canvas.lineWidth = 1;
    //canvas.strokeRect (10, 10, 55, 50);
	
	$("input#ticker-submit").on("click", function(){
		var ticker = $("input#ticker").val();

		var today = new Date();
		var twoDigitMonth = ((today.getMonth()>8))? (today.getMonth()+1) : '0' + (today.getMonth()+1);
		var twoDigitDay = ((today.getDate().length+1) === 1)? (today.getDate()) : '0' + (today.getDate());
		var currentDateString = today.getFullYear() + "-" + twoDigitMonth + "-" + twoDigitDay;

		var old = new Date();
		old.setDate(today.getDate()-105);
		//console.log("old get month length is " + old.getMonth());
		var twoDigitMonth = ((old.getMonth()>8))? (old.getMonth()+1) : '0' + (old.getMonth()+1);
		var twoDigitDay = ((old.getDate().length+1) === 1)? (old.getDate()) : '0' + (old.getDate());
		var oldDateString = old.getFullYear() + "-" + twoDigitMonth + "-" + twoDigitDay;

		//alert("today is " + currentDateString + "and it was " + oldDateString);
		var url = "http://query.yahooapis.com/v1/public/yql?q=select%20*%20from%20yahoo.finance.historicaldata%20where%20symbol%20%3D%20%22"+ticker+"%22%20and%20startDate%20%3D%20%22" + oldDateString + "%22%20and%20endDate%20%3D%20%22" + currentDateString + "%22&format=json&diagnostics=true&env=store%3A%2F%2Fdatatables.org%2Falltableswithkeys&callback=?";
		$.getJSON(url, null, function(data){

			
			if(data.query.results){
				var quotes = data.query.results.quote;
				console.log(quotes);
				canvas.clearRect(0,0,canvasWidth,canvasHeight);
				drawCandles(canvas, quotes);
			}else{
				alert("Could not find " + ticker);
			}
		


		
	});
	});


	


});

function drawCandles(canvas, quotes){
	//iterate through these 1 by 1, right to left, start drawing from right
	//scale each candle 1 by 1
	//make min the bottom, max the top

	//height/(max-min) = pixels per dollar
	//canvas.strokeRect(50,50,10,2);
	quotes = quotes.slice(0,70);

	var min = quotes[0].Low;
	var max = quotes[0].High;
		
	for(var i = quotes.length - 1; i >=0 ; i--){
		//alert(data.query.results.quote[0].Close);
		//if(quotes[i].Low < min) min = quotes[i].Low;
		//if(quotes[i].High > max) max = quotes[i].High;
		//$(".data").append(quotes[i].Date + "&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;:" + quotes[i].Close + "<br>");

		min = Math.min(min, quotes[i].Open, quotes[i].Close, quotes[i].High, quotes[i].Low);
		max = Math.max(max, quotes[i].Open, quotes[i].Close, quotes[i].High, quotes[i].Low);

	}
	//alert ("min and max, " + min + " " + max);
	var coeff = canvasHeight/(max-min);
	var curX = canvasWidth - stickWidth;
	canvas.beginPath();
	for (var i = 0; i  < quotes.length ; i++) {
			
			curX -= stickWidth + stickGap;
			if(curX < 1) break;
			console.log("i: " + i);
			var closePix = (quotes[i].Close-min)*coeff;
			var highPix = (quotes[i].High-min)*coeff;
			var lowPix = (quotes[i].Low-min)*coeff;
			var openPix = (quotes[i].Open-min)*coeff;
			console.log("i, close, high, low, open " + i + " " + closePix + " " + highPix + " " + lowPix + " " + openPix);

			if(closePix >= openPix){//drawing a positive bar
				canvas.fillStyle = "white";
				canvas.fillRect(curX,canvasHeight-closePix, stickWidth,closePix-openPix);
				//draw high and low bar
				canvas.moveTo(curX + stickWidth/2, canvasHeight-lowPix);
				canvas.lineTo(curX + stickWidth/2, canvasHeight-highPix);

			}else{//negativebar
				canvas.strokeStyle = "white";
				canvas.strokeRect(curX,canvasHeight-openPix, stickWidth,openPix-closePix);
				canvas.moveTo(curX + stickWidth/2, canvasHeight-lowPix);
				canvas.lineTo(curX + stickWidth/2, canvasHeight-closePix);
				canvas.moveTo(curX + stickWidth/2, canvasHeight-openPix);
				canvas.lineTo(curX + stickWidth/2, canvasHeight-highPix);
			}
			canvas.stroke();



			//canvas.strokeRect(canvasWidth - i*stickWidth-stickWidth - (i)*stickGap,canvasHeight-closePix, stickWidth,2);
	};
}