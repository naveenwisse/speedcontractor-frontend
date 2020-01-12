angular.module('controller.term-create-admin', [])
.controller('TermCreateAdminController', function($scope, $log, $mdDialog, $state, adminService) {

    var vm = this;
    vm.term = {
      term: 'Term name',
      category: null
    };

    vm.save = () => {
      if (!vm.term.term || !vm.term.category) {
        const alert = $mdDialog.alert({
          title: 'Attention',
          textContent: 'Please complete each form field',
          ok: 'Close'
        });
        $mdDialog.show(alert);
      } else {
        const confirm = $mdDialog.confirm()
          .title('Add Term')
          .textContent('Are you sure you want add new term?')
          .ariaLabel('Add Term')
          .cancel('Cancel')
          .ok('Add');
        $mdDialog.show(confirm).then(function() {
          adminService.addTerm(vm.term)
          .then(({ data }) => {
            $log.log(data);
            const success = $mdDialog.alert({
              title: 'New Term',
              textContent: 'New term was added',
              ok: 'Close'
            });
            $mdDialog.show(success);
          },
          (err) => {
            $log.log(err);
            const error = $mdDialog.alert({
              title: 'New Term',
              textContent: 'New term was not added. Try again.',
              ok: 'Close'
            });
            $mdDialog.show(error);
          });
        });
      }
    }
});
