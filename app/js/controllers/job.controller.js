angular.module('controller.job', [])
.controller('JobController', function($stateParams, businessService, $log, $user, $mdDialog, $state) {
    var vm = this;
    vm.massHireId = $stateParams.massHireId;
    vm.group = $stateParams.group;
    $log.log(vm.massHireId);
    $log.log(vm.group);
    vm.disableButton = false;
    vm.resource = null;

    function init() {
      businessService.getJobById(vm.massHireId, vm.group)
      .then(({data}) => {
        $log.log('data', data);
        vm.resources = data.resource;
        vm.resource = data.resource[0];
        vm.invitations = getInvitationRequest();
      })
      .catch(err => {
        $log.log(err);
      })
    }

    init();

    function getInvitationRequest() {
      const invitations = [];
      vm.resources.forEach((res) => {
        res.invitationRequest.forEach((inv) => {
          invitations.push(inv);
        })
      })
      return invitations;
    }

    vm.requestJobInvitation = function(jobId) {
      vm.disableButton = true;
      businessService.requestJobInvitation(jobId, $user._id)
      .then(({data}) => {
        $log.log(data);
        vm.disableButton = false;
        const success = $mdDialog.alert({
          title: 'You have successfully applied for this position',
          ok: 'Close'
        });
        $mdDialog.show(success);
      })
      .catch((err) => {
        $log.log('err2');
        $log.log(err);
        vm.disableButton = false;
        const error = $mdDialog.alert({
          title: 'Request Invitation',
          textContent: err.data.message,
          ok: 'Close'
        });
        $mdDialog.show(error);
      })
    }

    vm.goToProfile = function(user) {
      $state.go('profilePubic', {
        id: user.id,
        name: user.name
      });
    }

    vm.sendInvitation = function(user) {
      businessService.sendInvitationJob(user, vm.resource)
      .then(({data}) => {
        $log.log(data);
        init();
      })
      .catch((err) => {
        $log.log(err);
      })
    }

    vm.isSent = function(req) {
      $log.log("vm.resource", vm.resource);
      $log.log("req", req);
      return vm.resource.invitedUsers.indexOf(req._id) >= 0;
    }
});
