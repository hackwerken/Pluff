'use strict';

angular.module('pluffApp', [
  'pluffApp.controllers',
  'pluffApp.services',
  'ngRoute',
  'ngCookies',
  'pascalprecht.translate',
  'ngAnimate'
])
// Routing
.config(function($routeProvider, $locationProvider) {
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
})
// Translation
.config(function($translateProvider, $cookieStoreProvider) {
  // Lazyload the language files
  $translateProvider.useStaticFilesLoader({
    prefix: 'js/lang/',
    suffix: '.json'
  });
  // Dutch is the most used language in here ofcourse, so that's the default
  $translateProvider.preferredLanguage('nl');
  // Save the user's choice in a cookie
  $translateProvider.useCookieStorage();
});

var APIconfig = {
  rawUrl: 'https://apps.fhict.nl/api/v1',
  callback: '&callback=JSON_CALLBACK',
  loginUrl: 'https://portal.fhict.nl/CookieAuth.dll?GetLogon?reason=0&formdir=6',
  url: function(url) {
    // Enclose the given _relative_ url with the absolute url + callback.
    // TODO: Replace ampersand with questionmark if needed (maybe not necessary?)
    return this.rawUrl + url + this.callback;
  }
};
