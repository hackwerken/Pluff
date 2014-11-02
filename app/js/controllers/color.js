// Only for testing
appCtrls.controller('ColorCtrl', function($scope, colorService, lessonService) {
  colorService.getSubjects().then(function(payload) {
    $scope.subjects = payload.data;
  });

  $scope.setColor = function(name) {
    return lessonService.generateColor(name);
  };

});
