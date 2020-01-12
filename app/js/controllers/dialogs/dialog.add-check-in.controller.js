angular.module('controller.dialog.add-check-in', [])
    .controller('DialogAddCheckInController', function(
        $scope,
        $mdDialog,
        $log,
        businessService,
        toastService,
        eventData,
        getTasting
    ) {
        $scope.users = angular.copy(eventData.users);
        $scope.selectedUsers = angular.copy(eventData.checkedIn);
        if ($scope.users.length) {
            for (var i = 0; i < $scope.selectedUsers.length; i++) {
                var index = $scope.users.findIndex(function(taster) {
                    return $scope.selectedUsers[i]._id === taster._id;
                });
                $scope.users[index].selected = false;
                if (index >= 0) {
                    $scope.users[index].check = true;
                } else {
                    $scope.users[index].check = false;
                }
            }
        }

        $scope.selectTaster = function(taster) {
            if (taster.selected) {
                taster.selected = false;
            } else {
                taster.selected = true;
            }
        };


        $scope.submit = function(ev, form) {
            var checkInsNames = $scope.users.map(function(taster) {
                if (taster.selected) {
                    return taster.name;
                }
                return '';
            }).filter(function(fil) {
                if (fil !== '') {
                    return fil;
                }
            });
            if (form.$valid && checkInsNames.length > 0) {
                var data = {
                    checkIns: $scope.users.map(function(taster) {
                        if (taster.selected) {
                            return taster._id;
                        }
                        return '';
                    }).filter(function(fil) {
                        if (fil !== '') {
                            return fil;
                        }
                    }),
                    code: eventData.code,
                    tastingId: eventData._id
                };
                var html = 'The selected users are the following, please confirm your selection to proceed to check-in: <br>';
                var i = checkInsNames.length - 1;
                for (; i >= 0; i--) {
                    html += checkInsNames[i] + '<br>';
                }
                var confirm = $mdDialog.confirm()
                    .title('Confirm your selection')
                    .htmlContent(html)
                    .ariaLabel('Cancel Check-in')
                    .targetEvent(ev)
                    .ok('Check-in')
                    .cancel('Cancel')
                    .multiple(true);
                $mdDialog.show(confirm).then(function() {
                    businessService.addCheckIns(data)
                    .then((result) => {
                        toastService.showToast(result.data.message, "success", 5000);
                        getTasting()
                        $mdDialog.cancel();
                    }).catch((err) => {
                        toastService.showToast(err.data.message, "error", 5000);
                        $mdDialog.cancel();
                    });
                });
            }
        };

        $scope.cancel = function() {
            $mdDialog.cancel();
        };
    });
