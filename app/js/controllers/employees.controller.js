angular.module('controller.employees', [])
    .controller('EmployeesController', function($scope, $rootScope, $stateParams, businessService, $mdDialog) {
        $scope.remove = function(ev, employee) {
            var confirm = $mdDialog.confirm()
                .title('Are you sure you want to remove ' + employee.user.name + '?')
                .textContent('Removing this employee cannot be undone. Please proceed with caution!')
                .ariaLabel('Remove employee')
                .targetEvent(ev)
                .cancel('Cancel')
                .ok('Remove');
            $mdDialog.show(confirm).then(function() {
                var data = {
                    businessId: $stateParams.id,
                    employeeId: employee._id
                };
                businessService.declineEmployee(data).then(
                    function() {
                        $rootScope.$emit('business.reload-profile');
                    });
            });
        };
    });
