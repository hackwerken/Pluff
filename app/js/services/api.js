appServices.factory('apiService', function($http, $auth, $q, ngDialog, moment) {
  function isAuthenticated() {
    if ($auth.isAuthenticated()) {
      // Now check if the token is not expired yet.
      var expires = localStorage.getItem('satellizer_expires');
      var isStillValid = expires >= moment().format('X');

      if (!isStillValid) {
        console.log('Token is no longer valid, removing...');
        localStorage.removeItem('satellizer_expires');
        $auth.removeToken();
      } else {
        console.log('Token is valid, please continue!');
      }

      return isStillValid;
    }
    return false;
  }

  function authenticate() {
    if (!isAuthenticated()) {
      // Show dialog about why the user must authenticate.
      var dialog = ngDialog.open({
        template: 'partials/dialog-authenticate.html',
        showClose: false,
        closeByEscape: false,
        closeByDocument: false
      });

      return $auth.authenticate('fhict').then(function (response, a, b) {
        // The token is only valid for x seconds, so save this.
        if (response.expires_in) {
          var expires = moment().add(response.expires_in, 's').format('X');
          console.log('Setting token as expired after;', expires);
          localStorage.setItem('satellizer_expires', expires);
        }

        // User is successfully authenticated now, so close the dialog.
        dialog.close();
      }, function (data) {
        // TODO: Create a nice dialog explaining that something weird went wrong.
        // Don't know yet when this would occur.
        console.error('FHICT authentication went wrong.', data);
      });
    }

    // Create a fake promise if already authenticated.
    // Hm, there must be a better solution...
    var deferred = $q.defer();
    deferred.resolve();
    return deferred.promise;
  }

  function get(url, params) {
    // Authenticate before trying to load the url.
    return authenticate().then(function () {
      return $http({
        url: 'https://tas.fhict.nl/api/v1' + url,
        method: 'GET',
        params: params
      });
    });
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
    getRoomOccupancy: function(date) {
      return get('/rooms/occupancy/' + date);
    },
    get: get,
    // API URL encoding
    encode: function(url) {
      return encodeURIComponent(url);
    }
  };
});
