angular.module('controller.businesses-admin', [])
.controller('BusinessesAdminController', function($scope, $log, adminService, reasonsSuspendService) {

    var vm = this;
    vm.filter = {
      containString: '',
      limit: 10,
      page: 0
    };
    vm.count = 0;
    vm.businesses = [];

    function updateList() {
      vm.filter.page = vm.filter.page -1;
      adminService.getBusinesses(vm.filter)
      .then(({ data }) => {
        $log.log(data.count);
        vm.count = data.count;
        vm.businesses = data.businesses;
      },
      (err) => {
        $log.log(err);
      });
    }

    // Controller Init Operations
    // Get all users to list
    updateList();

    vm.changePage = (page) => {
      vm.filter.page = page;
      updateList();
    }

 

    vm.suspendBusinessesClick = (businessesId, status) => {
      const info = {
        businessesId,
        suspend: status === 'active' ? true : false
      };
      if (info.suspend) {
        reasonsSuspendService.openReasonsSuspendModal()
        .then((reasons) => {
          info.reasons = reasons;
          mySuspend(info, businessesId);
        })
        .catch(() => {
          $log.log('Canceled');
        });
      } else {
        mySuspend(info, businessesId);
      }
    }

    function mySuspend(info, businessesId) {
      adminService.suspendBusinesses(info)
      .then(({ data }) => {
        $log.log(data);
        if (data.success) {
          // update businesses list
          let i = vm.businesses.length - 1
          for (; i >= 0; i--) {
            if (vm.businesses[i]._id === businessesId) {
              vm.businesses[i].status = data.status;
              $log.log(vm.businesses[i]);
              break;
            }
          }
        }
      },
      (err) => {
        $log.log(err);
      });
    }
});
