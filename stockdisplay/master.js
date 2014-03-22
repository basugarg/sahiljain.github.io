var canvasWidth, canvasHeight = 400;
var stickWidth = 10;
var stickGap = 10;
var VolumeHeight = 75;
var stockHeight = canvasHeight - VolumeHeight;
var stockList = ["MMM","AXP","T","BA","CAT","CVX","CSCO","KO","DD","XOM","GE","GS","HD","INTC","IBM","JNJ","JPM","MCD","MRK","MSFT","NKE"];

$(document).ready(function($) {

	canvasWidth = $(window).width()-3*parseInt($("canvas").css("margin-right"));

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
		var twoDigitDay = (today.getDate() > 9)? (today.getDate()) : '0' + (today.getDate());
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
				
				canvas.clearRect(0,0,canvasWidth,canvasHeight);
				drawCandles(canvas, quotes);
			}else{
				alert("Could not find " + ticker);
			}
	});
	});

});

function drawCandles(canvas, totalquotes){
	//iterate through these 1 by 1, right to left, start drawing from right
	//scale each candle 1 by 1
	//make min the bottom, max the top

	//height/(max-min) = pixels per dollar
	//canvas.strokeRect(50,50,10,2);
	var quotes = totalquotes.slice(0,70);

	var min = parseFloat(quotes[0].Low);
	var max = parseFloat(quotes[0].High);
	var volumes = new Array();
	//var maxVol = quotes[0].Volume;
	//console.log("maxvol: " + maxVol);
		
	for(var i = quotes.length - 1; i >=0 ; i--){
		//alert(data.query.results.quote[0].Close);
		//if(quotes[i].Low < min) min = quotes[i].Low;
		//if(quotes[i].High > max) max = quotes[i].High;
		//$(".data").append(quotes[i].Date + "&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;:" + quotes[i].Close + "<br>");

		min = Math.min(min, parseFloat(quotes[i].Low));
		max = Math.max(max, parseFloat(quotes[i].High));
		//maxVol = Math.max(maxVol, quotes[i].Volume);
		volumes.push(parseInt(quotes[i].Volume));

	}

	//draw the prices and stuff here
	canvas.textAlign = "right";
	volumes.sort(function(a,b){return a-b});
	var maxVol = volumes[volumes.length-1];
	var IQR = volumes[Math.ceil(volumes.length*3/4)]-volumes[Math.floor(volumes.length*1/4-1)];
	var threshold = 3*IQR+volumes[Math.floor(volumes.length*3/4-1)];
	//so now if a volume is above threshold, then it's an outlier


	//console.log("maxvol: " + maxVol);
	//alert ("min and max, " + min + " " + max);
	var coeff = stockHeight/(max-min);
	var curX = canvasWidth - stickWidth;
	canvas.beginPath();
	canvas.strokeStyle = "white";
	canvas.moveTo(0,stockHeight);
	canvas.lineTo(canvasWidth,stockHeight);
	canvas.stroke();
	for (var i = 0; i  < quotes.length ; i++) {
			
			curX -= stickWidth + stickGap;
			if(curX < 1) break;
			var closePix = (parseFloat(quotes[i].Close)-min)*coeff;
			var highPix = (parseFloat(quotes[i].High)-min)*coeff;
			var lowPix = (parseFloat(quotes[i].Low)-min)*coeff;
			var openPix = (parseFloat(quotes[i].Open)-min)*coeff;
			var lineX = curX + stickWidth/2;
			var pos = closePix >= openPix;
			canvas.strokeStyle = "white";
			canvas.fillStyle = "white";

			if(quotes[i].Volume > threshold){
				if(pos){
					canvas.strokeStyle = "green";
					canvas.fillStyle = "green";
				}else{
					canvas.strokeStyle = "red";
				}
			}

			if(pos){//drawing a positive bar
				canvas.beginPath();
				//canvas.fillStyle = "white";
				//canvas.strokeStyle = "white";
				canvas.fillRect(curX,stockHeight-closePix, stickWidth,closePix-openPix);
				//draw high and low bar
				canvas.moveTo(lineX, stockHeight-lowPix);
				canvas.lineTo(lineX, stockHeight-highPix);

			}else{//negativebar
				canvas.beginPath();
				//canvas.strokeStyle = "white";
				canvas.strokeRect(curX,stockHeight-openPix, stickWidth,openPix-closePix);
				canvas.moveTo(lineX, stockHeight-lowPix);
				canvas.lineTo(lineX, stockHeight-closePix);
				canvas.moveTo(lineX, stockHeight-openPix);
				canvas.lineTo(lineX, stockHeight-highPix);
			}
			canvas.stroke();


			
				canvas.beginPath();
				canvas.moveTo(lineX,canvasHeight);
				canvas.lineTo(lineX, canvasHeight - VolumeHeight*(parseInt(quotes[i].Volume)/maxVol));
				//console.log("vol: " + quotes[i].Volume + " max is " + maxVol);
				canvas.stroke();
			//canvas.strokeRect(canvasWidth - i*stickWidth-stickWidth - (i)*stickGap,canvasHeight-closePix, stickWidth,2);
	}
}