
var webService, panorama, map, marker, marker2;
var MY_MAPTYPE_ID = 'custom_style';

//************************************************************
// TELEPORTER BUTTON FUNCTIONS
//************************************************************

function randPoint() {
	var randomLocation = randomLatLng();
	setNearestPanorama(randomLocation);
} 

function randomLatLng() {
		var randomLatitude = Math.random()*180 - 90;
		var randomLongitude = Math.random() * 360 - 180;
		return new google.maps.LatLng(randomLatitude, randomLongitude);
}  // end of randomLatLng

function setNearestPanorama(latLng, bounds) {

	var checkaround = bounds || 50;
	// The function will search within checkaround meters of latLng.
	webService.getPanoramaByLocation(latLng, checkaround, checkNearestStreetView);
		 
	function checkNearestStreetView(panoData) {
		// Called when getPanoramaByLocation has results.
		var found=false;
		if (panoData) {
			 if (panoData.location) {
					if (panoData.location.latLng) {
						// We're done. We have a good location.
						found=true;
					}
			 }
		}
		if (found) {
			panorama.setPosition(panoData.location.latLng);
			map.setCenter(panoData.location.latLng);
			marker.setPosition(panoData.location.latLng);
			var panoramaIsVisible = panorama.getVisible();
			if ( !panoramaIsVisible) toggleStreetView();
			// Set the panorama!
		}
		else {
			setNearestPanorama(latLng, checkaround*2);
		}
	}
	
} 


// TOGGLE BUTTON


function toggleStreetView() {
		// Called when the user clicks the Toggle button.
		var panoramaIsVisible = panorama.getVisible();
		if (panoramaIsVisible == false) {
			// We move from map view to panorama view.
			var currentCenter=map.getCenter();
			setNearestPanorama(currentCenter);
			panorama.setVisible(true);
			document.getElementById('butt1').innerHTML=' View Map';
		} else {
			// We move from panorama view to map view.
			var currentCenter=panorama.getPosition();
			map.setCenter(currentCenter);
			marker.setPosition(currentCenter);
			panorama.setVisible(false);
			document.getElementById('butt1').innerHTML=' Panorama';
		}
	}


// INIT


function initialize() {
	// Called at the beginning of the program.
	webService = new google.maps.StreetViewService();  
	var tardis = new google.maps.LatLng(-13.165713,-72.545542);
	
	var panoramaOptions = {
		position: tardis,
		pov: {
			heading: 130,
			pitch: 0
		},
		addressControl:false,
	
	};
	
	var featureOpts = [
		{
			stylers: [
				//{ color: '#cccccc' }, 
				 { hue: '#777777' },
				//{ visibility: 'on' },
				{ gamma: 0.3},
				{ weight: 1 },
				 { saturation: -100},
				 {lightness: -30}
			]
		},
		{
			elementType: 'labels',
			stylers: [
				{ visibility: 'on' }
			]
		},
		{
			featureType: 'water',
			stylers: [
				{ color: '#333333' }
			]
		}
	];

	var mapOptions = {
		zoom: 12,
		center: tardis,
		mapTypeControlOptions: {
			mapTypeIds: [MY_MAPTYPE_ID, google.maps.MapTypeId.ROADMAP, google.maps.MapTypeId.SATELLITE]
		},
		mapTypeId: MY_MAPTYPE_ID,
		streetViewControl:false
	};
				
	var el=document.getElementById('pano');
	map = new google.maps.Map(el, mapOptions);
	
	var styledMapOptions = {
		name: 'Noir'
	};

	var customMapType = new google.maps.StyledMapType(featureOpts, styledMapOptions);

	map.mapTypes.set(MY_MAPTYPE_ID, customMapType);
	
	marker=new google.maps.Marker({
		position:tardis,
	});
	marker.setMap(map);
	
	marker2=new google.maps.Marker();
	
	panorama = new  google.maps.StreetViewPanorama(el,panoramaOptions);
	
	var crosshairShape = {coords:[0,0,0,0],type:'rect'};
	var marker2 = new google.maps.Marker({
		map: map,
		icon: 'images/cross-hairs.gif',
		shape: crosshairShape
	});
	marker2.bindTo('position', map, 'center');
} 

google.maps.event.addDomListener(window, 'load', initialize);

