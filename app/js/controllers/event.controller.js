angular.module('controller.event', [])
.controller('EventController', function(
    $scope,
    $rootScope,
    $log,
    $state,
    $stateParams,
    $mdDialog,
    userService,
    businessService
) {
    var vm = this;
    vm.eventId = $stateParams.eventId;
    vm.event = {};

    var eventData = {
        _id: vm.eventId
    };

    userService.getEvent(eventData).then(
        function(res) {
            vm.event = res.data.event;
        },
        function(err) {
            $log.log(err.data.message);
        });

    vm.deleteEvent = function(ev) {
        var confirm = $mdDialog.confirm()
            .title('Are you sure you want to cancel ' + vm.event.title + '?')
            .textContent('Cancellation of this event cannot be undone. All users filling a position will be notified of the cancellation. Please proceed with caution!')
            .ariaLabel('Cancel Event')
            .targetEvent(ev)
            .ok('Cancel Event')
            .cancel('Go Back');
        $mdDialog.show(confirm).then(function() {
            var resources = vm.event.resources.map(function(obj) {
                    var rObj = {
                        _id: obj._id
                    };
                    if (obj.filled) {
                        rObj.filled = obj.filled._id;
                    }
                    return rObj;
                }),
                eventData = {
                    eventId: vm.event._id,
                    businessId: vm.event.business._id,
                    resources: resources,
                    startDate: vm.event.startsAt
                };
            businessService.deleteEvent(eventData).then(
                function() {
                    $state.go('business.main');
                    $rootScope.$emit('business.reload-profile');
                },
                function(err) {
                    $log.log(err);
                });
        });
    };

    vm.openAddResources = function(ev) {
        $mdDialog.show({
            templateUrl: 'dialogs/add-resources.tmpl.html',
            controller: 'DialogAddResourcesController',
            parent: angular.element(document.body),
            targetEvent: ev,
            locals: {
                eventInfo: vm.event
            }
        });
    };

    vm.openEditEvent = function(ev) {
        $mdDialog.show({
            templateUrl: 'dialogs/edit-event.tmpl.html',
            controller: 'DialogEditEventController',
            parent: angular.element(document.body),
            targetEvent: ev,
            locals: {
                businessInfo: $scope.user,
                eventInfo: vm.event
            }
        });
    };

});
