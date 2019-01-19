"use strict";

moduleLinea.controller("lineaNewController", [
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
        $scope.facturaid = $routeParams.id;
        $scope.obj_factura = {
            id: $routeParams.id,
            cantidad: null
        }
        $scope.obj_producto = {
            id: null
        }
        
        $scope.create = function () {
            var json = {
                cantidad: $scope.cantidad,
                id_producto: $scope.obj_producto.id,
                id_factura: $scope.obj_factura.id
            }

            $http({
                method: 'GET',
                header: {
                    'Content-Type': 'application/json;charset=utf-8'
                },
                url: 'http://localhost:8081/casafacil/json?ob=linea&op=create',
                params: {json: JSON.stringify(json)}
            }).then(function (response) {
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

        $scope.productoRefresh = function (f, consultar) {
            var form = f;
            if (consultar) {
                $http({
                    method: 'GET',
                    url: 'http://localhost:8081/casafacil/json?ob=producto&op=get&id=' + $scope.obj_producto.id
                }).then(function (response) {
                    $scope.obj_producto = response.data.message;
                    form.userForm.obj_producto.$setValidity('valid', true);
                }, function (response) {
                    form.userForm.obj_producto.$setValidity('valid', false);
                });
            } else {
                form.userForm.obj_producto.$setValidity('valid', true);
            }
        }
        

        $scope.isActive = toolService.isActive;
    }
]);