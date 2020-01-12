angular.module('controller.dialog.add-competing-employees', [])
    .controller('DialogAddCompetingEmployeesController', function(
        $scope,
        $rootScope,
        $mdDialog,
        $log,
        businessService,
        competitorInfo,
        competitionInfo,
        competitorIndex,
        miniDialogService
    ) {

        $scope.employees = angular.copy(competitorInfo.business.employees);
        $scope.selectedEmployees = angular.copy(competitorInfo.competingEmployees);
        $scope.emails = '';

        if ($scope.selectedEmployees.length) {
            for (var i = 0; i < $scope.selectedEmployees.length; i++) {
                var index = $scope.employees.findIndex(function(employee) {
                    return $scope.selectedEmployees[i].user._id === employee.user._id;
                });
                if (index >= 0){
                    $scope.employees[index].selected = true;
                }
                else{
                    $log.log('The selected employee is not more in company employees ');
                    /* HOT FIX */
                    // TODO: this should be fixed. This case means that an user is in selectedEmployes,
                    // but is not more employee of the company. So each time that a employee is removed
                    // from the company, we will need to check if that user is in a competition as SelectedUser
                    // and remove from that array.
                }
            }
        }

        $scope.selectEmployee = function(employee) {
            if (employee.selected) {
                employee.selected = false;
                var index = $scope.selectedEmployees.findIndex(function(obj) {
                    return employee._id === obj._id;
                });
                $scope.selectedEmployees.splice(index, 1);
            } else {
                employee.selected = true;
                $scope.selectedEmployees.push(employee);
            }
        };

        $scope.removeIndex = function(index, id, user) {
            if ($scope.selectedEmployees[index].score) {
                miniDialogService.showDialog('This user has a score that will be lost if you remove them. Would you like to proceed?').then(function(confirmed) {
                    if (confirmed) {
                        var employeeIndex = $scope.employees.findIndex(function(obj) {
                            return id === obj._id || user.user._id === obj.user._id;
                        });
                        $scope.employees[employeeIndex].selected = false;
                        $scope.selectedEmployees.splice(index, 1);
                    }
                });
            } else {
                var employeeIndex = $scope.employees.findIndex(function(obj) {
                    return id === obj._id || user.user._id === obj.user._id;
                });
                $scope.employees[employeeIndex].selected = false;
                $scope.selectedEmployees.splice(index, 1);
            }
        };

        $scope.submit = function(form) {
            if (form.$valid) {
                $mdDialog.cancel();
                var emails = $scope.emails.replace(';', ',').split(',').map((item) => {
                    return item.trim();
                });
                var data = {
                    businessId: competitorInfo.business._id,
                    competitorId: competitorInfo._id,
                    competitionId: competitionInfo._id,
                    competingEmployees: $scope.selectedEmployees.map(function(employee) {
                        if (!employee.score) {
                            employee.business = competitorInfo.business._id;
                        }
                        return employee;
                    }),
                    invitations: emails
                };
                businessService.addCompetingEmployees(data).then(
                    function() {
                        competitionInfo.competitors[competitorIndex].competingEmployees = data.competingEmployees.map(function(employee) {
                            if (!employee.score) {
                                employee.score = 0;
                            }
                            return employee;
                        });
                        $rootScope.$emit('business.reload-profile');
                    });
            }
        };

        $scope.cancel = function() {
            $mdDialog.cancel();
        };
    });
