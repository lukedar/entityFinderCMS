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

.controller('LocationsCtrl', function($scope, $stateParams,$cordovaGeolocation, LocationsService) {

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

  $scope.locations = LocationsService.query();

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


  console.log($scope.map.center);
  console.log($scope.map.markers);
  console.log($scope.map.defaults);

})

.controller('LocationCtrl', function($scope, $stateParams, LocationsService) {
  LocationsService.query({ locationId: $stateParams.locationId}, function(result) {
    $scope.location = result[0];
  });
});
