appCtrls.controller('MainCtrl', function($scope) {
  // Show footer when ngView is loaded
  $scope.$on('$viewContentLoaded', function(){
    $scope.showFooter = true;
  });
});
