'use strict';

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
.factory('httpRequestInterceptor', function($q, $location) {
  return {
    responseError: function(rejection) {
      // This is temporary. TODO: Redirect only if the user isn't logged in.
      // TODO: Redirect back to pluff
      window.location = APIconfig.loginUrl;

      if (rejection.status === 404) {
        // TODO: Change the view to a 404 template
        return $q.reject(rejection);
      }
      // Redirect the user to the login portal
      // Unfortunately this doesn't work (yet) goddammit :(
      else if (rejection.status === 302) {
        window.location = APIconfig.loginUrl;
      }
    }
  };
})
// Routing
// TODO: Make it more DRY, this is insane :)
.config(function($routeProvider, $locationProvider, $httpProvider, $interpolateProvider) {
  $httpProvider.interceptors.push('httpRequestInterceptor');

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
  .when('/room/:roomQuery', {
    templateUrl: 'partials/timetable.html',
    controller: 'TimeTableCtrl',
    resolve: {
      timetableData: function($route, dataService) {
        return dataService.getTimeTable('/room/' + $route.current.params.roomQuery).then(function(payload) {
          return payload.data;
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
          return payload.data;
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
          return payload.data;
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
          return payload.data;
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
