angular.module('controller.jobs-coord', [])
.controller('JobsCoordController', function($stateParams, businessService, $log, $user, $mdDialog, $state) {
    var vm = this;
    vm.lat = $stateParams.lat;
    vm.long = $stateParams.long;
    $log.log(vm.lat, vm.long);
    vm.disableButton = false;

    function init() {
      const coords = {
        lat: vm.lat,
        long: vm.long,
      };
      businessService.getAllByCoords(coords)
      .then(({data}) => {
        // vm.all = data.jobs;
        vm.all = null;
        vm.massHire = getMassHire(data.jobs);
        $log.log('vm.massHire');
        $log.log(vm.massHire);
        vm.location = data.jobs[0].formattedAddress;
        vm.business = data.jobs[0].business;
      })
      .catch(err => {
        $log.log(err);
      })
    }

    init();

    function getMassHire(jobs) {
      const list = { };
      jobs.forEach((job) => {
        if (!list[job.massHireResource._id + job.group]) list[job.massHireResource._id + job.group] = [];
        list[job.massHireResource._id + job.group].push(job);
      });
      return Object.values(list);
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
        init();
      })
      .catch((err) => {
        vm.disableButton = false;
        const error = $mdDialog.alert({
          title: 'Request Invitation',
          textContent: err.data.message,
          ok: 'Close'
        });
        $mdDialog.show(error);
      });
    }

    vm.requestSent = function(list) {
      let result = false;
      for (let i = list.length - 1; i >= 0; i--) {
        if (list[i].invitationRequest.indexOf($user._id) >= 0)
          result = true;
      }
      return result;
    }

    vm.goToProfile = function(business) {
      $state.go('business.main', {
        id: business._id,
        name: business.name
      });
    }
});
