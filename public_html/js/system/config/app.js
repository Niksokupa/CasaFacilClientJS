'use strict'

var casafacil = angular.module('MyApp', [
    'ngRoute',
    'ngAnimate',
    'services',
    'commonControllers',
    'tipousuarioControllers',
    'usuarioControllers',
    'tipoproductoControllers',
    'anuncioControllers',
    'lineaControllers',
    'productoControllers',
    'ciudadControllers',
    'ngMaterial',
    'components',
    'comprarproductoControllers'
]).config(function ($mdDateLocaleProvider) {
    // Example of a Spanish localization.
    $mdDateLocaleProvider.months = ['Enero', 'Febrero', 'Marzo', 'Abril', 'Mayo', 'Junio',
        'Julio', 'Agosto', 'Septiembre', 'Octubre', 'Noviembre', 'Diciembre'];
    $mdDateLocaleProvider.shortMonths = ['Ene', 'Feb', 'Mar', 'Abr', 'May', 'Jun',
        'Jul', 'Ago', 'Sep', 'Oct', 'Nov', 'Dic'];
    $mdDateLocaleProvider.days = ['Domingo', 'Lunes', 'Martes', 'Miercoles', 'Jueves', 'Viernes', 'Sábado'];
    $mdDateLocaleProvider.shortDays = ['Do', 'Lu', 'Ma', 'Mi', 'Ju', 'Vi', 'Sá'];
    // Can change week display to start on Monday.
    $mdDateLocaleProvider.firstDayOfWeek = 1;
    $mdDateLocaleProvider.weekNumberFormatter = function (weekNumber) {
        return 'Semana ' + weekNumber;
    };
    $mdDateLocaleProvider.msgCalendar = 'Calendario';
    $mdDateLocaleProvider.msgOpenCalendar = 'Abrir calendario';
    $mdDateLocaleProvider.formatDate = function (date) {
        return moment(date).format('DD-MM-YYYY');
    };
});



var moduleCommon = angular.module ('commonControllers',[]);
var moduleService = angular.module ('services',[]);
var moduleTipousuario = angular.module ('tipousuarioControllers',[]);
var moduleUsuario = angular.module ('usuarioControllers',[]);
var moduleProducto = angular.module ('productoControllers',[]);
var moduleAnuncio = angular.module ('anuncioControllers',[]);
var moduleLinea = angular.module ('lineaControllers',[]);
var moduleCiudad = angular.module ('ciudadControllers',[]);
var moduleTipoproducto = angular.module('tipoproductoControllers',[]);
var moduleComponent = angular.module ('components',[]);
var moduleComprarProducto = angular.module('comprarproductoControllers', []);