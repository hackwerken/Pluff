'use strict';

angular.module('pluffApp', [
  'pluffApp.controllers',
  'pluffApp.services',
  'ngRoute'
])
.config(function($routeProvider, $locationProvider) {
  // TODO: Everything.
  $routeProvider
  .when('/', {
    templateUrl: 'partials/timetable.html',
    controller: 'TimeTableCtrl'
  })
  .when('/query/:query', {
    templateUrl: 'partials/timetable.html',
    controller: 'TimeTableCtrl',
    resolve: {
      logging: function($route) {
        // $route.reload()
        console.log('Query is ' + $route.current.params.query);
      }
    }
  });

  $locationProvider.html5Mode(true);
});

var APIconfig = {
  urlRaw: 'https://apps.fhict.nl/api/v1',
  callback: '&callback=JSON_CALLBACK',
  url: function(url) {
    // Enclose the given _relative_ url with the absolute url + callback.
    // TODO: Replace ampersand with questionmark if needed (maybe not necessary?)
    return this.urlRaw + url + this.callback;
  }
};
