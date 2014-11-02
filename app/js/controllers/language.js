appCtrls.controller('LanguageCtrl', function($scope, $translate, $window) {
  $scope.switch = function($lang) {
    // Switch to the given language
    $translate.use($lang);
    // Full page reload to apply all languages
    // This is necessary because of the one-time bindings used for performance reasons
    $window.location.reload();
  };
});
