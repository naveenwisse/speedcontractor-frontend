angular.module('controller.position-create-admin', [])
.controller('PositionCreateAdminController', function($scope, $log,$mdDialog, adminService) {

    var vm = this;
    vm.position = {
      name: null,
    };
    
    vm.save = () => {
      if (!vm.position.name) {
        const alert = $mdDialog.alert({
          title: 'Attention',
          textContent: 'Please complete each form field',
          ok: 'Close'
        });
        $mdDialog.show(alert);
      } else {
        const confirm = $mdDialog.confirm()
          .title('Add Position')
          .textContent('Are you sure you want add new Position?')
          .ariaLabel('Add Position')
          .cancel('Cancel')
          .ok('Add');
        $mdDialog.show(confirm).then(function() {
          adminService.addPosition(vm.position)
          .then(({ data }) => {
            $log.log(data);
            const success = $mdDialog.alert({
              title: 'New Position',
              textContent: 'New position was added',
              ok: 'Close'
            });
            $mdDialog.show(success);
          },
          (err) => {
            $log.log(err);
            const error = $mdDialog.alert({
              title: 'New Position',
              textContent: 'New position was not added. Try again.',
              ok: 'Close'
            });
            $mdDialog.show(error);
          });
        });
      }
    }
});
