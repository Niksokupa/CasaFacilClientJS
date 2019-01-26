'use strict'

moduleFavs.controller('favsController', ['$scope', '$http', '$location', 'toolService', '$routeParams', 'sessionService', '$anchorScroll',
    function ($scope, $http, $location, toolService, $routeParams, oSessionService, $anchorScroll) {

        $anchorScroll();
        $scope.totalPages = 1;
        $scope.ob = "favorito";

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

        //GETPAGE DE ANUNCIO
        $http({
            method: 'GET',
            url: `http://localhost:8081/casafacil/json?ob=${$scope.ob}&op=getpagespecific&rpp=` + $scope.rpp + '&page=' + $scope.page + $scope.orderURLServidor
        }).then(function (response) {
            $scope.status = response.status;
            var productos = [];
            response.data.message.forEach(element => {
                if (element.descripcion.length > 200) {
                    element.descripcion = element.descripcion.substring(0, 200);
                    element.descripcion += "...";
                }

                element.precio = addCommas(element.precio);

                var producto = {
                    producto: element
                }
                productos.push(producto);
            });
            $scope.productos = productos;
        }, function (response) {
            $scope.status = response.status;
            $scope.ajaxDataUsuarios = response.data.message || 'Request failed';
        });

        $scope.favAnuncio = function (id, anuncio_id) {
            if (oSessionService.isSessionActive()) {
//                var json = {
//                    id_anuncio: anuncio_id,
//                    id_usuario: oSessionService.getId()
//                };
//                $http({
//                    method: "GET",
//                    url: `http://localhost:8081/casafacil/json?ob=favorito&op=remove`,
//                    params: {json: JSON.stringify(json)}
//                }).then(function (response) {
//                }), function (response) {
//                };
                $scope.productos.splice(id, 1);
            } else {
                $location.url('/usuario/login');
            }
        };

        //AÑADE PUNTOS DE MILES
        function addCommas(nStr)
        {
            nStr += '';
            var x = nStr.split('.');
            var x1 = x[0];
            var x2 = x.length > 1 ? '.' + x[1] : '';
            var rgx = /(\d+)(\d{3})/;
            while (rgx.test(x1)) {
                x1 = x1.replace(rgx, '$1' + '.' + '$2');
            }
            return x1 + x2;
        }

    }]);