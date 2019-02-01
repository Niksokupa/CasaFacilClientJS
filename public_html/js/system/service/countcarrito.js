'use strict';
moduleService.service('countcarritoService', ['$http', 'sessionService', function ($http, sessionService) {

    return {
        updateCarrito: function(){
            $http({
                method: "GET",
                url: "http://localhost:8081/casafacil/json?ob=carrito&op=show"
            }).then(function (response) {
                var aux = 0;
                if(response.data.message != null){
                    for (var i = 0; i < response.data.message.length; i++) {
                        aux += response.data.message[i].cantidad;
                    }
                }
            }, function (response) {
            });
        }
    }
}]);