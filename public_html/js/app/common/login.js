"use strict";

moduleUsuario.controller("usuarioLoginController", [
    "$scope",
    "$http",
    "toolService",
    "sessionService",
    "favsObserverService",
    function ($scope, $http, toolService, oSessionService, oFavsService) {
        $scope.logged = false;
        $scope.failedlogin = false;
        $scope.logging = function () {

            var login = $scope.login;
            var pass = forge_sha256($scope.pass);


            $http({
                method: 'GET',
                header: {
                    'Content-Type': 'application/json;charset=utf-8'
                },
                url: 'http://localhost:8081/casafacil/json?ob=usuario&op=login&user=' + login + '&pass=' + pass
            }).then(function (response, data) {
                if (response.data.status === 401) {
                    $scope.failedlogin = true;
                } else {
                    $scope.logged = true;
                    $scope.failedlogin = false;
                    oSessionService.setSessionActive();
                    oFavsService.updateFavs();
                    oSessionService.setUserName(response.data.message.nombre + " " + response.data.message.ape1);
                    $scope.loggeduser = oSessionService.getUserName();
                    if (response.data.message.obj_tipoUsuario.desc == "Administrador") {
                        oSessionService.setAdmin();
                    } else {
                        oSessionService.setUser();
                    }
                }

            });
        };
        $scope.isActive = toolService.isActive;
    }
]);