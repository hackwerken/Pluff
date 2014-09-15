'use strict';

/* Controllers */

var pluffApp = angular.module('pluffApp', [])
  .controller('StudentCtrl', ['$scope', '$http', StudentCtrl])
  .controller('RoosterCtrl', ['$scope', RoosterCtrl]);

var APIurl = 'https://apps.fhict.nl/api/v1';
var APIcallback = '?callback=JSON_CALLBACK';

function StudentCtrl($scope, $http) {
  // $http({
  //   method: 'POST',
  //   url: APIurl + '/people/me' + APIcallback,
  //   success:
  // });
  $http.jsonp(APIurl + '/people/important' + APIcallback)
  .success(function(data, status) {
    console.log(data);
  })
  .error(function(data, status) {
    // Redirect naar FHICT inlogpagina
    window.location = 'https://portal.fhict.nl/CookieAuth.dll?GetLogon?reason=0&formdir=6';
  });
}

function RoosterCtrl($scope) {
  $scope.days = [
    {number: 1, spelled: 'Maandag'},
    {number: 2, spelled: 'Dinsdag'},
    {number: 3, spelled: 'Woensdag'},
    {number: 4, spelled: 'Donderdag'},
    {number: 5, spelled: 'Vrijdag'}
  ];

  $scope.hours = [
    {number: 1, start: '08:45'},
    {number: 2, start: '09:35'},
    {number: 3, start: '10:45'},
    {number: 4, start: '11:35'},
    {number: 5, start: '12:25'},
    {number: 6, start: '13:15'},
    {number: 7, start: '14:05'},
    {number: 8, start: '15:15'},
    {number: 9, start: '16:05'},
    {number: 10, start: '16:55'},
    {number: 11, start: '18:00'},
    {number: 12, start: '18:50'},
    {number: 13, start: '20:00'},
    {number: 14, start: '21:40'}
  ];

  $scope.test = function(day) {
    alert('Dit is dag ' + day);
  }
}
