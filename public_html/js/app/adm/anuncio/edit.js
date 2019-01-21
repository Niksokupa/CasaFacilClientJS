"use strict";

moduleAnuncio.controller("facturaEditController", [
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
            url: `http://localhost:8081/casafacil/json?ob=factura&op=get&id=${$routeParams.id}`
        }).then(function (response) {
            $scope.id = response.data.message.id;
            $scope.iva = response.data.message.iva;
            $scope.myDate = new Date(response.data.message.fecha);
            $scope.obj_usuario = {
                id: response.data.message.obj_usuario.id,
                nombre: response.data.message.obj_usuario.nombre,
                nombrecompleto: response.data.message.obj_usuario.nombre + " " + response.data.message.obj_usuario.ape1
            }
        });

        $scope.update = function () {
            var json = {
                id: $scope.id,
                iva: $scope.iva,
                fecha: $scope.myDate,
                id_usuario: $scope.obj_usuario.id
            }
            $http({
                method: 'GET',
                header: {
                    'Content-Type': 'application/json;charset=utf-8'
                },
                url: 'http://localhost:8081/casafacil/json?ob=factura&op=update',
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

        $scope.usuarioRefresh = function (f, consultar) {
            var form = f;
            if (consultar) {
                $http({
                    method: 'GET',
                    url: 'http://localhost:8081/casafacil/json?ob=usuario&op=get&id=' + $scope.obj_usuario.id
                }).then(function (response) {
                    $scope.obj_usuario = response.data.message;
                    form.userForm.obj_usuario.$setValidity('valid', true);
                }, function (response) {
                    form.userForm.obj_usuario.$setValidity('valid', false);
                });
            } else {
                form.userForm.obj_usuario.$setValidity('valid', true);
            }
        }

        $scope.isActive = toolService.isActive;
    }
]);