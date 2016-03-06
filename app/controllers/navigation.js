export default function ($scope, apiService, $timeout, $location, lessonService) {
  // Get timetable title (from TimeTableCtrl) and update if the title changes
  $scope.$watch(() => lessonService.getInfo(), (newValue) => {
    if (newValue) {
      $scope.tableInfo = newValue;
    }
  });

  $scope.searchApi = function (userInputString, timeoutPromise) {
    return apiService.getSuggestions('Any', userInputString, timeoutPromise);
  };

  // Fired when a search suggestion is selected
  $scope.searchSelected = function (selected) {
    if (selected !== undefined) {
      const title = apiService.encode(selected.originalObject.name);
      const kind = selected.originalObject.kind.toLowerCase();

      // Check which kind is selected (room or class) to update the url
      console.log(`Autocomplete ${kind} ${title}`);
      $location.path(`/search/${kind}/${title}`);
      $scope.showSearchForm = false;
    }
  };

  $scope.showSearchFormFunc = function () {
    $scope.showSearchForm = !$scope.showSearchForm;

    if ($scope.showSearchForm === true) {
      $timeout(() => {
        const searchInput = document.getElementById('search-query_value');
        searchInput.focus();
      }, 300);
    }
  };

  // Keep track of the last used timetable, so when a user navigates to another URL he can easily navigate back
  $scope.lastTimeTableUrl = '/';

  $scope.$on('$routeChangeSuccess', () => {
    if ($location.path() === '/' || $location.path().indexOf('/search/') > -1) {
      $scope.lastTimeTableUrl = $location.path();
    }
  });

  $scope.isActive = function (viewLocation) {
    const regexp = new RegExp('(\/search\/.*)');
    if (regexp.test($location.path())) {
      return viewLocation === '/';
    }
    return viewLocation === $location.path();
  };
}
