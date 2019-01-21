"use strict";

moduleUsuario.controller("usuarioRemoveController", [
    "$scope",
    "$http",
    "toolService",
    "$routeParams",
    "sessionService",
    "$anchorScroll",
    function ($scope, $http, toolService, $routeParams, oSessionService, $anchorScroll) {
        $anchorScroll();
        $scope.deleted = true;
        $scope.id = $routeParams.id;
        $http({
            method: "GET",
            url: 'http://localhost:8081/casafacil/json?ob=usuario&op=get&id=' + $scope.id
        }).then(function (response) {
            $scope.ajaxData = response.data.message;
        }).then /
                function (response) {
                };

        $scope.eliminar = function () {
            $http({
                method: "GET",
                url: `http://localhost:8081/casafacil/json?ob=usuario&op=remove&id=${$routeParams.id}`
            }).then(function (response) {
                $scope.deleted = false;
            })
        }
        $scope.isActive = toolService.isActive;

        if (oSessionService.getUserName() !== "") {
            $scope.loggeduser = oSessionService.getUserName();
            $scope.loggeduserid = oSessionService.getId();
            $scope.logged = true;
        }

    }

]);