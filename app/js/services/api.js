appServices.factory('apiService', function($http, $auth) {
  function authorize() {
    if (!$auth.isAuthenticated()) {
      return $auth.authenticate('fhict').then(function () {
        return true;
      }, function () {
        console.warn('FHICT authentication went wrong.');
      });
    }

    return true;
  }

  function get(url, params) {
    if (authorize()) {
      return $http({
        url: 'https://tas.fhict.nl/api/v1' + url,
        method: 'GET',
        params: params
      });
    }

    console.warn('Shit went wrong.');
  }

  return {
    getSuggestions: function() {
      return get('/schedule/autocomplete/Any');
    },
    getTimeTable: function(input) {
      return get('/schedule' + input, {
        expandTeacher: false,
        startLastMonday: true,
        days: 90
      });
    },
    getTeacher: function(teacher) {
      return get('/people/abbreviation/' + teacher);
    },
    getHolidays: function() {
      return get('/schedule/holidays');
    },
    get: get,
    // API URL encoding
    encode: function(url) {
      return encodeURIComponent(url);
    }
  };
});
