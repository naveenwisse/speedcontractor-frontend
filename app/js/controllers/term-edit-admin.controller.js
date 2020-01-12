angular.module('controller.term-edit-admin', [])
.controller('TermEditAdminController', function($scope, $stateParams, $log, $mdDialog, adminService, toastService) {

    var vm = this;
    vm.term = {};

    function init() {
      adminService.getTerm($stateParams.id)
      .then(({ data }) => {
        vm.term = data.term;
      },
      (err) => {
        $log.log(err);
      });
    }

    // Controller Init Operations
    // Get position
    init();

    vm.updateTerm = () => {
      $log.log(vm.term);
      const confirm = $mdDialog.confirm()
        .title('Save Changes')
        .textContent('Are you sure you want save changes?')
        .ariaLabel('Save Changes')
        .cancel('Cancel')
        .ok('Save');
      $mdDialog.show(confirm).then(function() {
        adminService.editTerm(vm.term)
        .then(({ data }) => {
          $log.log(data);
          toastService.showToast('Term ' + vm.term.sanitization + ' updated successfully', 'success', 5000);
        },
        (err) => {
          $log.error(err);
          toastService.showToast('An error was ocurred, please try again', 'error', 5000);
        });
      });
    }
});
