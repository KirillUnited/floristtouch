
function initializeMap(lat, longitude, zoom) {


	  var location = new google.maps.LatLng(lat,longitude);
	  var mapOptions = {
	      zoom: 16,
	      center: location,
	      mapTypeId: google.maps.MapTypeId.ROADMAP,
	      draggable: false,
	      navigationControl: true,
				navigationControlOptions: {
				style: google.maps.NavigationControlStyle.ZOOM_PAN,
				position: google.maps.NavigationControlStyle.ZOOM_PAN
		}


	  };

        var map = new google.maps.Map(document.getElementById("map"), mapOptions);

         var marker = new google.maps.Marker({
         	position: new google.maps.LatLng(lat,longitude),
         	map: map,
         	title: 'We are here'

         });

 };
