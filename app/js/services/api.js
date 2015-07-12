appServices.factory('apiService', function($http, $window, $location) {
  function getToken() {
    return localStorage.getItem('access_token');
  }

  console.log('local', getToken());

  // API Config
  var config = {
    endpoint: 'https://tas.fhict.nl/api/v1',
    loginUrl: 'https://tas.fhict.nl/identity/connect/authorize?response_type=token'+
      '&client_id=pluff-implicit&scope=fhict+fhict_schedule+fhict_people+fhict_personal&redirect_uri=http://localhost:8080/'
  };

  function searchHash(string) {
    var query = $location.hash();
    var vars = query.split('&');

    for (var i = 0; i < vars.length; i++) {
      var pair = vars[i].split('=');
      if (pair[0] == string) {
        return pair[1];
      }
    }

    return null;
  }

  function setToken(string) {
    localStorage.setItem('access_token', string);
    console.log('set item!');
  }

  function get(url) {
    var token = getToken();

    if (!token) {
      console.warn('Request will fail without token!');
    }

    $http.defaults.headers.common.Authorization = 'Bearer ' + token;

    return $http.get(config.endpoint + url).then(function () {
      console.log('done');
    }, function (err, hoi) {
      console.log(err, hoi);
    })
  }

  return {
    getSuggestions: function() {
      return get('/schedule/autocomplete/Any');
    },
    authorize: function() {
      if (getToken()) {
        return;
      }

      var hashAccessToken = searchHash('access_token');

      if (!hashAccessToken) {
        $window.location = config.loginUrl;
      }

      console.log('setting', hashAccessToken);

      // This fails because it triggers Angular's routing;
      // $location.hash('');

      setToken(hashAccessToken);
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
