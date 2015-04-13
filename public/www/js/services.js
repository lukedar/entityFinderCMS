angular.module('eventFinder.services', ['ngResource'])

.factory('EventsService', function ($resource) {
  return $resource('http://event-finder.dev/api/v1/events?nid=:eventId');
})

.factory('LocationsService', function ($resource) {  
  return $resource('http://event-finder.dev/api/v1/locations?nid=:locationId');
});