"use strict";

moduleAnuncio.controller("facturaNewController", [
    "$scope",
    "$http",
    "$routeParams",
    "toolService",
    "sessionService",
    "$anchorScroll",
    function ($scope, $http, $routeParams, toolService, oSessionService, $anchorScroll) {
        $anchorScroll();
        $scope.created = true;
        $scope.logged = false;
        
        $scope.obj_usuario = {
            id: $routeParams.id
        }
        
        if($routeParams.id != undefined){
            $scope.userChooser = false;
        } else {
            $scope.userChooser = true;
        }

        $scope.create = function () {
            var json = {
                id: $scope.id,
                fecha: $scope.myDate,
                iva: $scope.iva,
                id_usuario: $scope.obj_usuario.id
            }

            $http({
                method: 'GET',
                header: {
                    'Content-Type': 'application/json;charset=utf-8'
                },
                url: 'http://localhost:8081/casafacil/json?ob=factura&op=create',
                params: {json: JSON.stringify(json)}
            }).then(function (response, data) {
                $scope.created = false;
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