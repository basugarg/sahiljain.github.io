
$(document).ready(function() {

	$.getJSON('http://api.uwaterloo.ca/v2/foodservices/locations.json?key=f37a2830b2b3e202ce41630ba994ba0d', function(data) {
			var stores = data.data;
			stores.sort(function (a,b){
				if(a.building < b.building){
					return -1;
				}
				return 1;
			});
			var closed = true;
			$.each(stores, function(index, store) {
				 if(store.is_open_now){
				 	closed = false;
				 	$(".table").append('<tr><td>' + store.outlet_name + "</td><td>" + store.building + '</td></tr>');
				 }
			});
			if (closed){
				$(".table").after('<h2>Nothing is open LOL</h2>');
			}
	});

});

