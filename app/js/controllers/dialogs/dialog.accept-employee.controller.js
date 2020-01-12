angular.module('controller.dialog.accept-employee', [])
.controller('DialogAcceptEmployeeController', function($scope, $mdDialog, employee, businessInfo, businessService) {

    $scope.employee = angular.copy(employee);
    $scope.businessInfo = angular.copy(businessInfo);

    $scope.accept = function() {
        var data = {
            businessId: businessInfo._id,
            employeeId: employee._id,
            userId: employee.user._id
        };
        businessService.acceptEmployee(data).then(
            function() {
                employee.pending = false;
                $mdDialog.hide();
            });
    };

    $scope.decline = function() {
        var data = {
            businessId: businessInfo._id,
            employeeId: employee._id
        };
        businessService.declineEmployee(data).then(
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
