angular.module('eventFinder.services', ['ngResource'])

.factory('Events', function ($resource) {
  return $resource('http://event-finder.dev/api/v1/events?nid=:eventId');
})

.factory('Locations', function ($resource) {
  return $resource('http://event-finder.dev/api/v1/locations?nid=:locationId');
});