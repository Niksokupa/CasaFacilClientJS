'use strict'

moduleAnuncio.controller('viewanunciosController', ['$scope', '$http', 'toolService', '$routeParams', 'sessionService', '$anchorScroll',
    function ($scope, $http, toolService, $routeParams, oSessionService, $anchorScroll) {
        $anchorScroll();
        $scope.terreno = false;
        $scope.id = $routeParams.id;
        $scope.userId = oSessionService.getId();

        $http({
            method: 'GET',
            url: 'http://localhost:8081/casafacil/json?ob=anuncio&op=get&id=' + $scope.id
        }).then(function (response) {
            $scope.anuncio = response.data.message;
            if ($scope.anuncio.metrosterreno !== 0) {
                $scope.terreno = true;
            }


            $scope.anuncio.precio = addCommas($scope.anuncio.precio);

        }, function (response) {
            $scope.error = response.data.message || 'Request failed';
        });

        $http({
            method: 'GET',
            url: 'http://localhost:8081/casafacil/json?ob=fotos&op=getall&id=' + $scope.id
        }).then(function (response) {
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