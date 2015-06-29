
// $(document).ready(function() {

// 	$.getJSON('http://api.uwaterloo.ca/v2/foodservices/locations.json?key=f37a2830b2b3e202ce41630ba994ba0d', function(data) {
// 			var stores = data.data;
// 			stores.sort(function (a,b){
// 				if(a.building < b.building){
// 					return -1;
// 				}
// 				return 1;
// 			});
// 			console.log(stores[0]);
// 			var closed = true;
// 			$.each(stores, function(index, store) {
// 				 if(store.is_open_now){
// 				 	closed = false;
// 				 	$(".table").append('<tr><td>' + store.outlet_name + "</td><td>" + store.building + '</td></tr>');
// 				 }
// 			});
// 			if (closed){
// 				$(".table").after('<h2>Nothing is open LOL</h2>');
// 			}
// 	});

// });

var sortFunction = function(a, b) {
  if(a.building < b.building){
    return -1;
  }
  return 1;
};

var ExampleApplication = React.createClass({
	getInitialState: function() {
    return {
      stores: [{outlet_name: "Loading...", building: ""}]
    };
  },
  componentDidMount: function() {
    $.getJSON('http://api.uwaterloo.ca/v2/foodservices/locations.json?key=f37a2830b2b3e202ce41630ba994ba0d', function(data) {
      var stores = data.data;
      stores.sort(sortFunction);
      var output = [];
      $.each(stores, function(index, store) {
        if(store.is_open_now){
          // console.log(store);
          output.push(store);
        }
      });
        this.setState({
          stores: output
        });
    }.bind(this));
  },
  render: function() {
    if (this.state.stores.length == 0) {
      return (
          <h2>Nothing is open LOL</h2>
        );
    } else {
      return (
        <table id="mytable" className="table table-striped table-bordered">
          <thead>
            <tr><th>Restaurant</th><th width="40px">Building</th></tr>
          </thead>
          <tbody>
          {this.state.stores.map(function(store, i) {
              return (<tr key={i}><td> <img width="50px" height="50px" src={store.logo} /> &nbsp; {store.outlet_name} </td><td style={{"verticalAlign":"middle"}}> {store.building} </td></tr>);
            }
          )}
          </tbody>
        </table>
      );
    }
  }
});

React.render(
  <ExampleApplication />,
  document.getElementById('container')
);
