'use strict';

angular.module('pluffApp', [
  'pluffApp.controllers',
  'pluffApp.services',
  'ngRoute',
  'ngCookies',
  'pascalprecht.translate',
  'angucomplete-alt',
  'angular-loading-bar',
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
      })
      .when('/colors', {
        templateUrl: 'partials/colors.html',
        controller: 'ColorsCtrl',
        resolve: {
          // Load the autocomplete data first.
          // If this data can't be loaded the user isn't authenticated yet
          autocompleteData: function(dataService) {
            return dataService.getSuggestions().then(function(payload) {
              return payload.data;
            });
          }
        }
      })
      .otherwise({
        templateUrl: 'partials/errors/missing.html',
        controller: 'ErrorCtrl'
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
    // API URL encoding
    $rootScope.encode = function(url) {
      return encodeURIComponent(url).replace(/\//g, '%2F');
    };
  })
  // Make moment injectable
  .constant('moment', moment);
