$(document).ready(function(){
	$(".top").height($(window).height());
	$("#me").click(function(){
		$('html, body').animate({
			scrollTop: $(".bot > #me").offset().top
			}, 800);
	});
	$("#projects").click(function(){
		$('html, body').animate({
			scrollTop: $(".bot > #projects").offset().top
			}, 800);
	});
	$("#resume").click(function(){
		$('html, body').animate({
			scrollTop: $(".bot > #resume").offset().top
			}, 800);
	});
});