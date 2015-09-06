import moment from 'moment';
import authenticatePartial from 'partials/dialog-authenticate.html';

export default function($http, $auth, $q, $rootScope, ngDialog) {
  let isAlreadyInApp = false;

  // When requesting an URL without user interaction, a dialog should be shown
  // to prevent the browser from blocking the popup.
  const removeEvent = $rootScope.$on('$routeChangeSuccess', function() {
    isAlreadyInApp = true;
    removeEvent();
  });

  function isAuthenticated() {
    if ($auth.isAuthenticated()) {
      // Now check if the token is not expired yet.
      // TODO: Maybe we can use Satellizer's built-in shit for this.
      //       For this to work, we need to mimic the JWT standard.
      const expires = localStorage.getItem('satellizer_expires');
      const isStillValid = expires >= moment().format('X');

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

  function setExpires(expiresIn) {
    // The token is only valid for x seconds, so save this.
    if (expiresIn) {
      const expires = moment().add(expiresIn, 's').format('X');
      console.log('Setting token as expired after;', expires);
      localStorage.setItem('satellizer_expires', expires);
    }
  }

  // Popup a authentication popup from FHICT where the user can login.
  function showAuthPopup(dialogId) {
    const authPromise = $auth.authenticate('fhict').then(function(response) {
      setExpires(response.expires_in);

      if (dialogId) ngDialog.close(dialogId, authPromise);
    }, function(data) {
      // TODO: Create a nice dialog explaining that something weird went wrong.
      // Don't know yet when this would occur.
      console.error('FHICT authentication went wrong.', data);
    });

    return authPromise;
  }

  function authenticate() {
    if (!isAuthenticated()) {
      if (!isAlreadyInApp) {
        // Show dialog about why the user must authenticate.
        // TODO: Prevent that multiple dialogs are opened.
        const dialog = ngDialog.open({
          name: 'auth',
          template: authenticatePartial,
          plain: true,
          // User shouldn't be able to ignore this dialog.
          showClose: false,
          closeByEscape: false,
          closeByDocument: false,
          data: {showAuthPopup},
        });

        return dialog.closePromise.then(function(closedDialog) {
          // Forward the authPromise.
          return closedDialog.value;
        });
      }
      // The user is already in the app, so show him the auth directly.
      return showAuthPopup();
    }

    // Create a fake promise if already authenticated.
    // TODO: Hm, there must be a better solution...
    const deferred = $q.defer();
    deferred.resolve();
    return deferred.promise;
  }

  function get(url, options) {
    // Authenticate before trying to load the url.
    return authenticate().then(function() {
      return $http(angular.extend({
        url: 'https://tas.fhict.nl/api/v1' + url,
        method: 'GET',
        responseType: 'json',
      }, options));
    });
  }

  return {
    getSuggestions(kind, query, timeoutPromise) {
      return get('/schedule/autocomplete/' + kind, {
        params: {
          filter: query,
        },
        timeout: timeoutPromise,
      });
    },
    getTimeTable(input) {
      return get('/schedule' + input, {
        params: {
          expandTeacher: true,
          startLastMonday: true,
          days: 90,
        },
      });
    },
    getTeacher(teacher) {
      return get('/people/abbreviation/' + teacher);
    },
    getHolidays() {
      return get('/schedule/holidays');
    },
    getRoomOccupancy(date) {
      return get('/rooms/occupancy/' + date);
    },
    getPicture(id, size) {
      return get('/pictures/' + id + '/' + size, {
        responseType: 'blob',
      });
    },
    // API URL encoding
    encode(url) {
      return encodeURIComponent(url);
    },
  };
}
