angular.module('controller.opportunity', [])
.controller('OpportunityController', function($stateParams) {
    var vm = this;
    vm.index = $stateParams.opportunityIndex;
    vm.page = 1;
    vm.items = [];
    vm.fetching = false;
    vm.disabled = false;
    vm.getMore = function() { };
});
