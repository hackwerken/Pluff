app.config(function($translateProvider, $cookieStoreProvider) {
  // Lazyload the language files
  $translateProvider.useStaticFilesLoader({
    prefix: 'js/lang/',
    suffix: '.json'
  });
  // Dutch is the most used language in here ofcourse, so that's the default
  $translateProvider.preferredLanguage('nl');
  // Save the user's choice in a cookie
  $translateProvider.useCookieStorage();
});
