'use strict';

angular.module('pluffApp', [
  'pluffApp.controllers',
  'pluffApp.services',
  'ngRoute',
  'ngCookies',
  'pascalprecht.translate',
  'angucomplete-alt',
  'ngAnimate'
])
// Routing
// TODO: Make it more DRY, this is insane :)
.config(function($routeProvider, $locationProvider) {
  $routeProvider
  .when('/', {
    templateUrl: 'partials/timetable.html',
    controller: 'TimeTableCtrl',
    resolve: {
      // Load the timetable JSON before the controller
      timetableData: function(dataService) {
        return dataService.getTimeTable('/me').then(function(payload) {
          return payload;
        });
      }
    }
  })
  .when('/room/:roomQuery', {
    templateUrl: 'partials/timetable.html',
    controller: 'TimeTableCtrl',
    resolve: {
      timetableData: function($route, dataService) {
        return dataService.getTimeTable('/room/' + $route.current.params.roomQuery).then(function(payload) {
          return payload;
        });
      }
    }
  })
  .when('/class/:classQuery', {
    templateUrl: 'partials/timetable.html',
    controller: 'TimeTableCtrl',
    resolve: {
      timetableData: function($route, dataService) {
        return dataService.getTimeTable('/class/' + $route.current.params.classQuery).then(function(payload) {
          return payload;
        });
      }
    }
  })
  .when('/teacher/:teacherQuery', {
    templateUrl: 'partials/timetable.html',
    controller: 'TimeTableCtrl',
    resolve: {
      timetableData: function($route, dataService) {
        return dataService.getTimeTable('/teacher/abbreviation/' + $route.current.params.teacherQuery).then(function(payload) {
          return payload;
        });
      }
    }
  })
  .when('/subject/:subjectQuery', {
    templateUrl: 'partials/timetable.html',
    controller: 'TimeTableCtrl',
    resolve: {
      timetableData: function($route, dataService) {
        return dataService.getTimeTable('/subject/' + $route.current.params.subjectQuery).then(function(payload) {
          return payload;
        });
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
