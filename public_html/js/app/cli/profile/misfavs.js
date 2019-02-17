'use strict'

moduleFavs.controller('favsController', ['$scope', '$http', '$location', 'toolService', '$routeParams', 'sessionService', '$anchorScroll', 'favsObserverService',
    function ($scope, $http, $location, toolService, $routeParams, oSessionService, $anchorScroll, favsService) {

        $anchorScroll();
        $scope.totalPages = 1;
        $scope.ob = "favorito";
        $scope.sinanuncios = true;

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
            if (response.data.message.length > 0) {
                $scope.sinanuncios = false;
            } else {
                $scope.sinanuncios = true;
            }
            //TODAS LAS FOTOS
            $http({
                method: "GET",
                url: `http://localhost:8081/casafacil/json?ob=fotos&op=geteverything`
            }).then(function (response2) {
                $scope.fotos = response2.data.message;

                $scope.message = response.data.message;
                var productos = [];


                response.data.message.forEach(element => {
                    var fotos = [];
                    if (element.descripcion.length > 250) {
                        element.descripcion = element.descripcion.substring(0, 250);
                        element.descripcion += "...";
                    }
                    element.precio = addCommas(element.precio);

                    $scope.fotos.forEach(elementFoto => {
                        if (elementFoto.obj_Anuncio.id === element.id) {
                            fotos.push(elementFoto.ruta);
                        }
                    });

                    var producto = {
                        producto: element,
                        fotos: fotos
                    };
                    productos.push(producto);

                });
                $scope.productos = productos;
            }), function (response) {
                console.log(response);
            };

        }, function (response) {
            $scope.status = response.status;
            $scope.ajaxDataUsuarios = response.data.message || 'Request failed';
        });


        $scope.favAnuncio = function (id, anuncio_id) {
            var json = {
                id_anuncio: anuncio_id,
                id_usuario: oSessionService.getId()
            };
            $http({
                method: "GET",
                url: `http://localhost:8081/casafacil/json?ob=favorito&op=remove&id_anuncio=` + anuncio_id,
                params: {json: JSON.stringify(json)}
            }).then(function (response) {
                favsService.updateFavs();
            }), function (response) {
                console.log(response);
            };
            var pasar = $(".pasar" + id);
            var anuncio = $(".anuncio" + id);
            anuncio.hide(500);
            setTimeout(function () {
                pasar.show(500);
            }, 500);
        };

        //PAGINACION
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

        //GETCOUNT PAGINACION
        $http({
            method: 'GET',
            url: 'http://localhost:8081/casafacil/json?ob=' + $scope.ob + '&op=getcountspecific'
        }).then(function (response) {
            $scope.status = response.status;
            $scope.ajaxDataUsuariosNumber = response.data.message;
            $scope.totalPages = Math.ceil($scope.ajaxDataUsuariosNumber / $scope.rpp);
            if ($scope.page > $scope.totalPages) {
                $scope.page = $scope.totalPages;
            }
            pagination2();
        }, function (response) {
            $scope.ajaxDataUsuariosNumber = response.data.message || 'Request failed';
            $scope.status = response.status;
        });

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