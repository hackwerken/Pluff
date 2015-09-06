import angular from 'angular';
import 'stylesheet/style.scss';

import TimeTableCtrl from 'controllers/timetable';
import ErrorCtrl from 'controllers/error';
import HolidayCtrl from 'controllers/holiday';
import LanguageCtrl from 'controllers/language';
import MainCtrl from 'controllers/main';
import NavigationCtrl from 'controllers/navigation';
import RoomCtrl from 'controllers/room';
import apiService from 'services/api';
import dayService from 'services/day';
import holidayService from 'services/holiday';
import lessonService from 'services/lesson';
import roomService from 'services/room';
import weekService from 'services/week';

import config from './config';
import routes from './routes';

import ngTranslate from 'angular-translate';
import ngCookies from 'angular-cookies';
import ngRoute from 'angular-route';
import ngAnimate from 'angular-animate';
import ngTouch from 'angular-touch';
import 'angucomplete-alt';
import 'satellizer';
import 'angucomplete-alt';
import ngLoadingBar from 'angular-loading-bar';
import {name as ngDialog} from 'ng-dialog';
import 'angular-translate-cookie';

const app = angular.module('pluffApp', [
  ngTranslate,
  ngCookies,
  ngRoute,
  ngLoadingBar,
  ngAnimate,
  ngDialog,
  ngTouch,
  'satellizer',
  'angucomplete-alt',
]);

app.controller('TimeTableCtrl', TimeTableCtrl);
app.controller('ErrorCtrl', ErrorCtrl);
app.controller('HolidayCtrl', HolidayCtrl);
app.controller('LanguageCtrl', LanguageCtrl);
app.controller('MainCtrl', MainCtrl);
app.controller('NavCtrl', NavigationCtrl);
app.controller('RoomCtrl', RoomCtrl);

app.factory('apiService', apiService);
app.factory('dayService', dayService);
app.factory('holidayService', holidayService);
app.factory('lessonService', lessonService);
app.factory('roomService', roomService);
app.factory('weekService', weekService);

app.config(config);
app.config(routes);

app.run(function($rootScope) {
  $rootScope.encode = function(url) {
    return apiService.encode(url);
  };
});

export default app;
