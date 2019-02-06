'use strict'

moduleAnuncio.controller('viewanunciosController', ['$scope', '$http', 'toolService', '$routeParams', 'sessionService', '$anchorScroll',
    function ($scope, $http, toolService, $routeParams, oSessionService, $anchorScroll) {
        $anchorScroll();
        $scope.terreno = false;
        $scope.id = $routeParams.id;


        $http({
            method: 'GET',
            url: 'http://localhost:8081/casafacil/json?ob=anuncio&op=get&id=' + $scope.id
        }).then(function (response) {
            $scope.anuncio = response.data.message;
            if ($scope.anuncio.metrosterreno !== 0) {
                $scope.terreno = true;
            }

            $scope.anuncio.precio = addCommas($scope.anuncio.precio);

            $http({
                method: 'GET',
                url: 'http://localhost:8081/casafacil/json?ob=extras&op=getspecific&id=' + $scope.anuncio.id
            }).then(function (response) {
                $scope.extras = response.data.message;
            }, function (response) {
                $scope.error = response.data.message || 'Request failed';
            });

        }, function (response) {
            $scope.error = response.data.message || 'Request failed';
        });

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

        }), function (response) {
            console.log(response);
        };

        $http({
            method: 'GET',
            url: 'http://localhost:8081/casafacil/json?ob=fotos&op=getall&id=' + $scope.id
        }).then(function (response) {
            $scope.userId = response.data.message[0].obj_Anuncio.obj_Usuario.id;
            $scope.fotos = response.data.message;
        }, function (response) {
            $scope.error = response.data.message || 'Request failed';
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
    }
]);