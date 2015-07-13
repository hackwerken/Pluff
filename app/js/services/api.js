appServices.factory('apiService', function($http, $window, $location, $auth) {
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

  function get(url) {
    if (authorize()) {
      return $http({
        url: 'https://tas.fhict.nl/api/v1' + url,
        'method': 'GET'
      }).then(function () {
        console.log('done');
      }, function (err, hoi) {
        console.log(err, hoi);
      });
    }

    console.warn('Shit went wrong.');
  }

  return {
    getSuggestions: function() {
      return get('/schedule/autocomplete/Any');
    },
    getTimeTable: function(input) {
      return get('/schedule' + input + '?expandTeacher=false&IncludeStartOfWeek=true&daysAhead=90');
    },
    getTeacher: function(teacher) {
      return get('/people/abbreviation/' + teacher);
    },
    get: get,
    // API URL encoding
    encode: function(url) {
      return encodeURIComponent(url);
    }
  };
});
