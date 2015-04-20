appCtrls.controller('NavCtrl', function($scope, dataService, $timeout, $location, lessonService, dayService) {
  // Get timetable title (from TimeTableCtrl) and update if the title changes
  $scope.$watch(function() {
    return lessonService.getTitle();
  }, function(newValue) {
    if (newValue) {
      $scope.tableTitle = newValue;
    }
  });

  // If this data can't be loaded the user isn't authenticated yet
  // Add the resulting array in the global scope for the autocomplete plugin to use it
  dataService.getSuggestions().then(function(payload) {
    $scope.searchAuto = payload.data;
  });

  // Fired when a search suggestion is selected
  $scope.searchSelected = function(selected) {
    if (selected !== undefined) {
      var title = dataService.encode(selected.originalObject.name);
      var category = selected.originalObject.category;

      // Check which category is selected (room or class) to update the url
      console.log('Autocomplete ' + category + ' ' + title);
      $location.path('/search/' + category + '/' + title);
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
    $scope.showSearchForm = false;

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
