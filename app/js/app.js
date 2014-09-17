'use strict';

angular.module('pluffApp', [
  'pluffApp.controllers',
  'pluffApp.services'
]);

var APIconfig = {
  urlRaw: 'https://apps.fhict.nl/api/v1',
  callback: '&callback=JSON_CALLBACK',
  url: function(url) {
    // Enclose the given _relative_ url with the absolute url + callback.
    // TODO: Replace ampersand with questionmark if needed (maybe not necessary?)
    return this.urlRaw + url + this.callback;
  }
};
