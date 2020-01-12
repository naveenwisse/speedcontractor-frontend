angular.module('controller.dialog.accept-job', [])
.controller('DialogAcceptJobController', function($scope, $mdDialog, $log, pendingResources, conflict, resource, userInfo, userService, toastService, stripeRequireService) {
    $scope.pendingResources = angular.copy(pendingResources);
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
        if (start) {
            var sameDay = moment(startTime).isSame(end,'day'); // evaluar si los eventos son el mismo día
            if(sameDay){
                var duration = moment.duration(start.diff($scope.resource.endTime));
                var durationEnd = moment.duration(end.diff($scope.resource.startTime));
                if ($scope.resource._id !== $scope.conflict[i]._id &&
                    (duration.asHours()>0 && duration.asHours() <=3 || durationEnd.asHours()>0 && durationEnd.asHours() <=3)) {
                    //mostrar el cartel que hay 3 horas entre los eventos
                    $scope.showText = true;
                }
            }
        }
    }

    $scope.accept = function() {
        var data = {
            resourceId: $scope.resource._id
        };
        stripeRequireService.stripeAccountRequired($scope.userInfo)
        .then(acceptResource);

        function acceptResource() {
            userService.acceptResource(data).then(
                function() {
                    $mdDialog.hide();
                }).catch((err) => {
                    toastService.showToast(err.data.message, "success", 5000);
                    $mdDialog.hide();
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
