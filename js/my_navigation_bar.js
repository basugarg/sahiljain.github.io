/*$(document).ready(function() {
	$("nav").load("/my_nav_bar.html");
});*/
$(document).ready(function() {

                var num = parseInt($("nav").attr("page"))+1;
               $(".navbar-left > li:nth-child(" + num + ")").addClass('active');

              });