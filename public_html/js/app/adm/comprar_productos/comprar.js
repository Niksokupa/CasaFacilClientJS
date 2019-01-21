moduleComprarProducto.controller('comprarPlistController', ['$scope', '$http', "countcarritoService", "$mdDialog", "$anchorScroll",
    function ($scope, $http, countcarritoService, $mdDialog, $anchorScroll) {
        
        $anchorScroll();

        $scope.carritoVacio = false;
        $http({
            method: 'GET',
            url: `http://localhost:8081/casafacil/json?ob=carrito&op=show`
        }).then(function (response) {
            if (response.data.message !== null) {
                $scope.productos = response.data.message;
                $scope.total = 0;
                var auxCant = 0;
                var auxPrecio = 0;
                var totalInicial = 0;
                if (response.data.message.length !== null) {
                    for (var i = 0; i < response.data.message.length; i++) {
                        auxCant = response.data.message[i].cantidad;
                        auxPrecio = response.data.message[i].obj_producto.precio;

                        totalInicial += auxCant * auxPrecio;
                    }
                } else {
                    $scope.carritoVacio = true;
                }
                $scope.total = Math.round(totalInicial * 100) / 100;
                $scope.total = $scope.total.toFixed(2);
            } else {
                $scope.carritoVacio = true;
            }
        }, function (response) {
            $scope.status = response.status;
            $scope.ajaxDataUsuarios = response.data.message || 'Request failed';
        });

        $scope.carrito = function (operacion, id) {
            $http({
                method: 'GET',
                url: `http://localhost:8081/casafacil/json?ob=carrito&op=${operacion}&id=${id}&cant=1`
            }).then(function (response) {
                if (response.data.status !== 400) {
                    $scope.productos = response.data.message;
                    var auxCant = 0;
                    var auxPrecio = 0;
                    var totalModificado = 0;
                    if (response.data.message !== null) {
                        for (var i = 0; i < response.data.message.length; i++) {
                            auxCant = response.data.message[i].cantidad;
                            auxPrecio = response.data.message[i].obj_producto.precio;

                            totalModificado += auxCant * auxPrecio;
                        }
                        countcarritoService.updateCarrito();
                    } else {
                        $scope.carritoVacio = true;
                        countcarritoService.updateCarrito();
                    }
                    $scope.total = Math.round(totalModificado * 100) / 100;
                    $scope.total = $scope.total.toFixed(2);
                } else {
                    $scope.carritoVacio = true;
                }
            }, function (response) {
                $scope.status = response.status;
                $scope.ajaxDataUsuarios = response.data.message || 'Request failed';
            });
        };

        $scope.buy = function () {
            $http({
                method: 'GET',
                url: `http://localhost:8081/casafacil/json?ob=carrito&op=buy`
            }).then(function (response) {
                if (response.data.status === 200) {
                    $scope.showAlert('Correcto', 'Se ha realizado la compra correctamente');
                    $scope.carritoVacio = true;
                    $http({
                        method: 'GET',
                        url: `http://localhost:8081/casafacil/json?ob=carrito&op=empty`
                    })
                    countcarritoService.updateCarrito();
                } else {
                    $scope.showAlert('Error', response.data.message);
                    countcarritoService.updateCarrito();
                }
            }, function (response) {
                $scope.showAlert('Error', response.data.message);
            });
        };

        $scope.priceFormat = function (valor) {
            return isNaN(valor) ? valor : parseFloat(valor).toFixed(2);
        };

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
    }]);
