angular.module('controller.positions-admin', [])
.controller('PositionsAdminController', function($scope, $log, adminService) {

    var vm = this;
    vm.positions = [];

    function init() {
      adminService.getAllPositions(vm.filter)
      .then(({ data }) => {
        vm.positions = data.positions;
      },
      (err) => {
        $log.log(err);
      });
    }

    // Controller Init Operations
    // Get all positions to list
    init();

    vm.switch = (position) => {
      $log.log(position);
      const info = {
        id: position._id,
        status: position.status,
      };
      adminService.switchStatus(info)
      .then(({ data }) => {
        $log.log(data);
        position.status = data.position.status;
      },
      (err) => {
        $log.log(err);
      });
    }
});
