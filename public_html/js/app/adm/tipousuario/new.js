"use strict";

moduleTipousuario.controller("tipousuarioNewController", [
    "$scope",
    "$http",
    "toolService",
    "sessionService",
    "$anchorScroll",
    function ($scope, $http, toolService, oSessionService, $anchorScroll) {
        $anchorScroll();
        $scope.created = true;
        $scope.logged = false;
        $scope.create = function () {
            var json = {
                desc: $scope.desc
            };

            $http({
                method: 'GET',
                header: {
                    'Content-Type': 'application/json;charset=utf-8'
                },
                url: 'http://localhost:8081/casafacil/json?ob=tipousuario&op=create',
                params: {json: JSON.stringify(json)}
            }).then(function (response) {
                $scope.created = false;
                $scope.id = response.data.message.id;
            }, function (response) {
                $scope.status = response.status;
                $scope.ajaxDataUsuarios = response.data.message || 'Request failed';
            });
        };

        if (oSessionService.getUserName() !== "") {
            $scope.loggeduser = oSessionService.getUserName();
            $scope.loggeduserid = oSessionService.getId();
            $scope.logged = true;
        }

        $scope.isActive = toolService.isActive;
    }
]);