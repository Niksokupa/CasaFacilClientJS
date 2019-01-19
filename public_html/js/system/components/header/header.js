moduleComponent.component('headerComponent', {
    //restrict: 'A',
    templateUrl: 'js/system/components/header/header.html',
    bindings: {
        animation: '<'
    },
    controllerAs: 'c',
    controller: js
});

function js(toolService, sessionService) {
    var self = this;
    var cart = $('.carrito');
    var cartDiv = $('.highlight');

    self.logged = sessionService.isSessionActive();
    self.name = sessionService.getUserName();
    self.idUserLogged = sessionService.getId();
    self.isActive = toolService.isActive;
    self.isAdmin = sessionService.isAdmin();
    self.carrito = sessionService.getCountCarrito();

    sessionService.registerObserverCallback(function () {
        self.name = sessionService.getUserName();
    });
    sessionService.registerObserverCallback(function () {
        self.isAdmin = sessionService.isAdmin();
    });

    sessionService.registerObserverCallback(function () {
        self.carrito = sessionService.getCountCarrito();

        if (self.animation) {
            cart.effect("shake", {
                times: 2
            }, 400);
            cartDiv.effect("highlight", {color:"#f4ce42"}, 400);
        }

    });
    sessionService.registerObserverCallback(function () {
        self.logged = sessionService.isSessionActive();
    });
}