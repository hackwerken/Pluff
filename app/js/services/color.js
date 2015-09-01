appServices.factory('colorService', function(apiService) {
  return {
    getSubjects: function() {
      return apiService.get('/schedule/subjects');
    }
  };
});
