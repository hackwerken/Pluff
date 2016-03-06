import enLang from 'lang/en.json';
import deLang from 'lang/de.json';
import nlLang from 'lang/nl.json';

export default function($translateProvider, $cookieStoreProvider, $authProvider) {
  $translateProvider.translations('en', enLang);
  $translateProvider.translations('de', deLang);
  $translateProvider.translations('nl', nlLang);

  // TODO: Needs more testing, but works for now
  $translateProvider
    .registerAvailableLanguageKeys(['en', 'de', 'nl'], {
      'en_US': 'en',
      'en_UK': 'en',
      'de_DE': 'de',
      'de_CH': 'de',
      'nl_NL': 'nl',
      'nl_BE': 'nl',
    })
    .uniformLanguageTag('java')
    .determinePreferredLanguage()
    .fallbackLanguage('en');
  // Save the user's choice in a cookie
  $translateProvider.useCookieStorage();

  $translateProvider.useSanitizeValueStrategy(null);

  $authProvider.oauth2({
    name: 'fhict',
    // HACK: If `url` is not set, satellizer wil not save the access token.
    url: '/satelizzer-bypass',
    clientId: 'pluff-implicit',
    authorizationEndpoint: 'https://identity.fhict.nl/connect/authorize',
    // FHICT auth only accepts uri's with an appended slash (same as Facebook).
    redirectUri: window.location.origin + '/',
    scope: ['fhict', 'fhict_personal'],
    scopeDelimiter: ' ',
    responseType: 'token',
    requiredUrlParams: ['scope'],
  });
}
