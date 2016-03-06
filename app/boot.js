import angular from 'angular';
import 'stylesheet/style.scss';

import CTimetable from 'controllers/timetable';
import CError from 'controllers/error';
import CHoliday from 'controllers/holiday';
import CLanguage from 'controllers/language';
import CMain from 'controllers/main';
import CNavigation from 'controllers/navigation';
import CRoom from 'controllers/room';
import SApi from 'services/api';
import SDay from 'services/day';
import SHoliday from 'services/holiday';
import SLesson from 'services/lesson';
import SRoom from 'services/room';
import SWeek from 'services/week';

import config from './config';
import routes from './routes';

import ngTranslate from 'angular-translate';
import ngCookies from 'angular-cookies';
import ngRoute from 'angular-route';
import ngAnimate from 'angular-animate';
import ngTouch from 'angular-touch';
import 'angucomplete-alt';
import satellizer from 'satellizer';
import 'angucomplete-alt';
import ngLoadingBar from 'angular-loading-bar';
import ngDialog from 'ng-dialog';
import 'angular-translate-cookie';

const app = angular.module('pluffApp', [
  ngTranslate,
  ngCookies,
  ngRoute,
  ngLoadingBar,
  ngAnimate,
  ngDialog,
  ngTouch,
  satellizer,
  'angucomplete-alt',
]);

app.controller('TimeTableCtrl', CTimetable);
app.controller('ErrorCtrl', CError);
app.controller('HolidayCtrl', CHoliday);
app.controller('LanguageCtrl', CLanguage);
app.controller('MainCtrl', CMain);
app.controller('NavCtrl', CNavigation);
app.controller('RoomCtrl', CRoom);

app.factory('apiService', SApi);
app.factory('dayService', SDay);
app.factory('holidayService', SHoliday);
app.factory('lessonService', SLesson);
app.factory('roomService', SRoom);
app.factory('weekService', SWeek);

app.config(config);
app.config(routes);

app.run(($rootScope, apiService) => {
  $rootScope.encode = function (url) {
    return apiService.encode(url);
  };
});

export default app;
