app.config(function($translateProvider, $cookieStoreProvider, $authProvider) {
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
    .uniformLanguageTag('java')
    .determinePreferredLanguage()
    .fallbackLanguage('en');
  // Save the user's choice in a cookie
  $translateProvider.useCookieStorage();

  $translateProvider.useSanitizeValueStrategy(null);

  $authProvider.oauth2({
    name: 'fhict',
    clientId: 'pluff-implicit',
    authorizationEndpoint: 'https://tas.fhict.nl/identity/connect/authorize',
    redirectUri: window.location.origin + '/',
    scope: ['fhict', 'fhict_schedule', 'fhict_people', 'fhict_personal'],
    scopeDelimiter: ' ',
    responseType: 'token',
    popupOptions: null,
    responseParams: null,
    requiredUrlParams: ['scope'],
    optionalUrlParams: null
  });
});
