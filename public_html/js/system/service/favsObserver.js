/* global moduleService */

'use strict';
moduleService.service('favsObserverService', ['$http', 'sessionService', function ($http, sessionService) {
        return {
            updateFavs: function () {
                $http({
                    method: 'GET',
                    url: `http://localhost:8081/casafacil/json?ob=favorito&op=getpagespecific&rpp=10000&page=1`
                }).then(function (response) {
                    var arrayFavs = [];
                    response.data.message.forEach(element => {                  
                        arrayFavs.push(element.id);
                    });
                    sessionService.setFavs(arrayFavs);
                }, function (response) {});
            }
        };
    }
]);