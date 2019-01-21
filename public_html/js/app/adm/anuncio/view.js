'use strict'

moduleAnuncio.controller('facturaViewController', ['$scope', '$http', 'toolService', '$routeParams', 'sessionService', '$anchorScroll',
    function ($scope, $http, toolService, $routeParams, oSessionService, $anchorScroll) {
        $anchorScroll();
        $scope.logged = false;
        $scope.id = $routeParams.id;
        $scope.mostrar = false;
        $scope.activar = true;
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
            url: 'http://localhost:8081/casafacil/json?ob=factura&op=get&id=' + $scope.id
        }).then(function (response) {
            $scope.status = response.status;
            $scope.ajaxData = response.data.message;
        }, function (response) {
            $scope.ajaxData = response.data.message || 'Request failed';
            $scope.status = response.status;
        });
        
        //Cuenta la cantidad de líneas de la factura
        $http({
            method: 'GET',
            //withCredentials: true,
            url: 'http://localhost:8081/casafacil/json?ob=linea&op=getcountspecific&id=' + $scope.id
        }).then(function (response) {
            $scope.status = response.status;
            $scope.ajaxLinea = response.data.message;
        }, function (response) {
            $scope.ajaxData = response.data.message || 'Request failed';
            $scope.status = response.status;
        });
        
        $scope.isActive = toolService.isActive;

        if (oSessionService.getUserName() !== "") {
            $scope.loggeduser = oSessionService.getUserName();
            $scope.loggeduserid = oSessionService.getId();
            $scope.logged = true;
        }
    }
]);