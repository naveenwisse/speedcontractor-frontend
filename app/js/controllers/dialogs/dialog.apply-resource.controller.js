angular.module('controller.dialog.apply-resource', [])
.controller('DialogApplyResourceController', function($scope, $mdDialog, conflict, resource, userInfo, userService, toastService, stripeRequireService) {

    $scope.conflict = angular.copy(conflict);
    $scope.resource = angular.copy(resource);
    $scope.userInfo = angular.copy(userInfo);
    $scope.conflictingResources = [];
    var endTime = $scope.resource.endTime,
        startTime = $scope.resource.startTime,
        i = 0,
        start,
        end;

    for (; i < $scope.conflict.length; i++) {
        if (!$scope.conflict[i].accepted) {
            // (StartA <= EndB)  and  (EndA >= StartB)
            start = moment($scope.conflict[i].startTime);
            end = moment($scope.conflict[i].endTime);
            if ($scope.resource._id !== $scope.conflict[i]._id &&
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
        var applyData = {
            resourceId: resource._id
        };
        stripeRequireService.stripeAccountRequired($scope.user)
        .then(apply);

        function apply() {
           return userService.applyResource(applyData).then(
            function(res) {
                $mdDialog.cancel();
                toastService.showToast(res.data.message, "success", 2000);
            },
            function(err) {
                $mdDialog.cancel();
                toastService.showToast(err.data.message, "success", 2000);
            });
        }
    };

    $scope.decline = function() {
        var data = {
            resourceId: $scope.resource._id
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
