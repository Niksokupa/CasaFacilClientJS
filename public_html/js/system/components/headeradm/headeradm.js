moduleComponent.component('headerComponentAdm', {
    //restrict: 'A',
    templateUrl: 'js/system/components/headeradm/headeradm.html',
    bindings: {
        animation: '<'
    },
    controllerAs: 'c',
    controller: js
});

function js(toolService, sessionService, $scope, $http, $location) {
    var self = this;

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

    $scope.oneAtATime = true;

    $scope.groups = [
        {
            title: 'Dynamic Group Header - 1',
            content: 'Dynamic Group Body - 1'
        },
        {
            title: 'Dynamic Group Header - 2',
            content: 'Dynamic Group Body - 2'
        }
    ];

    $scope.items = ['Item 1', 'Item 2', 'Item 3'];

    $scope.addItem = function () {
        var newItemNo = $scope.items.length + 1;
        $scope.items.push('Item ' + newItemNo);
    };

    $scope.status = {
        isCustomHeaderOpen: false,
        isFirstOpen: true,
        isFirstDisabled: false
    };

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