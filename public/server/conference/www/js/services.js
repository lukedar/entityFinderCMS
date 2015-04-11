angular.module('starter.services', ['ngResource'])

.factory('Session', function ($resource) {
  return $resource('http://event-finder.dev/api/v1/events?nid=:sessionId');
});