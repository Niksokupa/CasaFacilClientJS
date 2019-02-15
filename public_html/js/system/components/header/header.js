moduleComponent.component('headerComponent', {
    //restrict: 'A',
    templateUrl: 'js/system/components/header/header.html',
    bindings: {
        animation: '<'
    },
    controllerAs: 'c',
    controller: js
});

function js(toolService, sessionService, $scope, $http, $location) {
    var self = this;

//    $(window).scroll(function () {
//        // checks if window is scrolled more than 500px, adds/removes solid class
//        if ($(this).scrollTop() > 250) {
//            $('.navbar').addClass('solid');
//        } else {
//            $('.navbar').removeClass('solid');
//        }
//    });


    self.logged = sessionService.isSessionActive();
    self.name = sessionService.getUserName();
    self.idUserLogged = sessionService.getId();
    self.isActive = toolService.isActive;
    self.isAdmin = sessionService.isAdmin();

    sessionService.registerObserverCallback(function () {
        self.name = sessionService.getUserName();
    });
    sessionService.registerObserverCallback(function () {
        self.isAdmin = sessionService.isAdmin();
    });

    sessionService.registerObserverCallback(function () {
        self.logged = sessionService.isSessionActive();
    });

    $scope.logout = function () {
        $http({
            method: 'GET',
            url: 'http://localhost:8081/casafacil/json?ob=usuario&op=logout'
        }).then(function () {
            $scope.logged = false;
            sessionService.logOut();
            $location.path('cli/home');
        });
    }
}