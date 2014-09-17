'use strict';

/* Controllers */

var pluffApp = angular.module('pluffApp', [])
  .controller('StudentCtrl', ['$scope', '$http', StudentCtrl])
  .controller('RoosterCtrl', ['$scope', '$http', RoosterCtrl]);

var APIurl = 'https://apps.fhict.nl/api/v1';
var APIcallback = '&callback=JSON_CALLBACK';

function StudentCtrl($scope, $http) {
  // $http.jsonp(APIurl + '/people/important' + APIcallback)
  // .success(function(data, status) {
  //   console.log(data);
  // })
  // .error(function(data, status) {
  //   // Redirect naar FHICT inlogpagina
  //   window.location = 'https://portal.fhict.nl/CookieAuth.dll?GetLogon?reason=0&formdir=6';
  // });
}

function RoosterCtrl($scope, $http) {
  $scope.roosterData = false;

  $scope.days = [
    {number: 1, spelled: 'Maandag'},
    {number: 2, spelled: 'Dinsdag'},
    {number: 3, spelled: 'Woensdag'},
    {number: 4, spelled: 'Donderdag'},
    {number: 5, spelled: 'Vrijdag'}
  ];

  // TODO: start times probably aren't necessary (?)
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

  // Get the personal schedule from the API
  $http.jsonp(APIurl + '/Schedule/me?daysAhead=90' + APIcallback)
    .success(function(data, status) {
      $scope.roosterData = data.data; // sorry for the awful names it's late okay?
    })
    .error(function(data, status) {
      // Redirect to FHICT loginpage if there's an error, because the user probably isn't logged in
      // TODO: Check if it's a 'normal' error or auth error
      // TODO: Redirect back to Pluff
      window.location = 'https://portal.fhict.nl/CookieAuth.dll?GetLogon?reason=0&formdir=6';
    });

  $scope.roosterDate = moment();

  $scope.weekNumber = 38;

  $scope.getHour = function(dayNumber, hourNumber) {
    // console.log('dagnr: ' + dayNumber + ' en uurnr:' + hourNumber);
    var hourCallback;

    if ($scope.RoosterData != false) {
      $scope.roosterData.forEach(function(les) {
        // Get the input date from the weeknumber of the year and daynumber of week (1-5) (ex. 2014-52-5)
        var currentDay = moment('2014-'+ $scope.weekNumber + '-' + dayNumber, 'YYYY-ww-d');

        // Check if the lesson is on the current day
        if (currentDay.isSame(les.start, 'day')) {
          // Get the exponent of the hourNumber (^2 - 1)
          var hourBin = Math.pow(2, hourNumber-1);

          if (les.hoursMask & hourBin) {
            hourCallback = hourNumber + ' er is les';
          }
        }
      });

      return hourCallback;
    }

    // hourNumber is 1 to 15


  };
}
