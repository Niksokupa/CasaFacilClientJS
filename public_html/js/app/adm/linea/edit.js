"use strict";

moduleLinea.controller("lineaEditController", [
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
        $scope.lineaid = $routeParams.id;

        $http({
            method: "GET",
            url: `http://localhost:8081/casafacil/json?ob=linea&op=get&id=${$routeParams.id}`
        }).then(function (response) {
            $scope.id = response.data.message.id;
            $scope.cantidad = response.data.message.cantidad;
            $scope.obj_factura = {
                id: response.data.message.obj_factura.id
            };
            $scope.obj_producto = {
                id: response.data.message.obj_producto.id,
                desc: response.data.message.obj_producto.desc
            };
        });

        $scope.update = function () {
            var json = {
                id: $scope.id,
                cantidad: $scope.cantidad,
                id_factura: $scope.obj_factura.id,
                id_producto: $scope.obj_producto.id
            }
            $http({
                method: 'GET',
                header: {
                    'Content-Type': 'application/json;charset=utf-8'
                },
                url: 'http://localhost:8081/casafacil/json?ob=linea&op=update',
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

        $scope.isActive = toolService.isActive;
    }
]);