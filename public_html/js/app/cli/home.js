'use strict'

moduleCommon.controller('homeController', ['$scope', '$location', 'toolService', 'sessionService', '$anchorScroll',
    function ($scope, $location, toolService, oSessionService, $anchorScroll) {
        $anchorScroll();
        $scope.logged = false;
        $scope.ruta = $location.path();
        $scope.isActive = toolService.isActive;

        if (oSessionService.getUserName() !== "") {
            $scope.loggeduser = oSessionService.getUserName();
            $scope.loggeduserid = oSessionService.getId();
            $scope.logged = true;
        }
    }]);