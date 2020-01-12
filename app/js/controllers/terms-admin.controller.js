angular.module('controller.terms-admin', [])
.controller('TermsAdminController', function($scope, $log, $mdDialog, adminService, toastService) {

    var vm = this;
    vm.terms = [];

    function init() {
      adminService.getAllTerms(vm.filter)
      .then(({ data }) => {
        vm.terms = data.terms;
      },
      (err) => {
        $log.log(err);
      });
    }

    // Controller Init Operations
    // Get all terms to list
    init();

    vm.remove = function(info) {
      const confirm = $mdDialog.confirm()
        .title('Remove Term')
        .textContent('Are you sure you want remove term?')
        .ariaLabel('Remove Term')
        .cancel('Cancel')
        .ok('Remove');
      $mdDialog.show(confirm).then(function() {
        adminService.removeTerm(info)
        .then(({ data }) => {
          $log.log(data);
          toastService.showToast('Term removed successfully', 'success', 5000);
          init();
        },
        (err) => {
          $log.log(err);
          toastService.showToast('An error was ocurred, please try again', 'error', 5000);
        });
      });
    }
});
