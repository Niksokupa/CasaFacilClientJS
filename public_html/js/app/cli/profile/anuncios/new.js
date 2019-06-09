'use strict';

moduleAnuncio.controller('newanunciosController', ['$scope', '$http', '$location', 'toolService', '$routeParams', 'sessionService', '$anchorScroll',
    function ($scope, $http, $location, toolService, $routeParams, oSessionService, $anchorScroll) {

        $scope.parcela = false;
        $scope.ciudadselected = false;
        $scope.selectedExtras = [];
        $scope.created = false;



        $scope.ciudades = [
            {value: 1, nombre: "Alicante"},
            {value: 2, nombre: "Valencia"},
            {value: 3, nombre: "Castellón"}
        ];
        $scope.inmuebles = [
            {value: 1, nombre: "Piso"},
            {value: 2, nombre: "Casa"},
            {value: 3, nombre: "Chalet"},
            {value: 4, nombre: "Ático"}
        ];
        $scope.vias = [
            {value: 1, nombre: "Calle"},
            {value: 2, nombre: "Avenida"},
            {value: 3, nombre: "Plaza"},
            {value: 4, nombre: "Camino"}
        ];

        $scope.showParcela = function () {
            if ($scope.selectedInmueble === 3) {
                $scope.parcela = true;
            } else {
                $scope.parcela = false;
            }
        };

        $scope.filtroExtras = function (id) {

            var index = $scope.selectedExtras.indexOf(id);
            if (index > -1) {
                $scope.selectedExtras.splice(index, 1);
            } else {
                $scope.selectedExtras.push(id);
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
                }
                listaExtras.push(extras);

            });
            $scope.listaExtras = listaExtras;

            $scope.extrasInput = [];

        }), function (response) {
            console.log(response);
        };

        var date = new Date().toISOString().slice(0, 10).toString();

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
                fechacreacion: date,
                fechaupdate: date,
                id_Barrio: $scope.selectedBarrio,
                id_Tipovia: $scope.selectedVia,
                id_Usuario: oSessionService.getId(),
                id_Tipoinmueble: $scope.selectedInmueble
            };


            if ($scope.files !== undefined) {
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
            }

            $http({
                method: "GET",
                url: `http://localhost:8081/casafacil/json?ob=anuncio&op=create`,
                params: {anuncio: JSON.stringify(anuncio), fotos: JSON.stringify(fotos), extras: JSON.stringify($scope.selectedExtras)}
            }).then(function (response) {
                $scope.created = true;
                $scope.id = response.data.message.id;
            }), function (response) {

            };

        };

//        $scope.remove = function (data) {
//            var index = $scope.files.indexOf(data);     
//            $scope.files.splice(index, 1);
//        }

        $scope.rellenaBarrio = function () {
            $scope.ciudadselected = true;
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
                            var lastFive = event.target.result.substr(event.target.result.length - 5);
                            if(lastFive === ".png" || lastFive === ".jpeg" || lastFive === ".jpg") {
                                $($.parseHTML('<img>')).attr('src', event.target.result).appendTo(placeToInsertImagePreview);
                            }
                        }

                        reader.readAsDataURL(input.files[i]);
                    }
                }

            };

            $('#gallery-photo-add').on('change', function () {
                imagesPreview(this, 'div.gallery');
            });
        });


    }
]).directive('ngFileModel', ['$parse', function ($parse) {
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
                        var lastFive = item.name.substr(item.name.length - 5);
                        if(lastFive === ".png" || lastFive === ".jpeg" || lastFive === ".jpg") {
                            values.push(item);
                        }
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
    