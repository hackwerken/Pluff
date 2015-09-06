import timetablePartial from 'partials/timetable.html';
import holidaysPartial from 'partials/holidays.html';
import freeRoomsPartial from 'partials/free-rooms.html';
import missingPartial from 'partials/errors/missing.html';

export default function($routeProvider, $locationProvider, $httpProvider) {

  $routeProvider
    .when('/', {
      template: timetablePartial,
      controller: 'TimeTableCtrl',
      resolve: {
        // Load the timetable JSON before the controller
        timetableData: function(apiService) {
          return apiService.getTimeTable('/me').then(function(payload) {
            return payload.data;
          }, function() {
            return false;
          });
        }
      }
    })
    .when('/search/:category/:query', {
      template: timetablePartial,
      controller: 'TimeTableCtrl',
      resolve: {
        timetableData: function($route, apiService) {
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
              categoryUrl = 'teacher';
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

          return apiService.getTimeTable('/' + categoryUrl + '/' + queryUrl).then(function(payload) {
            return {data: payload.data, kind: categoryUrl};
          }, function() {
            return false;
          });
        }
      }
    })
    .when('/holidays', {
      template: holidaysPartial,
      controller: 'HolidayCtrl'
    })
    .when('/free-rooms', {
      template: freeRoomsPartial,
      controller: 'RoomCtrl'
    })
    .otherwise({
      template: missingPartial,
      controller: 'ErrorCtrl'
    });

  // We don't want no fake hashbangs we want the real shite
  $locationProvider.html5Mode(true);
  // With html5Mode on true, Angular sets up a fallback for older browsers with '#'.
  // However, this strips out the hash. We need this for the API
  $locationProvider.hashPrefix('!');
}
