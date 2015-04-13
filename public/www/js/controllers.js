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

  // Build Marker
  LocationsService.query(function(result) {
    angular.forEach(result, function(item, key) {

      $scope.map.markers[key] = { 
        lat : parseFloat(item.location_marker.lat),
        focus: true, 
        draggable: false,
        message: item.node_title + '<a href="#/app/locations/' + item.nid + '">link here<a>',
        lng : parseFloat(item.location_marker.lng), 
      };
    });
  });


  $scope.map.center  = {
    lat: 51.538647,
    lng: -0.016525,
    zoom : 12
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
