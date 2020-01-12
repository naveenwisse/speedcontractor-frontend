angular.module('controller.calendar', [])
.controller('CalendarController', function($mdDialog, $moment, userService, $user) {
    var vm = this;

    vm.events = [];

    vm.successAlert = false;
    vm.successAlertText = '';

    //These variables MUST be set as a minimum for the calendar to work
    vm.calendarView = 'month';
    vm.calendarDay = new Date();

    function successResponse(res) {
        var key;
        for (key in res.data.events) {
            res.data.events[key].startsAt = new Date(res.data.events[key].startTime);
            res.data.events[key].endsAt = new Date(res.data.events[key].endTime);
        }
        vm.events = res.data.events;
    }

    if ($user._id === $user.persona._id) {
        userService.getUserCalendar().then(successResponse);
    } else {
        userService.getBusinessCalendar({
            businessId: $user.persona._id
        }).then(successResponse);
    }

    function showModal(event) {
        $mdDialog.show({
            templateUrl: 'dialogs/event.tmpl.html',
            controller: ['$mdDialog', function($mdDialog) {
                this.event = event;
                this.cancel = function() {
                    $mdDialog.cancel();
                };
            }],
            controllerAs: 'dialog',
            parent: angular.element(document.body)
        });
    }

    vm.eventClicked = function(event) {
        showModal(event);
    };

    vm.eventEdited = function(event) {
        showModal('Edited', event);
    };

    vm.eventDeleted = function(event) {
        showModal('Deleted', event);
    };

    vm.eventTimesChanged = function(event) {
        showModal('Dropped or resized', event);
    };

    vm.toggle = function($event, field, event) {
        $event.preventDefault();
        $event.stopPropagation();
        event[field] = !event[field];
    };

});
