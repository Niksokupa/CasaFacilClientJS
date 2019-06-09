'use strict';

moduleAnuncio.controller('editanunciosController', ['$scope', '$http', '$location', 'toolService', '$routeParams', 'sessionService', '$anchorScroll', '$mdDialog',
    function ($scope, $http, $location, toolService, $routeParams, oSessionService, $anchorScroll, $mdDialog) {
        $anchorScroll();
        $scope.userId = oSessionService.getId();
        $scope.parcela = false;
        $scope.ciudadselected = true;
        $scope.selectedExtras = [];
        $scope.edited = false;


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
                $(".hasExtra" + id).removeClass("md-checked");
            } else {
                $scope.selectedExtras.push(id);
                $(".hasExtra" + id).addClass("md-checked");
            }
        };


        //DATOS DEL ANUNCIO EN CUESTIÓN
        $http({
            method: "GET",
            url: `http://localhost:8081/casafacil/json?ob=anuncio&op=get&id=${$routeParams.id}`
        }).then(function (response) {
            $scope.id = response.data.message.id;
            $scope.titulo = response.data.message.titulo;
            $scope.banyos = response.data.message.banyos;
            $scope.precio = response.data.message.precio;
            $scope.descripcion = response.data.message.descripcion;
            $scope.direccion = response.data.message.direccion;
            $scope.habitaciones = response.data.message.habitaciones;
            $scope.metrosparcela = response.data.message.metrosterreno;
            $scope.metroscasa = response.data.message.metroscasa;
            $scope.fechacreacion = response.data.message.fechacreacion;
            $scope.selectedBarrio = response.data.message.obj_Barrio.id;
            $scope.selectedVia = response.data.message.obj_Tipovia.id;
            $scope.selectedInmueble = response.data.message.obj_Tipoinmueble.id;
            $scope.ciudad = response.data.message.obj_Barrio.obj_ciudad.id;

            $http({
                method: "GET",
                url: `http://localhost:8081/casafacil/json?ob=barrio&op=getall&ciudad=` + $scope.ciudad
            }).then(function (response) {
                var listaBarrios = [];
                response.data.message.forEach(element => {
                    var barrios = {
                        barrios: element
                    };
                    listaBarrios.push(barrios);

                });
                $scope.listaBarrios = listaBarrios;
            });

            $http({
                method: "GET",
                url: `http://localhost:8081/casafacil/json?ob=extras&op=getspecific&id=${$routeParams.id}`
            }).then(function (response) {
                response.data.message.forEach(element => {
                    //RECOJO LOS EXTRAS Y LAS ALMACENO EN ESTE ARRAY
                    $scope.selectedExtras.push(element.id_extras);
                    //PRE-CHECKEO LOS EXTRAS 
                    $(".hasExtra" + element.id_extras).addClass("md-checked");
                });
            });
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
                }
                listaExtras.push(extras);

            });
            $scope.listaExtras = listaExtras;

            $scope.extrasInput = [];

        }), function (response) {
            console.log(response);
        };

        //TODAS LAS FOTOS
        $http({
            method: "GET",
            url: `http://localhost:8081/casafacil/json?ob=fotos&op=getall&id=${$routeParams.id}`
        }).then(function (response) {
            var fotos = [];
            response.data.message.forEach(element => {
                var foto = {
                    foto: element
                }
                fotos.push(foto);

            });
            $scope.listaFotos = fotos;
            if ($scope.listaFotos.length !== 0) {
                $scope.hayFotos = true;
            } else {
                $scope.hayFotos = false;
            }

        }), function (response) {
            console.log(response);
        };


        var date = new Date().toISOString().slice(0, 10).toString();

        $scope.create = function () {
            var fotos = [];
            var anuncio = {
                id: $scope.id,
                titulo: $scope.titulo,
                precio: $scope.precio,
                descripcion: $scope.descripcion,
                direccion: $scope.direccion,
                banyos: $scope.banyos,
                habitaciones: $scope.habitaciones,
                metrosterreno: $scope.metrosparcela,
                metroscasa: $scope.metroscasa,
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
                url: `http://localhost:8081/casafacil/json?ob=anuncio&op=update`,
                params: {anuncio: JSON.stringify(anuncio), fotos: JSON.stringify(fotos), extras: JSON.stringify($scope.selectedExtras)}
            }).then(function (response) {
                $scope.edited = true;
            }), function (response) {

            };

        };


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
        };


        //Funcion jQuery previsualizar múltiples imágenes
        $(function () {
            // Multiple images preview in browser
            var imagesPreview = function (input, placeToInsertImagePreview) {

                if (input.files) {
                    var filesAmount = input.files.length;

                    for (var i = 0; i < filesAmount; i++) {
                        var reader = new FileReader();

                        reader.onload = function (event) {
                            var lastFive = event.target.result.substr(0,15);
                            if (lastFive === "data:image/png" || lastFive === "data:image/jpeg" || lastFive === "data:image/jpg") {
                                $($.parseHTML('<img>')).attr('src', event.target.result).appendTo(placeToInsertImagePreview);
                            }
                        };

                        reader.readAsDataURL(input.files[i]);
                    }
                }

            };

            $('#gallery-photo-add').on('change', function () {
                imagesPreview(this, 'div.gallery');
            });
        });
//
        $scope.showConfirm = function (ev, id, id_foto, ruta) {
            // Appending dialog to document.body to cover sidenav in docs app
            var confirm = $mdDialog.confirm()
                    .title('¿Realmente quieres eliminar ésta foto?')
                    .textContent()
                    .ariaLabel('eliminarFoto')
                    .targetEvent(ev)
                    .ok('Eliminar')
                    .cancel('Cancelar');

            $mdDialog.show(confirm).then(function () {
                $http({
                    method: "GET",
                    url: `http://localhost:8081/casafacil/json?ob=fotos&op=remove&id=` + id_foto
                }).then(function (response) {
                    $http({
                        method: "GET",
                        url: `http://localhost:8081/casafacil/json?ob=fotos&op=removeimage&ruta=` + ruta
                    });
                    $scope.listaFotos.splice(id, 1);
                }), function (response) {
                    console.log(response);
                };
                $scope.status = 'You decided to get rid of your debt.';
            }, function () {
                $scope.status = 'You decided to keep your debt.';
            });
        };


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
                        var lastFive = item.name.substr(item.name.length - 5);
                        if (lastFive === ".png" || lastFive === ".jpeg" || lastFive === ".jpg") {
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
    