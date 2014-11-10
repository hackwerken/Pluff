'use strict';

var app = angular.module('pluffApp', [
  'pluffApp.controllers',
  'pluffApp.services',
  'ngRoute',
  'ngCookies',
  'pascalprecht.translate',
  'angucomplete-alt',
  'angular-loading-bar',
  'ngAnimate',
  'ngDialog',
  'ngTouch'
]);

app.run(function($rootScope, dataService) {
  $rootScope.encode = function(url) {
    return dataService.encode(url);
  };
});

// Make moment injectable
app.constant('moment', moment);

// Controllers
var appCtrls = angular.module('pluffApp.controllers', []);

// Services
var appServices = angular.module('pluffApp.services', []);
