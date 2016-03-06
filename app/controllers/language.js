export default function ($scope, $translate, $window) {
  $scope.switch = function ($lang) {
    // Switch to the given language
    $translate.use($lang);

    // Full page reload to apply all languages
    // This is necessary because of the one-time bindings used for performance reasons
    // setTimeout() is necessary because otherwise Safari doesn't set the cookie
    setTimeout(() => {
      $window.location.reload();
    });
  };
}
