'use strict'

moduleComprarProducto.controller('comprarproductoPlistController', ['$scope', '$http', '$location', 'toolService', '$routeParams', "countcarritoService", "$mdDialog", '$timeout', "$anchorScroll",
    function ($scope, $http, $location, toolService, $routeParams, countcarritoService, $mdDialog, $timeout, $anchorScroll) {
        
        $anchorScroll();
        $scope.addCarrito = false;
        $scope.totalPages = 1;
        $scope.ob = "comprar_productos";

        $scope.advanced = false;

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

        $http({
            method: 'GET',
            url: `http://localhost:8081/casafacil/json?ob=${toolService.objects.producto}&op=getpage&rpp=` + $scope.rpp + '&page=' + $scope.page + $scope.orderURLServidor
        }).then(function (response) {
            $scope.status = response.status;
            var productos = [];
            response.data.message.forEach(element => {
                var producto = {
                    producto: element,
                    cantidad: 0
                }
                productos.push(producto);
            });
            $scope.productos = productos;
        }, function (response) {
            $scope.status = response.status;
            $scope.ajaxDataUsuarios = response.data.message || 'Request failed';
        });

        $scope.advancedSearch = function () {
            if ($scope.advanced == false) {
                $scope.advanced = true;
            } else {
                $scope.advanced = false;
            }
        }

        $scope.save = function (producto, index) {
            if (producto.cantidad <= 0) {
                $scope.showAlert('Error añadiendo al carrito', 'Añade al menos 1 producto');
            } else if (producto.cantidad > producto.producto.existencias) {
                $scope.showAlert('Error añadiendo al carrito', `Lo sentimos. Solo disponemos de ${producto.producto.existencias} unidades de ${producto.producto.desc}`);
            } else if (!Number.isInteger(producto.cantidad)) {
                $scope.showAlert('Error añadiendo al carrito', 'Introduce SOLO cáracteres numéricos');
            } else {
                $http({
                    method: 'GET',
                    url: `http://localhost:8081/casafacil/json?ob=carrito&op=add&id=${producto.producto.id}&cant=${producto.cantidad}`
                }).then(function (response) {
                    $timeout(function () {
                        countcarritoService.updateCarrito();
                    }, 1650);
                    producto.cantidad = 0;
                    $scope.addCarrito = true;
                    cartAnimation(index);
                }, function (response) {
                    $scope.showAlert('Error', response.data.message);
                });
            }
        }

        $scope.add = function (producto) {
            if (producto.cantidad >= producto.producto.existencias) {
                $scope.showAlert('Error añadiendo productos', `Lo sentimos. Solo disponemos de ${producto.producto.existencias} unidades de ${producto.producto.desc}`);
            } else {
                producto.cantidad++;
            }
        }

        $scope.reduce = function (producto) {
            if (producto.cantidad <= 0) {
                $scope.showAlert('Error eliminando productos', 'No se puede eliminar mas productos');
            } else {
                producto.cantidad--;
            }
        }

        $scope.update = function () {
            $location.url($scope.ob + `/plist/` + $scope.rpp + `/` + $scope.page + '/' + $scope.orderURLCliente);
        }

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

        //getcount
        $http({
            method: 'GET',
            url: 'http://localhost:8081/casafacil/json?ob=producto&op=getcount'
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

        //Este mensaje se puede mejorar, buscar info en la api oficial de angular material
        //https://material.angularjs.org/latest/api/service/$mdDialog
        //https://ajax.googleapis.com/ajax/libs/angular_material/1.1.8/angular-material.css
        $scope.showAlert = function (titulo, description) {
            $mdDialog.show(
                    $mdDialog.alert()
                    .clickOutsideToClose(false)
                    .title(titulo)
                    .textContent(description)
                    .ariaLabel('Alert Dialog Demo')
                    .ok('OK!')
                    );
        };

        function cartAnimation(id) {
            
            var esto = $('.prod' + id);
            var cart = $('.carrito');
            var imgtodrag = $(esto).find("img").eq(0);
            if (imgtodrag) {
                var imgclone = imgtodrag.clone()
                        .offset({
                            top: imgtodrag.offset().top,
                            left: imgtodrag.offset().left
                        })
                        .css({
                            'opacity': '0.5',
                            'position': 'absolute',
                            'height': '128px',
                            'width': '128px',
                            'z-index': '100'
                        })
                        .appendTo($('body'))
                        .animate({
                            'top': cart.offset().top + 20,
                            'left': cart.offset().left + 20,
                            'width': 64,
                            'height': 64
                        }, 1250, 'easeOutSine');
                imgclone.animate({
                    'width': 0,
                    'height': 0
                }, function () {
                    $(this).detach()
                });
            }
        }
    }]);
