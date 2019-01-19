'use strict'

casafacil.config(['$locationProvider', function ($locationProvider) {
        $locationProvider.html5Mode(true);
    }]);
casafacil.config(['$httpProvider', function ($httpProvider) {
        $httpProvider.defaults.withCredentials = true;
    }]);