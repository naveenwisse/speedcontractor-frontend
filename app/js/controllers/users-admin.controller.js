angular.module('controller.users-admin', [])
.controller('UsersAdminController', function($scope, $log, adminService, reasonsSuspendService) {

    var vm = this;
    vm.filter = {
      containString: '',
      limit: 10,
      page: 0
    };
    vm.count = 0;
    vm.users = [];

    function updateList() {
      vm.filter.page = vm.filter.page -1;
      adminService.getAllUsers(vm.filter)
      .then(({ data }) => {
        vm.count = data.count;
        vm.users = data.users;
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

    vm.suspend = (userId, status) => {
      const info = {
        userId,
        suspend: status === 'active' ? true : false
      };
      if (info.suspend) {
        reasonsSuspendService.openReasonsSuspendModal()
        .then((reasons) => {
          info.reasons = reasons;
          mySuspend(info, userId);
        })
        .catch(() => {
          $log.log('Canceled');
        });
      } else {
        mySuspend(info, userId);
      }
    }

    function mySuspend(info, userId) {
      adminService.suspend(info)
      .then(({ data }) => {
        $log.log(data);
        if (data.success) {
          // update user list
          let i = vm.users.length - 1
          for (; i >= 0; i--) {
            if (vm.users[i]._id === userId) {
              vm.users[i].status = data.status;
              $log.log(vm.users[i]);
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
