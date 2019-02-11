var autenticacionAdministrador = function ($q, $location, $http, sessionService) {
    var deferred = $q.defer();
    $http({
        method: 'GET',
        url: 'http://localhost:8081/casafacil/json?ob=usuario&op=check'
    }).then(function (response) {
        if (response.data.status == 200) {
            sessionService.setSessionActive();
            sessionService.setUserName(response.data.message.nombre + " " + response.data.message.ape1);
            sessionService.setId(response.data.message.id);
            if (response.data.message.obj_tipoUsuario.desc === "Administrador") {
                sessionService.setAdmin();
            } else {
                $location.path('/cli/home');
            }
            //comprobar que el usuario en sesión es administrador
            //hay que meter el usuario activo en el sessionService
            deferred.resolve();
        } else {
            sessionService.setSessionInactive();
            $location.path('/cli/home');
        }
    }, function (response) {
        sessionService.setSessionInactive();
        $location.path('/cli/home');
    });
    return deferred.promise;
};

var autenticacionUsuario = function ($q, $location, $http, sessionService) {
    var deferred = $q.defer();
    $http({
        method: 'GET',
        url: 'http://localhost:8081/casafacil/json?ob=usuario&op=check'
    }).then(function (response) {
        if (response.data.status == 200) {
            sessionService.setSessionActive();
            sessionService.setUserName(response.data.message.nombre + " " + response.data.message.ape1);
            sessionService.setId(response.data.message.id);
            if (response.data.message.obj_tipoUsuario.desc !== "Administrador") {
                sessionService.setUser();
            } else {
                $location.path('/cli/home');
            }
            //comprobar que el usuario en sesión es usuario
            //hay que meter el usuario activo en el sessionService
            deferred.resolve();
        } else {
            sessionService.setSessionInactive();
            $location.path('/cli/home');
        }
    }, function (response) {
        sessionService.setSessionInactive();
        $location.path('/cli/home');
    });
    return deferred.promise;
};

var autenticacionHome = function ($q, sessionService, $http, favsObserverService) {
    var deferred = $q.defer();
    $http({
        method: 'GET',
        url: 'http://localhost:8081/casafacil/json?ob=usuario&op=check'
    }).then(function (response) {
        if (response.data.message !== "No active session") {
            if (response.data.message.obj_tipoUsuario.id === 1) {
                sessionService.setSessionActive();
                sessionService.setUserName(response.data.message.nombre + " " + response.data.message.ape1);
                sessionService.setId(response.data.message.id);
                sessionService.setAdmin();
                deferred.resolve();
            } else if (response.data.message.obj_tipoUsuario.id === 2) {
                sessionService.setSessionActive();
                sessionService.setUserName(response.data.message.nombre + " " + response.data.message.ape1);
                sessionService.setId(response.data.message.id);
                sessionService.setUser();
                favsObserverService.updateFavs();
                deferred.resolve();
            }
        }
        deferred.resolve();

    }, function (response) {
        deferred.resolve();
    });
    return deferred.promise;
};


