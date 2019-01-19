"use strict";

moduleProducto.controller("productoEditController", [
    "$scope",
    "$http",
    "$routeParams",
    "toolService",
    "sessionService",
    "$anchorScroll",
    function ($scope, $http, $routeParams, toolService, oSessionService, $anchorScroll) {
        $anchorScroll();
        $scope.edited = true;
        $scope.logged = false;

        $http({
            method: "GET",
            url: `http://localhost:8081/casafacil/json?ob=producto&op=get&id=${$routeParams.id}`
        }).then(function (response) {
            $scope.id = response.data.message.id;
            $scope.codigo = response.data.message.codigo;
            $scope.desc = response.data.message.desc;
            $scope.existencias = response.data.message.existencias;
            $scope.precio = response.data.message.precio;
            $scope.foto = response.data.message.foto;
            $scope.obj_tipoProducto = {
                id: response.data.message.obj_tipoProducto.id,
                desc: response.data.message.obj_tipoProducto.desc
            }
        }), function (response) {
            console.log(response);
        };

        $scope.update = function () {
            var foto;
            if ($scope.myFile !== undefined) {
                //Si el nombre de la imagen es "Foto" significa que es la de por defecto, se le deja intacta
                if ($scope.myFile.name == "Foto") {
                    foto = $scope.myFile.name;
                //Si la imagen que tenía el producto era la predefinida y me suben una nueva foto diferente.
                } else if($scope.foto == "Foto" && $scope.myFile.name != "Foto") {
                    foto = guid() + $scope.myFile.name;
                } else {
                    foto = $scope.foto;
                }
                uploadPhoto(foto);
            } else {
                foto = $scope.foto;
            }
            var json = {
                id: $scope.id,
                codigo: $scope.codigo,
                desc: $scope.desc,
                existencias: $scope.existencias,
                precio: $scope.precio,
                foto: foto,
                id_tipoProducto: $scope.obj_tipoProducto.id
            }
            $http({
                method: 'GET',
                header: {
                    'Content-Type': 'application/json;charset=utf-8'
                },
                url: 'http://localhost:8081/casafacil/json?ob=producto&op=update',
                params: {json: JSON.stringify(json)}
            }).then(function () {
                $scope.edited = false;
            })
        }
        $scope.isActive = toolService.isActive;

        if (oSessionService.getUserName() !== "") {
            $scope.loggeduser = oSessionService.getUserName();
            $scope.loggeduserid = oSessionService.getId();
            $scope.logged = true;
        }

        $scope.tipoProductoRefresh = function (f, consultar) {
            var form = f;
            if (consultar) {
                $http({
                    method: 'GET',
                    url: 'http://localhost:8081/casafacil/json?ob=tipoproducto&op=get&id=' + $scope.obj_tipoProducto.id
                }).then(function (response) {
                    $scope.obj_tipoProducto = response.data.message;
                    form.userForm.obj_tipoProducto.$setValidity('valid', true);
                }, function (response) {
                    form.userForm.obj_tipoProducto.$setValidity('valid', false);
                });
            } else {
                form.userForm.obj_tipoProducto.$setValidity('valid', true);
            }
        }

        function uploadPhoto(name) {
            //Solucion mas cercana
            //https://stackoverflow.com/questions/37039852/send-formdata-with-other-field-in-angular
            var file = $scope.myFile;
            file = new File([file], name, {type: file.type});
            //Api FormData 
            //https://developer.mozilla.org/es/docs/Web/API/XMLHttpRequest/FormData
            var oFormData = new FormData();
            oFormData.append('file', file);
            $http({
                headers: {'Content-Type': undefined},
                method: 'POST',
                data: oFormData,
                url: `http://localhost:8081/casafacil/json?ob=producto&op=addimage`
            });
        }

        function guid() {
            return "ss-s-s-s-sss".replace(/s/g, s4);
        }

        function s4() {
            return Math.floor((1 + Math.random()) * 0x10000)
                    .toString(16)
                    .substring(1);
        }
    }
]).directive('fileModel', ['$parse', function ($parse) {
        return {
            restrict: 'A',
            link: function (scope, element, attrs) {
                var model = $parse(attrs.fileModel);
                var modelSetter = model.assign;

                element.bind('change', function () {
                    scope.$apply(function () {
                        modelSetter(scope, element[0].files[0]);
                    });
                });
            }
        }
    }]);