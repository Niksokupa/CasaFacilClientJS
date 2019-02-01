'use strict';



moduleService.service('sessionService', ['$location', function ($location) {
        var isSessionActive = false;
        var userName = "";
        var idUserLogged = "";
        var admin;
        var favs = [];
        var observerCallbacks = [];
        return {
            getUserName: function () {
                return userName;
            },
            setUserName: function (name) {
                userName = name;

                angular.forEach(observerCallbacks, function (callback) {
                    callback();
                });
            },
            isSessionActive: function () {

                return isSessionActive;
            },
            setSessionActive: function () {

                isSessionActive = true;

                angular.forEach(observerCallbacks, function (callback) {
                    callback();
                });
            },
            setSessionInactive: function () {

                isSessionActive = false;

                angular.forEach(observerCallbacks, function (callback) {
                    callback();
                });
            },
            setId: function (id) {
                idUserLogged = id;
            },
            getId: function () {
                return idUserLogged;
            },
            logOut: function () {
                isSessionActive = false;
                userName = "";
                idUserLogged = "";
                admin = null;

                angular.forEach(observerCallbacks, function (callback) {
                    callback();
                });
            },
            isAdmin: function () {
                return admin;
            },
            setAdmin: function () {
                admin = true;

                angular.forEach(observerCallbacks, function (callback) {
                    callback();
                });
            },
            setUser: function () {
                admin = false;

                angular.forEach(observerCallbacks, function (callback) {
                    callback();
                });
            },
            setFavs: function (arrayFavs) {
                favs = arrayFavs;

                angular.forEach(observerCallbacks, function (callback) {
                    callback();
                });
            },
            getFavs: function () {
                return favs;
            },
            registerObserverCallback: function (callback) {
                observerCallbacks.push(callback);
            }

        };

    }]);