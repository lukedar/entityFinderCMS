angular.module('eventFinder.controllers', ['eventFinder.services'])

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

  // Build Markers
  LocationsService.query({locationId: $stateParams.locationId}, function(result) {

    angular.forEach(result, function(item, key) {

      $scope.map.markers[item.node_title] = { 
        lat : parseFloat(item.location_marker.lat),
        focus: true, 
        draggable: false,
        message:'<h5>' + item.node_title + '</h5>' + '<a class="item-icon-right" href="#/app/locations/' + item.nid + '/detail"><br><i class="icon ion-ios-information-outline"></i></a>',
        lng : parseFloat(item.location_marker.lng), 
      };

       console.log($scope.map.markers);

    });
  });

  $scope.map.center  = {
    lat: 51.538647,
    lng: -0.016525,
    zoom : 12
  };


  // $scope.map.dir = MQ.routing.directions();

  // $scope.map.dir.route({
  //     locations: [
  //         '1600 pennsylvania ave, washington dc',
  //         '935 pennsylvania ave, washington dc'
  //     ]
  // });
 
  // $scope.map.addLayer(MQ.routing.routeLayer({
  //     directions: dir,
  //     fitBounds: true
  // }));


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

})

.controller('LocationCtrl', function($scope, $stateParams, LocationsService, EventsByLocationService) {
  
  LocationsService.query({ locationId: $stateParams.locationId}, function(result) {
    $scope.location = result[0];
  });


  EventsByLocationService.query({ locationId: $stateParams.locationId}, function(result) {
    $scope.events = result;
  });

});
