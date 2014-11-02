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
  'ngDialog'
]);

app.run(function($rootScope) {
  // API URL encoding
  $rootScope.encode = function(url) {
    return encodeURIComponent(url).replace(/\//g, '%2F');
  };
});

// Make moment injectable
app.constant('moment', moment);

// Controllers
var appCtrls = angular.module('pluffApp.controllers', []);

// Services
var appServices = angular.module('pluffApp.services', []);
