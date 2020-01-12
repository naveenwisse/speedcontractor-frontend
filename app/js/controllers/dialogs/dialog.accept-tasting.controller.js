angular.module('controller.dialog.accept-tasting', [])
.controller('DialogAcceptTastingController', function($scope, $mdDialog, pendingTastings, tasting, businessInfo, businessService) {
    $scope.pendingTastings = angular.copy(pendingTastings);
    $scope.tasting = angular.copy(tasting);
    $scope.businessInfo = angular.copy(businessInfo);
    $scope.conflictingTastings = [];
    $scope.showReschedule = false;
    $scope.reschedulText = 'Reschedule';
    $scope.reschedulePending = tasting.reschedule.length > 0;
    var endTime = $scope.tasting.endTime,
        startTime = $scope.tasting.startTime,
        i = 0,
        start,
        end,
        now = new Date(),
        defaultForm = {
            startTime: new Date(
                now.getFullYear(),
                now.getMonth(),
                now.getDate() + 1,
                now.getHours()),
            endTime: new Date(
                now.getFullYear(),
                now.getMonth(),
                now.getDate() + 1,
                now.getHours() + 1)
        };
    $scope.minDate = new Date(
        now.getFullYear(),
        now.getMonth(),
        now.getDate() + 1);
    $scope.rescheduleFormData = angular.copy(defaultForm);
    $scope.rescheduleTimes = [];

    for (; i < $scope.pendingTastings.length; i++) {
        // (StartA <= EndB)  and  (EndA >= StartB)
        start = moment($scope.pendingTastings[i].startTime);
        end = moment($scope.pendingTastings[i].endTime);
        if ($scope.tasting._id !== $scope.pendingTastings[i]._id &&
            ((start.isSame(endTime) || start.isBefore(endTime)) && (end.isSame(startTime) || end.isAfter(startTime)))) {
            // conflict = true;
            $scope.conflictingTastings.push($scope.pendingTastings[i]);
        }
    }

    $scope.removeTime = function(index) {
        $scope.rescheduleTimes.splice(index, 1);
    };

    $scope.resetReschedule = function() {
        $scope.rescheduleFormData.startTime = angular.copy(defaultForm.startTime);
        $scope.rescheduleFormData.endTime = angular.copy(defaultForm.endTime);
    };

    $scope.addReschedule = function() {
        $scope.rescheduleTimes.push(angular.copy($scope.rescheduleFormData));
        $scope.resetReschedule();
    };

    $scope.toggleReschedule = function() {
        $scope.showReschedule = !$scope.showReschedule;
        $scope.reschedulText = $scope.showReschedule ? 'Hide Reschedule' : 'Reschedule';
    };

    $scope.reschedule = function() {
        var data = {
            businessId: $scope.tasting.businessVenue,
            tastingId: $scope.tasting._id,
            times: $scope.rescheduleTimes,
            rescheduleText: $scope.rescheduleFormData.rescheduleText
        };
        businessService.rescheduleTasting(data).then(
            function() {
                businessInfo.pendingTastings = pendingTastings.filter(function(obj) {
                    return obj._id !== $scope.tasting._id;
                });
                $mdDialog.hide();
            });
    };

    $scope.accept = function() {
        var conflicting = $scope.conflictingTastings.map(function(obj) {
                return obj._id;
            }),
            data = {
                tastingId: $scope.tasting._id,
                conflictingTastings: conflicting
            };
        businessService.acceptTasting(data).then(
            function() {
                $mdDialog.hide();
            });
    };

    $scope.decline = function() {
        var data = {
            tastingId: $scope.tasting._id
        };
        businessService.declineTasting(data).then(
            function() {
                $mdDialog.hide();
            });
    };

    $scope.hide = function() {
        $mdDialog.hide();
    };

    $scope.cancel = function() {
        $mdDialog.cancel();
    };

});
