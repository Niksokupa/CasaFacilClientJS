"use strict";

moduleTipoproducto.controller("tipoproductoEditController", [
    "$scope",
    "$http",
    "$routeParams",
    "toolService",
    "sessionService",
    "$anchorScroll",
    function ($scope, $http, $routeParams, toolService, oSessionService, $anchorScroll) {
        $anchorScroll();
        $scope.edited = true;
        $scope.logged = false;

        $http({
            method: "GET",
            url: `http://localhost:8081/casafacil/json?ob=tipoproducto&op=get&id=${$routeParams.id}`
        }).then(function (response) {
            $scope.id = response.data.message.id;
            $scope.desc = response.data.message.desc;
        });

        $scope.update = function () {
            var json = {
                id: $scope.id,
                desc: $scope.desc
            }
            $http({
                method: 'GET',
                header: {
                    'Content-Type': 'application/json;charset=utf-8'
                },
                url: 'http://localhost:8081/casafacil/json?ob=tipoproducto&op=update',
                params: {json: JSON.stringify(json)}
            }).then(function () {
                $scope.edited = false;
            })
        }

        if (oSessionService.getUserName() !== "") {
            $scope.loggeduser = oSessionService.getUserName();
            $scope.loggeduserid = oSessionService.getId();
            $scope.logged = true;
        }

        $scope.logout = function () {
            $http({
                method: 'GET',
                url: 'http://localhost:8081/casafacil/json?ob=usuario&op=logout'
            }).then(function () {
                $location.url('/');
            });
        }

        $scope.isActive = toolService.isActive;
    }
]);