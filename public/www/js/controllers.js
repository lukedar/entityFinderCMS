angular.module('eventFinder.controllers', ['eventFinder.services'])

.run(function($ionicPlatform, $rootScope) {

  $rootScope.currentLocation =  {
    lat: {},
    lng: {} 
  };

  $ionicPlatform.ready(function() {
    // Hide the accessory bar by default (remove this to show the accessory bar above the keyboard
    // for form inputs)
    if (window.cordova && window.cordova.plugins.Keyboard) {
      cordova.plugins.Keyboard.hideKeyboardAccessoryBar(true);
    }
    if (window.StatusBar) {
      // org.apache.cordova.statusbar required
      StatusBar.styleDefault();
    }
  });
})


.controller('AppCtrl', function($scope, $ionicModal, $timeout) {

  // Form data for the login modal
  $scope.loginData = {};

  // Create the login modal that we will use later
  $ionicModal.fromTemplateUrl('templates/login.html', {
    scope: $scope
  }).then(function(modal) {
    $scope.modal = modal;
  });
  
  // Triggered in the login modal to close it
  $scope.closeLogin = function() {
    $scope.modal.hide();
  };

  // Open the login modal
  $scope.login = function() {
    $scope.modal.show();
  };

  // Perform the login action
  $scope.doLogin = function() {
    console.log('Doing login', $scope.loginData);

    // Simulate a login delay. Remove this and replace with your login
    // code if using a login system
    $timeout(function() {
      $scope.closeLogin();
    }, 1000);
  };
})


.controller('EventsCtrl', function($scope, EventsService) {
    $scope.events = EventsService.query();
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

    // Add markers
    $scope.addMarkers(data);

    // When on locations/ID
    if(parseInt($stateParams.locationId, 10)) {
      $scope.showLocationsFooter = true;

      // Set current location, used for routing.
      $rootScope.currentLocation = data[0]['location_marker'];

      // Center map
      $scope.centerMap(parseFloat(data[0]['location_marker']['lat']), parseFloat(data[0]['location_marker']['lng']));

      // Open Marker Popup
      $scope.openMarkerPopup(parseFloat(data[0]['location_marker']['lat']), parseFloat(data[0]['location_marker']['lng']), data);
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
    leafletData.getMap().then(function(map) {
      map.panTo(new L.LatLng(latitude, longitude));
    });
  }

  // Open Marker Popup
  $scope.openMarkerPopup = function(latitude, longitude, data) {

    $scope.map.markers.now = {
      lat: latitude,
      lng: longitude,
      message:'<h5>' +  data[0].node_title + '</h5>' + '<a class="item-icon-right" href="#/app/locations/' +  data[0].nid + '/detail"><br><i class="icon ion-ios-information-outline"></i></a>',
      focus: true,
      draggable: false
    };
  }

  $rootScope.getDirections = function(){

    // Get Geolocation
    $cordovaGeolocation
      .getCurrentPosition()
      .then(function (position) {

         // Add Users Geolocation Marker
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

      // Pan to position.
      $scope.centerMap(fromLat, fromLng);
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
