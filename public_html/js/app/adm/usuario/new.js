"use strict";

moduleUsuario.controller("usuarioNewController", [
    "$scope",
    "$http",
    "toolService",
    "sessionService",
    "$anchorScroll",
    function ($scope, $http, toolService, oSessionService, $anchorScroll) {
        $anchorScroll();
        $scope.created = true;
        $scope.logged = false;
        $scope.obj_tipoUsuario = {
            id: null,
            desc: null
        }

        $scope.create = function () {
            var json = {
                id: $scope.id,
                dni: $scope.dni,
                nombre: $scope.nombre,
                ape1: $scope.ape1,
                ape2: $scope.ape2,
                login: $scope.login,
                pass: forge_sha256($scope.pass),
                id_tipoUsuario: $scope.obj_tipoUsuario.id
            }

            $http({
                method: 'GET',
                header: {
                    'Content-Type': 'application/json;charset=utf-8'
                },
                url: 'http://localhost:8081/casafacil/json?ob=usuario&op=create',
                params: {json: JSON.stringify(json)}
            }).then(function (response, data) {
                $scope.created = false;
                $scope.id = response.data.message.id;
            }, function (response) {
                $scope.status = response.status;
                $scope.ajaxDataUsuarios = response.data.message || 'Request failed';
            });
        }

        if (oSessionService.getUserName() !== "") {
            $scope.loggeduser = oSessionService.getUserName();
            $scope.loggeduserid = oSessionService.getId();
            $scope.logged = true;
        }

        $scope.tipoUsuarioRefresh = function (f, consultar) {
            var form = f;
            if (consultar) {
                $http({
                    method: 'GET',
                    url: 'http://localhost:8081/casafacil/json?ob=tipousuario&op=get&id=' + $scope.obj_tipoUsuario.id
                }).then(function (response) {
                    $scope.obj_tipoUsuario = response.data.message;
                    form.userForm.obj_tipoUsuario.$setValidity('valid', true);
                }, function (response) {
                    form.userForm.obj_tipoUsuario.$setValidity('valid', false);
                });
            } else {
                form.userForm.obj_tipoUsuario.$setValidity('valid', true);
            }
        }

        $scope.isActive = toolService.isActive;
    }
]);