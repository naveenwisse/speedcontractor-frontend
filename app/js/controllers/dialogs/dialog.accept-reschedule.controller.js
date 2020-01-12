angular.module('controller.dialog.accept-reschedule', [])
.controller('DialogAcceptRescheduleController', function($scope, $mdDialog, tasting, businessInfo, businessService) {

    $scope.tasting = angular.copy(tasting);
    $scope.businessInfo = angular.copy(businessInfo);


    $scope.accept = function() {
        var data = {
            businessId: $scope.businessInfo._id,
            tastingId: $scope.tasting._id,
            newTime: $scope.acceptRescheduleFormData.newTime
        };
        businessService.acceptReschedule(data).then(
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
