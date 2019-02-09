'use strict'

moduleCommon.controller('homeController', ['$scope', '$location', '$http', '$anchorScroll', '$q', '$timeout',
    function ($scope, $location, $http, $anchorScroll, $q, $timeout) {
        $anchorScroll();

        var simulateQuery = true;

        //TODAS LAS CIUDADES
        $http({
            method: "GET",
            url: `http://localhost:8081/casafacil/json?ob=ciudad&op=getall`
        }).then(function (response) {
            var listaCiudades = [];
            response.data.message.forEach(element => {
                var ciudad = {
                    ciudad: element
                };
                listaCiudades.push(ciudad);

            });
            $scope.listaCiudades = listaCiudades;

        }), function (response) {
            console.log(response);
        };

        $scope.selectedItemChange = function (ciudad) {
            $location.url('/cli/ciudad/' + ciudad.ciudad.id);
        }


        // FUNCIONES PARA EL AUTOCOMPLETADO
        $scope.querySearch = function (query) {
            var results = query ? $scope.listaCiudades.filter(createFilterFor(query)) : $scope.listaCiudades,
                    deferred;
            if (simulateQuery) {
                deferred = $q.defer();
                $timeout(function () {
                    deferred.resolve(results);
                }, Math.random() * 1000, false);
                return deferred.promise;
            } else {
                return results;
            }
        };

        function createFilterFor(query) {
            var lowercaseQuery = query.toUpperCase();

            return function filterFn(state) {
                return (state.ciudad.desc.indexOf(lowercaseQuery) === 0);
            };

        }


    }]);