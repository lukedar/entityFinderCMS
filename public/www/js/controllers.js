angular.module('eventFinder.controllers', ['eventFinder.services'])

.controller('AppCtrl', function($scope, $ionicModal, $timeout) {
  // Global controller
})

.controller('EventsCtrl', function($scope, EventsService) {
    $scope.events = EventsService.query();
})

.controller('EventCtrl', function($scope, $stateParams, EventsService) {
  EventsService.query({ eventId: $stateParams.eventId}, function(result) {
    $scope.event = result[0];
  });
})

.controller('LocationsCtrl', function($scope, $stateParams, $cordovaGeolocation, LocationsService) {

  $scope.map = {
    defaults: {
      tileLayer: 'http://{s}.tile.osm.org/{z}/{x}/{y}.png',
      maxZoom: 18,
      zoomControlPosition: 'bottomleft'
    },
    markers : {},
    events: {
      map: {
        enable: ['context'],
        logic: 'emit'
      }
    }
  };

  LocationsService.query(function(result) {
    angular.forEach(result, function(item, key) {

      $scope.map.markers[key] = { 
        lat : parseInt(item.location_marker.lat),
        focus: true, 
        draggable: false,
        message: item.node_title,
        lng : parseInt(item.location_marker.lng), 
      };

      console.log($scope.map.markers);
    });
  });


  $scope.map.center  = {
    lat: 51.538647,
    lng: -0.016525,
    zoom : 12
  };

  $scope.map.markers = {
      hello: {
          lat: 51.505,
          lng: -0.09,
          focus: true,
          draggable: false,
          message: "trouble!",
          icon: {}
      },
      trouble: {
          lat: 52.505,
          lng: -0.09,
          focus: true,
          draggable: false,
          message: "Hi there!",
          icon: {}
      }
  };

  console.log($scope.map.markers);

  /**
 * Center map on user's current position
 */
  $scope.getUserLocation = function(){

    $cordovaGeolocation
      .getCurrentPosition()
      .then(function (position) {
        $scope.map.center.lat  = position.coords.latitude;
        $scope.map.center.lng = position.coords.longitude;
        $scope.map.center.zoom = 15;

        $scope.map.markers.now = {
          lat:position.coords.latitude,
          lng:position.coords.longitude,
          message: "You Are Here",
          focus: true,
          draggable: false
        };

      }, function(err) {
        // error
        console.log("Location error!");
        console.log(err);
      });

  };


  console.log($scope.map.center);
  console.log($scope.map.markers);
  console.log($scope.map.defaults);

})

.controller('LocationCtrl', function($scope, $stateParams, LocationsService) {
  LocationsService.query({ locationId: $stateParams.locationId}, function(result) {
    $scope.location = result[0];
  });
});
