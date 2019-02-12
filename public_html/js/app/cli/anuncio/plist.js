/* global moduleCiudad */

'use strict';

moduleCiudad.controller('ciudadController', ['$scope', '$http', '$location', 'toolService', '$routeParams', 'sessionService', '$anchorScroll', 'favsObserverService',
    function ($scope, $http, $location, toolService, $routeParams, oSessionService, $anchorScroll, favsService) {
        $anchorScroll();
        $scope.totalPages = 1;
        $scope.ob = "anuncio";
        $scope.selectedExtras = [];
        $scope.ciudadId = $routeParams.id;
        $scope.cssCiudad = "imgciudad" + $scope.ciudadId;

        var arrayFavs = [];
        oSessionService.registerObserverCallback(function () {
            arrayFavs = oSessionService.getFavs();
        });

        $scope.verAnuncio = function (id) {
            $location.path('cli/anuncio/' + id);
        };

        $scope.ordena = function () {

            var ordename;

            if ($scope.ordenacion === "1") {
                ordename = "precio,asc";
            } else if ($scope.ordenacion === "2") {
                ordename = "precio,desc";
            } else if ($scope.ordenacion === "3") {
                ordename = "metroscasa,desc";
            } else {
                ordename = "metroscasa,asc";
            }

            $scope.orderURLServidor = "&order=" + ordename;
            $scope.orderURLCliente = $scope.ordenacion;

            $location.url(`cli/ciudad/` + $scope.ciudadId + '/' + $scope.selectedBarrio + '/' + $scope.rpp + `/` + $scope.page + `/` + $scope.orderURLCliente);
        };

        if ($routeParams.barrio) {
            $scope.selectedBarrio = $routeParams.barrio;
        }

        if (!$routeParams.order) {
            $scope.orderURLServidor = "";
            $scope.orderURLCliente = "";
        } else {
            if ($routeParams.order === "1") {
                $scope.orderURLServidor = "&order=precio,asc";
            } else if ($routeParams.order === "2") {
                $scope.orderURLServidor = "&order=precio,desc";
            } else if ($routeParams.order === "3") {
                $scope.orderURLServidor = "&order=metroscasa,desc";
            } else {
                $scope.orderURLServidor = "&order=metroscasa,asc";
            }
            $scope.orderURLCliente = $routeParams.order;
            $scope.ordenacion = $routeParams.order;
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

        //TODOS LOS EXTRAS
        $http({
            method: "GET",
            url: `http://localhost:8081/casafacil/json?ob=extras&op=getall`
        }).then(function (response) {
            var listaExtras = [];
            response.data.message.forEach(element => {
                var extras = {
                    extras: element
                };
                listaExtras.push(extras);

            });
            $scope.listaExtras = listaExtras;

            $scope.extrasInput = [];

        }), function (response) {
            console.log(response);
        };

        //TODOS LOS BARRIOS
        $http({
            method: "GET",
            url: `http://localhost:8081/casafacil/json?ob=barrio&op=getall&ciudad=` + $scope.ciudadId
        }).then(function (response) {
            var listaBarrios = [];
            response.data.message.forEach(element => {
                var barrios = {
                    barrios: element
                };
                listaBarrios.push(barrios);

            });
            $scope.listaBarrios = listaBarrios;
        }), function (response) {
            console.log(response);
        };

        //GETPAGE DE ANUNCIO
        $http({
            method: 'GET',
            url: `http://localhost:8081/casafacil/json?ob=${$scope.ob}&op=getpage&ciudad=` + $scope.ciudadId + `&extras=` + $scope.selectedExtras + `&barrio=` + $scope.selectedBarrio + `&rpp=` + $scope.rpp + '&page=' + $scope.page + $scope.orderURLServidor
        }).then(function (response) {
            $scope.message = response.data.message;
            var productos = [];
            $scope.message.forEach(element => {
                if (element.descripcion.length > 150) {
                    element.descripcion = element.descripcion.substring(0, 150);
                    element.descripcion += "...";
                }
                element.precio = addCommas(element.precio);
                var producto = {
                    producto: element
                };
                productos.push(producto);
            });
            $scope.productos = productos;
        }, function (response) {
            $scope.status = response.status;
            $scope.ajaxDataUsuarios = response.data.message || 'Request failed';
        });



        //Se ejecuta cuando se elige un extra
        $scope.filtroExtras = function (id) {

            var index = $scope.selectedExtras.indexOf(id);
            if (index > -1) {
                $scope.selectedExtras.splice(index, 1);
            } else {
                $scope.selectedExtras.push(id);
            }

            $http({
                method: 'GET',
                url: `http://localhost:8081/casafacil/json?ob=${$scope.ob}&op=getpage&ciudad=` + $scope.ciudadId + `&extras=` + $scope.selectedExtras + `&barrio=` + $scope.selectedBarrio + `&rpp=` + $scope.rpp + '&page=' + $scope.page + $scope.orderURLServidor
            }).then(function (response) {
                $scope.status = response.status;
                var productos = [];
                response.data.message.forEach(element => {
                    if (element.descripcion.length > 150) {
                        element.descripcion = element.descripcion.substring(0, 150);
                        element.descripcion += "...";
                    }

                    element.precio = addCommas(element.precio);

                    var producto = {
                        producto: element
                    };
                    productos.push(producto);
                });
                $scope.productos = productos;
            }, function (response) {
                $scope.status = response.status;
                $scope.ajaxDataUsuarios = response.data.message || 'Request failed';
            });
        };


        //Se ejecuta cuando se elige un barrio
        $scope.filtroBarrio = function () {
            $location.url(`cli/ciudad/` + $scope.ciudadId + '/' + $scope.selectedBarrio + '/' + $scope.rpp + `/` + $scope.page + `/` + $scope.orderURLCliente);

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


        $scope.favAnuncio = function (anuncio_id) {
//            $('.fav' + id).css('color', 'red');
//            $('.fav' + id).effect('bounce', 350);
//            $('.fav' + id).animate({
//                color: "red",
//            }, 200);

            if (oSessionService.isSessionActive()) {
                var json = {
                    id_anuncio: anuncio_id,
                    id_usuario: oSessionService.getId()
                };

                var existe = false;

                for (var i = 0; i < arrayFavs.length; i++) {
                    if (anuncio_id === arrayFavs[i]) {
                        existe = true;
                    }
                }

                if (!existe) {
                    $http({
                        method: "GET",
                        url: `http://localhost:8081/casafacil/json?ob=favorito&op=create`,
                        params: {json: JSON.stringify(json)}
                    }).then(function (response) {
                        $('.fav' + anuncio_id).addClass("is-active");
                        favsService.updateFavs();
                    }), function (response) {
                        console.log(response);
                    };
                } else {
                    $http({
                        method: "GET",
                        url: `http://localhost:8081/casafacil/json?ob=favorito&op=remove&id_anuncio=` + anuncio_id,
                        params: {json: JSON.stringify(json)}
                    }).then(function (response) {
                        $('.fav' + anuncio_id).removeClass("is-active");
                        favsService.updateFavs();
                    }), function (response) {
                        console.log(response);
                    };
                }
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

        $scope.$on('ngRepeatFinished', function () {
            $scope.message.forEach(element => {
                for (var i = 0; i < arrayFavs.length; i++) {
                    if (element.id === arrayFavs[i]) {
                        $('.fav' + element.id).addClass("is-active");
                    }
                }
            });
        });


    }]).directive('onFinishRender', function ($timeout) {
    return {
        restrict: 'A',
        link: function (scope, element, attr) {
            if (scope.$last === true) {
                $timeout(function () {
                    scope.$emit(attr.onFinishRender);
                });
            }
        }
    };
});
