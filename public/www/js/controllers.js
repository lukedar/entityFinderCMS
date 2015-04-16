angular.module('eventFinder.controllers', ['eventFinder.services'])

.run(function($ionicPlatform, $rootScope, $window) {

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


.controller('AppCtrl', function($scope, $ionicModal, $timeout, $localstorage, $rootScope, $window) {

  // Create the login modal that we will use later
  $ionicModal.fromTemplateUrl('templates/myEvents.html', {
    scope: $scope
  }).then(function(modal) {
    $scope.modal = modal;
  });
  
  // My Events
  $rootScope.myEvents = $localstorage.getObject('events') || [];
  
  $scope.showMyEvents = function() {
    $scope.modal.show();
  };

  $scope.closeMyEvents = function() {
    $scope.modal.hide();
  };

  $scope.deleteMyEvents = function() {
    $rootScope.myEvents = [];
    $window.localStorage.clear();
  }

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
        message: $scope.setMarkerPopupMessage(item.node_title, item.nid),
        lng : parseFloat(item.location_marker.lng), 
      };

    });
  }

  // Open Marker Popup
  $scope.openMarkerPopup = function(latitude, longitude, data) {

    $scope.map.markers.now = {
      lat: latitude,
      lng: longitude,
      message: $scope.setMarkerPopupMessage( data[0].node_title, data[0].nid),
      focus: true,
      draggable: false
    };
  }


  // Center Map
  $scope.centerMap = function(latitude, longitude) {
    // leafletData.getMap().then(function(map) {
    //   map.panTo(new L.LatLng(latitude, longitude));
    // });

    $scope.map.center  = {
      lat: latitude,
      lng: longitude,
      zoom : 15
    };
  }


  // Sets Marker Popup Markup
  $scope.setMarkerPopupMessage = function(title, locatationId) {

    var markup = '';

    markup += '<h5>' +  title + '</h5>';
    markup += '<a class="item-icon-right" href="#/app/locations/' + locatationId + '/detail"><br><i class="icon ion-ios-information-outline"></i></a>';
   
    return markup;

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

})

.controller('EventsCtrl', function($scope, EventsService) {
  $scope.events = EventsService.query();

})

.controller('EventCtrl', function($scope, $stateParams, $localstorage, $rootScope, EventsService) {
  EventsService.query({ eventId: $stateParams.eventId}, function(data) {
    $scope.event = data[0];
  });

  $scope.addToMyEvents = function(eventId, eventTitle) {

    var savedEvents = JSON.parse(localStorage.getItem('events')) || [];

    var newEvent = {
      'event_id': eventId,
      'event_title': eventTitle
    };

    savedEvents.push(newEvent);

    localStorage.setItem('events', JSON.stringify(savedEvents));

    $rootScope.myEvents = savedEvents;


  }

})

.controller('SearchCtrl', function($scope, LocationsService, EventsService) {
  $scope.events = EventsService.query();
  $scope.locations = LocationsService.query();
});