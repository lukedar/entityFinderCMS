// Event Finder App
var app = angular.module('eventFinder', ['ionic', 'leaflet-directive', 'ngCordova', 'eventFinder.controllers'])

.run(function($ionicPlatform) {
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

.config(function($stateProvider, $urlRouterProvider) {
  $stateProvider

  .state('app', {
    url: "/app",
    abstract: true,
    templateUrl: "templates/menu.html",
    controller: 'AppCtrl'
  })

  .state('app.search', {
    url: "/search",
    views: {
      'menuContent': {
        templateUrl: "templates/search.html"
      }
    }
  })

  .state('app.events', {
    url: "/events",
    views: {
      'menuContent': {
        templateUrl: "templates/events.html",
        controller: 'EventsCtrl'
      }
    }
  })

  .state('app.event', {
      url: "/events/:eventId",
      views: {
        'menuContent': {
          templateUrl: "templates/event.html",
          controller: 'EventCtrl'
        }
      }
  })

  .state('app.locations', {
    url: "/locations",
    views: {
      'menuContent': {
        templateUrl: "templates/locations.html",
        controller: 'LocationsCtrl'
      }
    }
  })

  .state('app.location', {
    url: "/locations/:locationId",
    views: {
      'menuContent': {
        templateUrl: "templates/location.html",
        controller: 'LocationCtrl'
      }
    }
  })


  // if none of the above states are matched, use this as the fallback
  $urlRouterProvider.otherwise('/app/events');
});
