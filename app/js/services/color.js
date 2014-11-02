appServices.factory('colorService', function($http, dataService) {
  return {
    getSubjects: function() {
      return $http.jsonp(dataService.getConfig().url('/schedule/subjects'));
    }
  };
});
