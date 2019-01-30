'use strict';

moduleAnuncio.controller('newanunciosController', ['$scope', '$http', '$location', 'toolService', '$routeParams', 'sessionService', '$anchorScroll',
    function ($scope, $http, $location, toolService, $routeParams, oSessionService, $anchorScroll) {

        $scope.parcela = false;
        $scope.ciudadselected = false;


        $scope.ciudades = [
            {value: 1, nombre: "Alicante"},
            {value: 2, nombre: "Valencia"},
            {value: 3, nombre: "Castellón"}
        ];

        //TODOS LOS EXTRAS
        $http({
            method: "GET",
            url: `http://localhost:8081/casafacil/json?ob=extras&op=getall`
        }).then(function (response) {
            var listaExtras = [];
            response.data.message.forEach(element => {
                var extras = {
                    extras: element
                }
                listaExtras.push(extras);

            });
            $scope.listaExtras = listaExtras;

            $scope.extrasInput = [];

        }), function (response) {
            console.log(response);
        };

        $scope.create = function () {
            var fotos = [];
            var anuncio = {
                titulo: $scope.titulo,
                precio: $scope.precio,
                descripcion: $scope.descripcion,
                direccion: $scope.direccion,
                banyos: $scope.banyos,
                habitaciones: $scope.habitaciones,
                metrosterreno: $scope.metrosparcela,
                metroscasa: $scope.metroscasa,
                fechacreacion: Date(Date.now()).toString(),
                fechaupdate: Date(Date.now()).toString(),
                id_barrio: $scope.selectedBarrio,
                id_tipovia: $scope.selectedVia,
                id_usuario: oSessionService.getId(),
                id_tipoinmueble: $scope.selectedInmueble
            };

            console.log(anuncio);

            var oFormData = new FormData();

            for (var i = 0; i < $scope.files.length; i++) {
                oFormData.append('file', $scope.files[i]);
                fotos.push($scope.files[i].name);
            }

            oFormData.append('file', $scope.files);
            $http({
                headers: {'Content-Type': undefined},
                method: 'POST',
                data: oFormData,
                url: `http://localhost:8081/casafacil/json?ob=anuncio&op=addimage`
            });
        };

//        $scope.remove = function (data) {
//            var index = $scope.files.indexOf(data);     
//            $scope.files.splice(index, 1);
//        }

        $scope.rellenaBarrio = function () {
            $scope.ciudadselected = true;
            console.log($scope.anuncio);
            //TODOS LOS BARRIOS
            $http({
                method: "GET",
                url: `http://localhost:8081/casafacil/json?ob=barrio&op=getall&ciudad=` + $scope.ciudad
            }).then(function (response) {
                var listaBarrios = [];
                response.data.message.forEach(element => {
                    var barrios = {
                        barrios: element
                    }
                    listaBarrios.push(barrios);

                });
                $scope.listaBarrios = listaBarrios;
            }), function (response) {
                console.log(response);
            };
        }


        //Funcion jQuery previsualizar múltiples imágenes
        $(function () {
            // Multiple images preview in browser
            var imagesPreview = function (input, placeToInsertImagePreview) {

                if (input.files) {
                    var filesAmount = input.files.length;

                    for (var i = 0; i < filesAmount; i++) {
                        var reader = new FileReader();

                        reader.onload = function (event) {
                            $($.parseHTML('<img>')).attr('src', event.target.result).appendTo(placeToInsertImagePreview);
                        }

                        reader.readAsDataURL(input.files[i]);
                    }
                }

            };

            $('#gallery-photo-add').on('change', function () {
                imagesPreview(this, 'div.gallery');
            });
        });


    }]).directive('ngFileModel', ['$parse', function ($parse) {
        return {
            restrict: 'A',
            link: function (scope, element, attrs) {
                var model = $parse(attrs.ngFileModel);
                var isMultiple = attrs.multiple;
                var modelSetter = model.assign;
                element.bind('change', function () {
                    var values = [];

                    angular.forEach(element[0].files, function (item) {
//                        var value = {
//                            // File Name 
//                            name: item.name,
//                            //File Size 
//                            size: item.size,
//                            //File URL to view 
//                            url: URL.createObjectURL(item),
//                            // File Input Value 
//                            _file: item
//                        };
                        values.push(item);

                    });
                    scope.$apply(function () {
                        if (isMultiple) {
                            modelSetter(scope, values);
                        } else {
                            modelSetter(scope, values[0]);
                        }
                    });
                });
            }
        }
    }]);
    