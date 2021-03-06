'use strict'

moduleAnuncio.controller('anuncioPlistController', ['$scope', '$http', '$location', 'toolService', '$routeParams', 'sessionService', '$anchorScroll',
    function ($scope, $http, $location, toolService, $routeParams, oSessionService, $anchorScroll) {
        $anchorScroll();
        $scope.logged = false;
        $scope.ob = "anuncio";
        $scope.totalPages = 1;

        if (!$routeParams.order) {
            $scope.orderURLServidor = "";
            $scope.orderURLCliente = "";
        } else {
            $scope.orderURLServidor = "&order=" + $routeParams.order;
            $scope.orderURLCliente = $routeParams.order;
        }

        if (!$routeParams.rpp) {
            $scope.rpp = "10";
        } else {
            $scope.rpp = $routeParams.rpp;
        }

        if (!$routeParams.page) {
            $scope.page = 1;
        } else {
            if ($routeParams.page >= 1) {
                $scope.page = $routeParams.page;
            } else {
                $scope.page = 1;
            }
        }

        if (oSessionService.getUserName() !== "") {
            $scope.loggeduser = oSessionService.getUserName();
            $scope.loggeduserid = oSessionService.getId();
            $scope.logged = true;
        }

        $scope.resetOrder = function () {
            $location.url($scope.ob + '/plist/' + $scope.rpp + '/' + $scope.page);
        }

        $scope.ordena = function (order, align) {
            if ($scope.orderURLServidor == "") {
                $scope.orderURLServidor = "&order=" + order + "," + align;
                $scope.orderURLCliente = order + "," + align;
            } else {
                $scope.orderURLServidor = $scope.orderURLServidor + "-" + order + "," + align;
                $scope.orderURLCliente = $scope.orderURLCliente + "-" + order + "," + align;
            }
            $location.url($scope.ob + `/plist/` + $scope.rpp + `/` + $scope.page + `/` + $scope.orderURLCliente);
        }

        //getcount
        $http({
            method: 'GET',
            url: 'http://localhost:8081/casafacil/json?ob=' + $scope.ob + '&op=getcount'
        }).then(function (response) {
            $scope.status = response.status;
            $scope.ajaxDataUsuariosNumber = response.data.message;
            $scope.totalPages = Math.ceil($scope.ajaxDataUsuariosNumber / $scope.rpp);
            if ($scope.page > $scope.totalPages) {
                $scope.page = $scope.totalPages;
                $scope.update();
            }
            pagination2();
        }, function (response) {
            $scope.ajaxDataUsuariosNumber = response.data.message || 'Request failed';
            $scope.status = response.status;
        });

        $http({
            method: 'GET',
            url: 'http://localhost:8081/casafacil/json?ob=' + $scope.ob + '&op=getpage&rpp=' + $scope.rpp + '&page=' + $scope.page + $scope.orderURLServidor
        }).then(function (response) {
            $scope.status = response.status;
            $scope.ajaxDataUsuarios = response.data.message;
            for (var i = 0; i < $scope.ajaxDataUsuarios.length; i++) {
                $scope.ajaxDataUsuarios[i].fechacreacion = formatDate($scope.ajaxDataUsuarios[i].fechacreacion);
                $scope.ajaxDataUsuarios[i].fechaupdate = formatDate($scope.ajaxDataUsuarios[i].fechaupdate);
            }
        }, function (response) {
            $scope.status = response.status;
            $scope.ajaxDataUsuarios = response.data.message || 'Request failed';
        });

        $scope.update = function () {
            $location.url($scope.ob + `/plist/` + $scope.rpp + `/` + $scope.page + '/' + $scope.orderURLCliente);
        }

        //paginacion neighbourhood
        function pagination2() {
            $scope.list2 = [];
            $scope.neighborhood = 3;
            for (var i = 1; i <= $scope.totalPages; i++) {
                if (i === $scope.page) {
                    $scope.list2.push(i);
                } else if (i <= $scope.page && i >= ($scope.page - $scope.neighborhood)) {
                    $scope.list2.push(i);
                } else if (i >= $scope.page && i <= ($scope.page - -$scope.neighborhood)) {
                    $scope.list2.push(i);
                } else if (i === ($scope.page - $scope.neighborhood) - 1) {
                    $scope.list2.push("...");
                } else if (i === ($scope.page - -$scope.neighborhood) + 1) {
                    $scope.list2.push("...");
                }
            }
        }
        $scope.create = function () {
            $location.url($scope.ob + '/new');
        }
        $scope.isActive = toolService.isActive;

        function formatDate(fecha) {
            var fechaCambiada = fecha.replace(', ', ' ');
            var fechaSeparada = fechaCambiada.split(" ");
//            var horaSeparada = fechaSeparada[3].split(":");

            var dia = fechaSeparada[1];
            var mes;
            var anyo = fechaSeparada[2];
//            var hora;
//            var minuto = horaSeparada[1];
//            var segundo = horaSeparada[2];

            switch (fechaSeparada[0]) {
                case "ene":
                    mes = "1";
                    break;
                case "feb":
                    mes = "2";
                    break;
                case "mar":
                    mes = "3";
                    break;
                case "abr":
                    mes = "4";
                    break;
                case "may":
                    mes = "5";
                    break;
                case "jun":
                    mes = "6";
                    break;
                case "jul":
                    mes = "7";
                    break;
                case "ago":
                    mes = "8";
                    break;
                case "sep":
                    mes = "9";
                    break;
                case "oct":
                    mes = "10";
                    break;
                case "nov":
                    mes = "11";
                    break;
                case "dec":
                    mes = "12";
                    break;
            }

//            if (fechaSeparada[4] === "AM") {
//                if (horaSeparada[0] === "12") {
//                    hora = "0";
//                } else {
//                    hora = horaSeparada[0];
//                }
//            } else {
//                if (horaSeparada[0] === "12") {
//                    horaSeparada[0] = "0";
//                }
//                var horaAm = parseInt(horaSeparada[0]);
//                hora = horaAm + 12;
//            }

            var fechaFinal = dia + '/' + mes + '/' + anyo;
            return fechaFinal;
        }
    }
]);