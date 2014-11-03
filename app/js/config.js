app.config(function($translateProvider, $cookieStoreProvider) {
  // Lazyload the language files
  $translateProvider.useStaticFilesLoader({
    prefix: 'js/lang/',
    suffix: '.json'
  });
  // TODO: Needs more testing, but works for now
  $translateProvider
    .registerAvailableLanguageKeys(['en', 'de', 'nl'], {
      'en_US': 'en',
      'en_UK': 'en',
      'de_DE': 'de',
      'de_CH': 'de',
      'nl_NL': 'nl',
      'nl_BE': 'nl'
    })
    .determinePreferredLanguage()
    .fallbackLanguage('en');
  // Save the user's choice in a cookie
  $translateProvider.useCookieStorage();
});
