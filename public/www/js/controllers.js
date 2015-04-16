angular.module('eventFinder.controllers', ['eventFinder.services'])

.run(function($rootScope) {
    $rootScope.currentLocation =  {
      lat: {},
      lng: {} 
    };
})

.controller('AppCtrl', function($scope, $ionicModal, $timeout) {
  // Global controller
})

.controller('EventsCtrl', function($scope, EventsService) {
    $scope.events = EventsService.query();
     console.log($scope.events);
})

.controller('EventCtrl', function($scope, $stateParams, EventsService) {
  EventsService.query({ eventId: $stateParams.eventId}, function(data) {
    $scope.event = data[0];
  });
})

.controller('LocationsCtrl', function($scope, $rootScope, $stateParams, $cordovaGeolocation, LocationsService, leafletData) {

  // Map init settings
  $scope.map = {
    layers: {
      baselayers: {
        googleRoadmap: {
          name: 'Google Streets',
          layerType: 'ROADMAP',
          type: 'google'
        }
      }
    },
    markers : {},
    events: {
      map: {
        enable: ['context'],
        logic: 'emit'
      }
    }
  };

  // Add map centering 
  // To be set via config from cms.
  $scope.map.center  = {
    lat: 51.545605,
    lng: -0.012727,
    zoom : 15
  };

  // Query Location Service
  LocationsService.query({locationId: $stateParams.locationId}, function(data) {

    $scope.addMarkers(data);
    
    // When on locations/ID
    if(parseInt($stateParams.locationId, 10)) {

      $scope.centerMap(parseFloat(data[0]['location_marker']['lat']), 
        parseFloat(data[0]['location_marker']['lng']));

      $scope.openMarkerPopup(parseFloat(data[0]['location_marker']['lat']), 
        parseFloat(data[0]['location_marker']['lng']), 
        data[0].node_title);
    } 

  });
   
  // Add marker(s) 
  $scope.addMarkers = function(data) {

    angular.forEach(data, function(item, key) {

      $scope.map.markers[item.node_title] = { 
        lat : parseFloat(item.location_marker.lat),
        message:'<h5>' + item.node_title + '</h5>' + '<a class="item-icon-right" href="#/app/locations/' + item.nid + '/detail"><br><i class="icon ion-ios-information-outline"></i></a>',
        lng : parseFloat(item.location_marker.lng), 
      };

    });
  }

  // Center Map
  $scope.centerMap = function(latitude, longitude) {
    $scope.map.center  = {
      lat: latitude,
      lng: longitude,
      zoom : 15
    };
  }

  // Open Marker Popup
  $scope.openMarkerPopup = function(latitude, longitude, popUpMessage) {
    $scope.map.markers.now = {
      lat: latitude,
      lng: longitude,
      message: popUpMessage,
      focus: true,
      draggable: false
    };
  }

  $rootScope.getDirections = function(){

    // Get Geolocation
    $cordovaGeolocation
      .getCurrentPosition()
      .then(function (position) {

        // Add Geolocation Marker
        $scope.map.markers.now = {
          lat:position.coords.latitude,
          lng:position.coords.longitude,
          message: "You Are Here",
          focus: true,
          draggable: false
        };

        // Add routing.
        $scope.addRouting(
          position.coords.latitude, position.coords.longitude,
          $rootScope.currentLocation.lat, $rootScope.currentLocation.lng);

        // Center map on user Geolocation.
        $scope.centerMap(position.coords.latitude, position.coords.longitude, null);

      }, function(err) {
        // error
        console.log("Location error!");
        console.log(err);
      });
  };

  // Add Routing 
  $scope.addRouting = function (fromLat, fromLng, toLat, toLng) {
    // Get map and add routing.
    leafletData.getMap().then(function(map) {
      L.Routing.control({
        waypoints: [
            L.latLng(fromLat, fromLng),
            L.latLng(toLat, toLng)
        ]
      }).addTo(map);
    });
  }

})

.controller('LocationCtrl', function($scope, $rootScope, $stateParams, LocationsService, EventsByLocationService) {
  
  LocationsService.query({ locationId: $stateParams.locationId}, function(data) {
    $scope.location = data[0];
    $rootScope.currentLocation = data[0]['location_marker'];
  });


  EventsByLocationService.query({ locationId: $stateParams.locationId}, function(data) {
    $scope.events = data;
  });

});
