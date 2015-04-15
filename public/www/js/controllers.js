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
  EventsService.query({ eventId: $stateParams.eventId}, function(result) {
    $scope.event = result[0];
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
  LocationsService.query({locationId: $stateParams.locationId}, function(result) {

    // Build markers
    angular.forEach(result, function(item, key) {

      $scope.map.markers[item.node_title] = { 
        lat : parseFloat(item.location_marker.lat),
        focus: true, 
        draggable: false,
        message:'<h5>' + item.node_title + '</h5>' + '<a class="item-icon-right" href="#/app/locations/' + item.nid + '/detail"><br><i class="icon ion-ios-information-outline"></i></a>',
        lng : parseFloat(item.location_marker.lng), 
      };

    });

    // When on locations/ID
    if(parseInt($stateParams.locationId, 10)) {

      // Set current location.
      $rootScope.currentLocation = result[0]['location_marker'];

        // Add map centering
        $scope.map.center  = {
          lat: parseFloat(result[0]['location_marker']['lat']),
          lng: parseFloat(result[0]['location_marker']['lng']),
          zoom : 15
        };

    } 

  });


  /**
  * Get directions based on Geolocation and current map location
  */
  $rootScope.getDirections = function(){

    // Get Geolocation
    $cordovaGeolocation
      .getCurrentPosition()
      .then(function (position) {

        // Center map on Geolocation point
        $scope.map.center  = {
          lat: position.coords.latitude,
          lng: position.coords.longitude,
          zoom : 15
        };

        // Add Geolocation Marker
        $scope.map.markers.now = {
          lat:position.coords.latitude,
          lng:position.coords.longitude,
          message: "You Are Here",
          focus: true,
          draggable: false
        };

        // Add Routing 
        leafletData.getMap().then(function(map) {
          L.Routing.control({
            waypoints: [
                L.latLng(position.coords.latitude, position.coords.longitude),
                L.latLng($rootScope.currentLocation.lat, $rootScope.currentLocation.lng)
            ]
          }).addTo(map);
        });

      }, function(err) {
        // error
        console.log("Location error!");
        console.log(err);
      });
  };


})

.controller('LocationCtrl', function($scope, $rootScope, $stateParams, LocationsService, EventsByLocationService) {
  
  LocationsService.query({ locationId: $stateParams.locationId}, function(result) {
    $scope.location = result[0];
    $rootScope.currentLocation = result[0]['location_marker'];
  });


  EventsByLocationService.query({ locationId: $stateParams.locationId}, function(result) {
    $scope.events = result;
  });

});
