angular.module('controller.dialog.apply-tasting', [])
.controller('DialogApplyTastingController', function($scope, $mdDialog, conflict, tasting, userInfo, userService, toastService, $log) {

    $scope.conflict = angular.copy(conflict);
    $scope.tasting = angular.copy(tasting);
    $scope.resource = $scope.tasting;
    $scope.userInfo = angular.copy(userInfo);
    $scope.conflictingResources = [];
    $log.log($scope.tasting);
    var endTime = $scope.tasting.endTime,
        startTime = $scope.tasting.startTime,
        i = 0,
        start,
        end;

    for (; i < $scope.conflict.length; i++) {
        if (!$scope.conflict[i].accepted) {
            // (StartA <= EndB)  and  (EndA >= StartB)
            start = moment($scope.conflict[i].startTime);
            end = moment($scope.conflict[i].endTime);
            if ($scope.tasting._id !== $scope.conflict[i]._id &&
                ($scope.conflict[i].startTime && (start.isSame(endTime) || start.isBefore(endTime)) && (end.isSame(startTime) || end.isAfter(startTime)))) {
                // conflict = true;
                if ($scope.conflict[i].type == 'Tasting') {
                    $scope.conflictingResources.push($scope.conflict[i].tastings[0]);
                } else{
                    $scope.conflictingResources.push($scope.conflict[i].resources[0]);
                }
            }
        }
    }

    $scope.accept = function() {
       var attendData = {
            tastingId: tasting._id
        };
        userService.attendTasting(attendData).then(res => {
            $mdDialog.hide();
            toastService.showToast(res.data.message, "success", 2000);
        }).catch(err => {
            $mdDialog.cancel();
            toastService.showToast(err.data.message, "success", 2000);
        });
    };

    $scope.decline = function() {
        var data = {
            resourceId: $scope.tasting._id
        };
        userService.declineResource(data).then(
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
