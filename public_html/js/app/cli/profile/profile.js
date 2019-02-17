/* global moduleUsuario */

'use strict';

moduleUsuario.controller('usuarioProfileController', ['$scope', '$http', '$anchorScroll', 'sessionService',
    function ($scope, $http, $anchorScroll, oSessionService) {
        $anchorScroll();
        $scope.id = oSessionService.getId();
        $http({
            method: 'GET',
            url: 'http://localhost:8081/casafacil/json?ob=usuario&op=profile'
        }).then(function (response) {
            $scope.usuario = response.data.message.nickname;
            $scope.nombre = response.data.message.nombre;
            if (response.data.message.ape1 === "null") {
                $scope.ape1 = "";
            } else {
                $scope.ape1 = response.data.message.ape1;
            }
            if (response.data.message.ape2 === "null") {
                $scope.ape2 = "";
            } else {
                $scope.ape2 = response.data.message.ape2;
            }
            if (response.data.message.telefono === "null" || response.data.message.telefono === 0) {
                $scope.telefono = "";
            } else {
                $scope.telefono = response.data.message.telefono;
            }
            $scope.email = response.data.message.correo;
        }, function (response) {
            $scope.ajaxData = response.data.message || 'Request failed';
        });


        $scope.change = function () {
            var last_pass = forge_sha256($scope.pass1);
            var new_pass = forge_sha256($scope.newpass1);
            var new_pass_verify = forge_sha256($scope.newpass2);

            if (new_pass === new_pass_verify) {
                $http({
                    method: 'GET',
                    header: {
                        'Content-Type': 'application/json;charset=utf-8'
                    },
                    url: `http://localhost:8081/casafacil/json?ob=usuario&op=updatepass&newpass=${new_pass}&lastpass=${last_pass}`
                }).then(function (response) {
                    if (response.data.status === 500) {
                        $scope.showAlert('Error', response.data.message);
                    } else {
                        $scope.changed = false;
                    }
                }), function (response) {

                };
            }
        };

        $scope.edit = function () {

            var json = {
                id: $scope.id,
                nickname: $scope.usuario,
                nombre: $scope.nombre,
                ape1: $scope.ape1,
                ape2: $scope.ape2,
                correo: $scope.email,
                telefono: $scope.telefono,
                pass: forge_sha256($scope.newpass),
                id_tipoUsuario: 2
            };

            $http({
                method: 'GET',
                header: {
                    'Content-Type': 'application/json;charset=utf-8'
                },
                url: 'http://localhost:8081/casafacil/json?ob=usuario&op=update',
                params: {json: JSON.stringify(json)}
            }).then(function (response, data) {
                $scope.created = false;
                $scope.id = response.data.message.id;
            }, function (response) {
                $scope.status = response.status;
                $scope.ajaxDataUsuarios = response.data.message || 'Request failed';
            });

        };
    }
]);