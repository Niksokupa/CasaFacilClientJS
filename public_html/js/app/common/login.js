"use strict";

moduleUsuario.controller("usuarioLoginController", [
    "$scope",
    "$http",
    "toolService",
    "sessionService",
    "favsObserverService",
    "$timeout",
    '$anchorScroll',
    function ($scope, $http, toolService, oSessionService, oFavsService, $timeout, $anchorScroll) {
        $anchorScroll();
        $scope.logged = false;
        $scope.failedlogin = false;
        $scope.wantslogin = true;



        $scope.animation = function () {

            var box1 = $('.box1');
            var box2 = $('.box2');

            if ($scope.wantslogin) {
                box1.addClass('animated');
                box1.addClass('bounceOutLeft');
                $timeout(function () {
                    box2.addClass('animated');
                    box2.addClass('bounceInRight');
                    box2.removeClass('bounceOutLeft');
                    $scope.wantslogin = false;
                    $anchorScroll();
                }, 900);
            } else {
                box2.removeClass('bounceInRight');
                box2.addClass('bounceOutLeft');
                $timeout(function () {
                    box1.removeClass('bounceOutLeft');
                    box1.addClass('bounceInRight');
                    $scope.wantslogin = true;
                    $anchorScroll();
                }, 900);
            }
        };

        $scope.create = function () {

            if ($scope.newpass === $scope.newpass2) {
                var json = {
                    nickname: $scope.usuario,
                    nombre: $scope.nombre,
                    ape1: $scope.ape1,
                    ape2: $scope.ape2,
                    correo: $scope.email,
                    telefono: $scope.telefono,
                    pass: forge_sha256($scope.newpass),
                    id_tipoUsuario: 2
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
        };

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