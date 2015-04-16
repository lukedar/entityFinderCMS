angular.module('eventFinder.services', ['ngResource'])

.factory('EventsService', function ($resource) {
  return $resource('http://event-finder.dev/api/v1/events?nid=:eventId');
})

.factory('LocationsService', function ($resource) {  
  return $resource('http://event-finder.dev/api/v1/locations?nid=:locationId');
})


.factory('EventsByLocationService', function ($resource) {
  return $resource('http://event-finder.dev/api/v1/events?location=:locationId');
});


angular.module('ionic.utils', [])

.factory('$localstorage', ['$window', function($window) {
  return {
    set: function(key, value) {
      $window.localStorage[key] = value;
    },
    get: function(key, defaultValue) {
      return $window.localStorage[key] || defaultValue;
    },
    setObject: function(key, value) {
      $window.localStorage[key] = JSON.stringify(value);
    },
    getObject: function(key) {
      return JSON.parse($window.localStorage[key] || '{}');
    }
  }
}]);