casafacil.config(['$routeProvider', function ($routeProvider) {


        /*************************COMMON*****************************/

        $routeProvider.when('/usuario/login', {templateUrl: 'js/app/common/login.html', controller: 'usuarioLoginController', resolve: {auth: autenticacionHome}});
        $routeProvider.when('/usuario/logout', {templateUrl: 'js/app/common/logout.html', controller: 'usuarioLogoutController', resolve: {auth: autenticacionHome}});




        /*************************ADMIN*****************************/


        //HOME
        $routeProvider.when('/adm/home', {templateUrl: 'js/app/adm/home.html', controller: 'homeControllerAdm', resolve: {auth: autenticacionAdministrador}});

        //TIPOUSUARIO
        $routeProvider.when('/adm/tipousuario/plist', {templateUrl: 'js/app/adm/tipousuario/plist.html', controller: 'tipousuarioPlistController', resolve: {auth: autenticacionAdministrador}});
        $routeProvider.when('/adm/tipousuario/plist/:rpp?/:page?/:order?', {templateUrl: 'js/app/adm/tipousuario/plist.html', controller: 'tipousuarioPlistController', resolve: {auth: autenticacionAdministrador}});
        $routeProvider.when('/adm/tipousuario/edit/:id', {templateUrl: 'js/app/adm/tipousuario/edit.html', controller: 'tipousuarioEditController', resolve: {auth: autenticacionAdministrador}});
        $routeProvider.when('/adm/tipousuario/view/:id', {templateUrl: 'js/app/adm/tipousuario/view.html', controller: 'tipousuarioViewController', resolve: {auth: autenticacionAdministrador}});
        $routeProvider.when('/adm/tipousuario/remove/:id', {templateUrl: 'js/app/adm/tipousuario/remove.html', controller: 'tipousuarioRemoveController', resolve: {auth: autenticacionAdministrador}});
        $routeProvider.when('/adm/tipousuario/new', {templateUrl: 'js/app/adm/tipousuario/new.html', controller: 'tipousuarioNewController', resolve: {auth: autenticacionAdministrador}});

        //USUARIO
        $routeProvider.when('/adm/usuario/plist', {templateUrl: 'js/app/adm/usuario/plist.html', controller: 'usuarioPlistController', resolve: {auth: autenticacionAdministrador}});
        $routeProvider.when('/adm/usuario/new', {templateUrl: 'js/app/adm/usuario/new.html', controller: 'usuarioNewController', resolve: {auth: autenticacionAdministrador}});
        $routeProvider.when('/adm/usuario/view/:id', {templateUrl: 'js/app/adm/usuario/view.html', controller: 'usuarioViewController', resolve: {auth: autenticacionAdministrador}});
        $routeProvider.when('/adm/usuario/edit/:id', {templateUrl: 'js/app/adm/usuario/edit.html', controller: 'usuarioEditController', resolve: {auth: autenticacionAdministrador}});
        $routeProvider.when('/adm/usuario/remove/:id', {templateUrl: 'js/app/adm/usuario/remove.html', controller: 'usuarioRemoveController', resolve: {auth: autenticacionAdministrador}});
        $routeProvider.when('/adm/usuario/plist/:rpp?/:page?/:order?', {templateUrl: 'js/app/adm/usuario/plist.html', controller: 'usuarioPlistController', resolve: {auth: autenticacionAdministrador}});


        //ANUNCIO
        $routeProvider.when('/adm/anuncio/plist', {templateUrl: 'js/app/adm/anuncio/plist.html', controller: 'anuncioPlistController', resolve: {auth: autenticacionAdministrador}});
        $routeProvider.when('/adm/anuncio/plist/:rpp?/:page?/:order?', {templateUrl: 'js/app/adm/anuncio/plist.html', controller: 'anuncioPlistController', resolve: {auth: autenticacionAdministrador}});
        $routeProvider.when('/adm/anuncio/new/:id?', {templateUrl: 'js/app/adm/anuncio/new.html', controller: 'anuncioNewController', resolve: {auth: autenticacionAdministrador}});
        $routeProvider.when('/adm/anuncio/view/:id', {templateUrl: 'js/app/adm/anuncio/view.html', controller: 'anuncioViewController', resolve: {auth: autenticacionAdministrador}});
        $routeProvider.when('/adm/anuncio/edit/:id', {templateUrl: 'js/app/adm/anuncio/edit.html', controller: 'anuncioEditController', resolve: {auth: autenticacionAdministrador}});
        $routeProvider.when('/adm/anuncio/remove/:id', {templateUrl: 'js/app/adm/anuncio/remove.html', controller: 'anuncioRemoveController', resolve: {auth: autenticacionAdministrador}});
        $routeProvider.when('/adm/usuario/:id/anuncio/plistspecific/:rpp?/:page?/:order?', {templateUrl: 'js/app/adm/anuncio/plistspecific.html', controller: 'anuncioPlistspecificController', resolve: {auth: autenticacionAdministrador}});


        //DEFAULT
        $routeProvider.otherwise({redirectTo: '/adm/home', resolve: {auth: autenticacionAdministrador}});


        /*************************CLIENTE*****************************/

        //HOME
        $routeProvider.when('/cli/home', {templateUrl: 'js/app/cli/home.html', controller: 'homeController', resolve: {auth: autenticacionHome}});

        //ANUNCIO
        $routeProvider.when('/cli/ciudad/:id/:barrio?/:rpp?/:page?/:order?', {templateUrl: 'js/app/cli/anuncio/plist.html', controller: 'ciudadController', resolve: {auth: autenticacionHome}});
        $routeProvider.when('/cli/anuncio/:id', {templateUrl: 'js/app/cli/anuncio/view.html', controller: 'viewanunciosController', resolve: {auth: autenticacionHome}});



        //USUARIO Y SUS FUNCIONES
        $routeProvider.when('/cli/misfavs', {templateUrl: 'js/app/cli/profile/misfavs.html', controller: 'favsController', resolve: {auth: autenticacionUsuario}});
        $routeProvider.when('/cli/misanuncios', {templateUrl: 'js/app/cli/profile/anuncios/misanuncios.html', controller: 'misanunciosController', resolve: {auth: autenticacionUsuario}});
        $routeProvider.when('/cli/misanuncios/new', {templateUrl: 'js/app/cli/profile/anuncios/new.html', controller: 'newanunciosController', resolve: {auth: autenticacionUsuario}});
        $routeProvider.when('/cli/misanuncios/edit/:id', {templateUrl: 'js/app/cli/profile/anuncios/edit.html', controller: 'editanunciosController', resolve: {auth: autenticacionUsuario}});
        $routeProvider.when('/cli/profile', {templateUrl: 'js/app/cli/profile/profile.html', controller: 'usuarioProfileController', resolve: {auth: autenticacionUsuario}});





    }]);
