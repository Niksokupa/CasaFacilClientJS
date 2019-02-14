'use strict';

moduleAnuncio.controller('misanunciosController', ['$scope', '$http', '$location', 'toolService', '$routeParams', 'sessionService', '$anchorScroll', '$mdDialog',
    function ($scope, $http, $location, toolService, $routeParams, oSessionService, $anchorScroll, $mdDialog) {
        $anchorScroll();
        $scope.totalPages = 1;
        $scope.ob = "anuncio";

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

        //CONFIRMACION ELIMINACION DE ANUNCIO
        $scope.showConfirm = function (ev, id, id_anuncio) {
            // Appending dialog to document.body to cover sidenav in docs app
            var confirm = $mdDialog.confirm()
                    .title('¿Realmente quieres eliminar este anuncio?')
                    .textContent($scope.productos[id].producto.titulo)
                    .ariaLabel('eliminarAnuncio')
                    .targetEvent(ev)
                    .ok('Eliminar')
                    .cancel('Cancelar');

            $mdDialog.show(confirm).then(function () {
                var pasar = $(".pasar" + id);
                var anuncio = $(".anuncio" + id);
                anuncio.hide(500);
                setTimeout(function(){ pasar.show(500); }, 500);

                $http({
                    method: "GET",
                    url: `http://localhost:8081/casafacil/json?ob=${$scope.ob}&op=remove&id=` + id_anuncio
                });
                $scope.status = 'You decided to get rid of your debt.';
            }, function () {
                $scope.status = 'You decided to keep your debt.';
            });
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
