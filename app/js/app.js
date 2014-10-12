'use strict';

var APIconfig = {
  rawUrl: 'https://apps.fhict.nl/api/v1',
  callback: 'callback=JSON_CALLBACK',
  loginUrl: 'https://apps.fhict.nl/link/pluff' + (window.location.host === 'webduck.nl' ? '-dev' : ''),
  url: function(url) {
    // Enclose the given _relative_ url with the absolute url + callback.
    return this.rawUrl + url + (url.indexOf('?') === -1 ? '?' : '&') + this.callback;
  }
};

// API url encoding
// TODO: Needs more testing.
var encode = function(url) {
  return encodeURIComponent(url).replace(/\//g, '%2F');
};

angular.module('pluffApp', [
  'pluffApp.controllers',
  'pluffApp.services',
  'ngRoute',
  'ngCookies',
  'pascalprecht.translate',
  'angucomplete-alt',
  'ngAnimate',
  'ngDialog'
])
  // Routing
  .config(function($routeProvider, $locationProvider, $httpProvider) {

    $routeProvider
      .when('/', {
        templateUrl: 'partials/timetable.html',
        controller: 'TimeTableCtrl',
        resolve: {
          // Load the autocomplete data first.
          // If this data can't be loaded the user isn't authenticated yet
          autocompleteData: function(dataService) {
            return dataService.getSuggestions().then(function(payload) {
              return payload.data;
            });
          },
          // Load the timetable JSON before the controller
          timetableData: function(dataService) {
            return dataService.getTimeTable('/me').then(function(payload) {
              return payload.data;
            });
          }
        }
      })
      .when('/search/:category/:query', {
        templateUrl: 'partials/timetable.html',
        controller: 'TimeTableCtrl',
        resolve: {
          autocompleteData: function(dataService) {
            return dataService.getSuggestions().then(function(payload) {
              return payload.data;
            });
          },
          timetableData: function($route, dataService) {
            var categoryUrl;
            var queryUrl = $route.current.params.query;

            // Load correct API url
            switch ($route.current.params.category) {
              case 'room':
                categoryUrl = 'room';
                break;
              case 'class':
                categoryUrl = 'class';
                break;
              case 'teacher':
                categoryUrl = 'teacher/abbreviation';
                break;
              case 'subject':
                categoryUrl = 'subject';
                break;
              case 'class':
                categoryUrl = 'class';
                break;
              default:
                categoryUrl = 'query';
                break;
            }

            return dataService.getTimeTable('/' + categoryUrl + '/' + queryUrl).then(function(payload) {
              return payload.data;
            });
          }
        }
      });

    // We don't want no fake hashbangs we want the real shite
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
  })
  .run(function($rootScope) {
    $rootScope.encode = function(url) {
      return encodeURIComponent(url).replace(/\//g, '%2F');
    };
  });
