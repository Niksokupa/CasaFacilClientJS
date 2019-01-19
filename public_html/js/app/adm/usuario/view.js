'use strict'

moduleUsuario.controller('usuarioViewController', ['$scope', '$http', 'toolService', '$routeParams', 'sessionService', '$anchorScroll',
    function ($scope, $http, toolService, $routeParams, oSessionService, $anchorScroll) {
        $anchorScroll();
        $scope.id = $routeParams.id;
        $scope.logged = false;
        $scope.mostrar = false;
        $scope.activar = true;
        $scope.admin = oSessionService.isAdmin();
        $scope.ajaxData = "";
        $scope.toggle = function () {
            $scope.mostrar = !$scope.mostrar;
        }
        $scope.enable = function () {
            $scope.activar = !$scope.activar;
        }
        $http({
            method: 'GET',
            //withCredentials: true,
            url: 'http://localhost:8081/casafacil/json?ob=usuario&op=get&id=' + $scope.id
        }).then(function (response) {
            $scope.status = response.status;
            $scope.ajaxData = response.data.message;
        }, function (response) {
            $scope.ajaxData = response.data.message || 'Request failed';
            $scope.status = response.status;
        });
        $scope.isActive = toolService.isActive;
    }
]);