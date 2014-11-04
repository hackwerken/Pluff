appServices.factory('dataService', function($http, $window) {
  // API Config
  var config = {
    rawUrl: 'https://apps.fhict.nl/api/v1',
    callback: 'callback=JSON_CALLBACK',
    loginUrl: 'https://apps.fhict.nl/link/pluff' +
      (window.location.host === 'webduck.nl' ? '-dev' : '') +
      '?ReturnUrl=' + encodeURIComponent(window.location.pathname),
    url: function(url) {
      // Enclose the given _relative_ url with the absolute url + callback.
      return this.rawUrl + url + (url.indexOf('?') === -1 ? '?' : '&') + this.callback;
    }
  };

  return {
    getSuggestions: function() {
      return $http.jsonp(config.url('/schedule/autocomplete'))
        .error(function() {
          // User isn't logged in, so redirect to portal
          // This is the most reliable method I found yet.
          // If you know something better, PLEASE don't hesitate to create a PR. You would be my hero.
          $window.location = config.loginUrl;
        });;
    },
    getTimeTable: function(input) {
      return $http.jsonp(config.url('/schedule' + input + '?expandTeacher=false&IncludeStartOfWeek=true&daysAhead=90'));
    },
    getTeacher: function(teacher) {
      return $http.jsonp(config.url('/people/abbreviation/' + teacher));
    },
    getConfig: function() {
      return config;
    },
    // API URL encoding
    encode: function(url) {
      return encodeURIComponent(url);
    }
  };
});
