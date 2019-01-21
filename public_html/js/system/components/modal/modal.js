moduloComponent.component('modal', {
    templateUrl: "js/system/component/modal/modal.html",
    controllerAs: 'dd',
    bindings: {
        ide: '=',
        tablereference: '<'
    },
    controller: modalWindow
});

function modalWindow(serverCallService) {
    var self = this;
    this.$onInit = function () {
        serverCallService.getAll(self.tablereference).then(function (response) {
            self.data = response.data.message.data;
         
          
        }).catch(function (data) {
            console.log(data);
        });
    };
}