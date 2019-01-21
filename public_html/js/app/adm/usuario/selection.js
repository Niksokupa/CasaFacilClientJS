'use strict'

moduleComponent.component('usuarioSelection', {
    templateUrl: 'js/app/usuario/selection.html',
     bindings: {
        obj: '=',
        onUsuarioSet: '&',
        neighborhood: '<',
    },
    controllerAs: 'c',
    controller: js
});

function js($http, $routeParams) {

    var self = this;
    if (!self.rpp) {
        self.rpp = 5;
    }
    if (!self.page) {
        self.page = 1;
    }
    self.orderURLServidor = "";

    modal_data();

    //paginacion neighbourhood
    function pagination2() {
        self.list2 = [];
        self.neighborhood = 2;
        for (var i = 1; i <= self.totalPages; i++) {
            if (i === self.page) {
                self.list2.push(i);
            } else if (i <= self.page && i >= (self.page - self.neighborhood)) {
                self.list2.push(i);
            } else if (i >= self.page && i <= (self.page - -self.neighborhood)) {
                self.list2.push(i);
            } else if (i === (self.page - self.neighborhood) - 1) {
                self.list2.push("...");
            } else if (i === (self.page - -self.neighborhood) + 1) {
                self.list2.push("...");
            }
        }
    }

    //Ordenar ascendentemente o descendentemente
    self.ordena = function (order, align) {
        if (self.orderURLServidor == "") {
            self.orderURLServidor = "&order=" + order + "," + align;
            self.orderURLCliente = order + "," + align;
        } else {
            self.orderURLServidor = self.orderURLServidor + "-" + order + "," + align;
            self.orderURLCliente = self.orderURLCliente + "-" + order + "," + align;
        }
        modal_data();
    }

    function modal_data() {
        $http({
            method: 'GET',
            url: `http://localhost:8081/casafacil/json?ob=usuario&op=getcount`
        }).then(function (response) {
            console.log(response);
            self.status = response.status;
            self.ajaxDataUsuariosNumber = response.data.message;
            self.totalPages = Math.ceil(self.ajaxDataUsuariosNumber / self.rpp);
            if (self.page > self.totalPages) {
                self.page = self.totalPages;
                self.update();
            }
            pagination2();
        }, function (response) {
            self.ajaxDataUsuariosNumber = response.data.message || 'Request failed';
            self.status = response.status;
        });

        $http({
            method: 'GET',
            url: `http://localhost:8081/casafacil/json?ob=usuario&op=getpage&rpp=` + self.rpp + '&page=' + self.page + self.orderURLServidor
        }).then(function (response) {
            console.log(response);
            self.status = response.status;
            self.modal = response.data.message;
        }, function (response) {
            self.status = response.status;
            self.ajaxDataUsuarios = response.data.message || 'Request failed';
        });
    }



    self.formatDate = function (date) {
        var fecha = new Date(date);
        return `${fecha.getDate()}-${fecha.getMonth()}-${fecha.getFullYear()}`;
    }

    self.selected = function (id) {
        self.data = id;
    }
    //Cargo los datos dependiendo de en que pagina este
    self.pagination_destino = function (pagina) {
        self.page = pagina;
        modal_data();
    }

    //Cuando cambio de reguistros se ejecuta esto y el valor del select se guarda en self.registros_modal
    //Reseteo la pagina para que empiece en la primera
    self.update_registro = function (rpp) {
        self.rpp = rpp;
        self.page = 1;
        modal_data();
    }

    self.resetAll = function () {
        self.rpp = 5;
        self.page = 1;
        self.orderURLServidor = "";
        modal_data();
    };

    self.selected = function (id, nombre) {
        self.obj.id = id;
        self.obj.nombre = nombre;
        self.onUsuarioSet();
    };
}