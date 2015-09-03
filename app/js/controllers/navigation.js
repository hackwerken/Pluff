appCtrls.controller('NavCtrl', function($scope, apiService, $timeout, $location, lessonService, dayService) {
  // Get timetable title (from TimeTableCtrl) and update if the title changes
  $scope.$watch(function() {
    return lessonService.getInfo();
  }, function(newValue) {
    if (newValue) {
      $scope.tableInfo = newValue;
    }
  });

  $scope.searchApi = function(userInputString, timeoutPromise) {
    return apiService.getSuggestions('Any', userInputString, timeoutPromise);
  };

  // Fired when a search suggestion is selected
  $scope.searchSelected = function(selected) {
    if (selected !== undefined) {
      var title = apiService.encode(selected.originalObject.name);
      var kind = selected.originalObject.kind.toLowerCase();

      // Check which kind is selected (room or class) to update the url
      console.log('Autocomplete ' + kind + ' ' + title);
      $location.path('/search/' + kind + '/' + title);
      $scope.showSearchForm = false;
      $scope.searchFormFocused = false;
    }
  };

  $scope.showSearchFormFunc = function() {
    if (!$scope.searchFormFocused) {
      $scope.showSearchForm = !$scope.showSearchForm;

      if ($scope.showSearchForm === true) {
        $timeout(function() {
          var searchInput = document.getElementById('search-query_value');
          searchInput.focus();
        }, 300);
      }
    }
    $scope.searchFormFocused = false;
  };

  $scope.searchFormFocusOut = function() {
    // If the form was hidden because of a focus out event, the showSearchFormFunc needs to know this
    $scope.searchFormFocused = true;
  };

  // Keep track of the last used timetable, so when a user navigates to another URL he can easily navigate back
  $scope.lastTimeTableUrl = '/';

  $scope.$on('$routeChangeSuccess', function() {
    if ($location.path() === '/' || $location.path().indexOf('/search/') > -1) {
      $scope.lastTimeTableUrl = $location.path();
    }
  });

  $scope.isActive = function (viewLocation) {
    var regexp = new RegExp("(\/search\/.*)");
    if (regexp.test($location.path())) {
      return viewLocation === '/';
    }
    else {
      return viewLocation === $location.path();
    }
  };

});
