'use strict'

moduleAnuncio.controller('viewanunciosController', ['$scope', '$http', 'toolService', '$routeParams', 'sessionService', '$anchorScroll',
    function ($scope, $http, toolService, $routeParams, oSessionService, $anchorScroll) {
        $anchorScroll();
        $scope.logged = false;
        $scope.id = $routeParams.id;

        $http({
            method: 'GET',
            url: 'http://localhost:8081/casafacil/json?ob=anuncio&op=get&id=' + $scope.id
        }).then(function (response) {
            $scope.anuncio = response.data.message;
        }, function (response) {
            $scope.error = response.data.message || 'Request failed';
        });

    }
]);