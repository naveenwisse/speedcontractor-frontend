angular.module('controller.dialog.add-resources', [])
.controller('DialogAddResourcesController', function(
    $scope,
    $rootScope,
    $mdDialog,
    $log,
    jobService,
    $filter,
    businessService,
    eventInfo,
    miniDialogService
) {
    $scope.eventInfo = angular.copy(eventInfo);
    $scope.startsAt = new Date($scope.eventInfo.startsAt);
    $scope.endsAt = new Date($scope.eventInfo.endsAt);
    $scope.selectedResources = [];
    $scope.minDate = new Date(
        $scope.startsAt.getFullYear(),
        $scope.startsAt.getMonth(),
        $scope.startsAt.getDate());
    $scope.maxDate = new Date(
        $scope.endsAt.getFullYear(),
        $scope.endsAt.getMonth(),
        $scope.endsAt.getDate(),
        $scope.endsAt.getHours() + 1);

    $scope.addResourceFormData = {
        title: '',
        startTime: new Date($scope.eventInfo.startsAt),
        endTime: new Date($scope.eventInfo.endsAt)
    };
    $scope.search = {};
    $scope.addUpdate = true;
    $scope.fillResourceFormData = {};
    $scope.resources = $scope.eventInfo.resources || [];
    $scope.selectedIndex = 0;
    $scope.resourcesCreated = false;

    $scope.selectedResource = -1;
    $scope.users = [];
    $scope.usersList = [];
    $scope.appliedUsers = [];

    $scope.rate = 5.0;
    $scope.fee = 3.35;

    $scope.$watch('addResourceFormData.startTime', function(newValue) {
        $scope.hours = businessService.getBillableHours(newValue, $scope.addResourceFormData.endTime);
    }, true);

    $scope.$watch('addResourceFormData.endTime', function(newValue) {
        $scope.hours = businessService.getBillableHours($scope.addResourceFormData.startTime, newValue);
    }, true);

    jobService.getJobTypes().then(
        function(res) {
            $scope.types = res.data.jobTypes
        },
        function(err) {
            $log.error(err);
        });

    $scope.$watch('selectedResource', _watchSelected);

    function _watchSelected() {
        if ($scope.users.length && $scope.resources.length) {
            $scope.usersList = [];
            $scope.appliedUsers = [];
            if ($scope.resources[$scope.selectedResource]) {
                $scope.users.forEach(function(user) {
                    _filterUser(user);
                });
                if (!$scope.resources[$scope.selectedResource].invitedUsers)
                    $scope.resources[$scope.selectedResource].invitedUsers = [];
            }
            $scope.usersList.forEach(function(user, index) {
                if ($scope.selectedResource >= 0) {
                    $scope.resources[$scope.selectedResource].users.forEach(function(appliedUser) {
                        if (user._id === appliedUser._id) {
                            $scope.usersList.splice(index, 1);
                            if (user.positions){
                                user.positions.forEach(function(position) {
                                    if ($scope.resources[$scope.selectedResource].title === position.title) {
                                        $scope.appliedUsers.push(user);
                                    }
                                });
                            } else {
                                $log.log("this user has not positions: ", user);
                            }
                        }
                    });
                }
            });
        }
    }

    function _filterUser(user) {
        
        var endTime = $scope.resources[$scope.selectedResource].endTime,
            startTime = $scope.resources[$scope.selectedResource].startTime,
            conflict = false,
            i = 0,
            start,
            end;

        // check if the the user has comflicting jobs already
        user.resources.forEach(function(resource) {
            for(var j = resource.users.length-1; j>=0; j--)
            {
                // if this resource is accepted,  check conflict
                if(resource.users[j]._ui === user._id)
                {
                    // (StartA <= EndB)  and  (EndA >= StartB)
                    start = moment(resource.startTime);
                    end = moment(resource.endTime);
                    if ((start.isSame(endTime) || start.isBefore(endTime)) && (end.isSame(startTime) || end.isAfter(startTime))) {
                        // check if the user is Invited. If so, so its not a conflict
                        // let isInvited = false;
                        // const resourceInvitedUsers = $scope.resources[$scope.selectedResource].invitedUsers || [];
                        // for (var i = resourceInvitedUsers.length - 1; i >= 0; i--) {
                        //     const iu = resourceInvitedUsers[i];
                        //     if (iu._id === user._id){
                        //         isInvited = true;
                        //         break;
                        //     }
                        // }
                        conflict = true;
                    }
                }
            }
        });
        // // check if the user has already been fille for a conflicting resource in this event
        // $scope.resources.forEach(function(resource) {
        //     // (StartA <= EndB)  and  (EndA >= StartB)
        //     start = moment(resource.startTime);
        //     end = moment(resource.endTime);
        //     if (JSON.stringify(resource) !== JSON.stringify($scope.resources[$scope.selectedResource]) &&
        //         resource.filled && resource.filled._id) {
        //         if (user._id === resource.filled._id &&
        //             ((start.isSame(endTime) || start.isBefore(endTime)) && (end.isSame(startTime) || end.isAfter(startTime)))) {
        //             conflict = true;
        //         }
        //     }
        // });
        if (!conflict) {
            for (; i < user.positions.length; i++) {
                    if ($scope.resources[$scope.selectedResource].title === user.positions[i].title) {
                        $scope.usersList.push(user);
                        break;
                    }
            }
        }
        
        // var i = 0;
        // for (; i < user.positions.length; i++) {
        //     if ($scope.resources[$scope.selectedResource].title === user.positions[i].title) {
        //         $scope.usersList.push(user);
        //         break;
        //     }
        // }
    }

    $scope.$watch('addResourceFormData.startTime', function(newValue) {
        var newDate = moment(newValue);
        if (newDate.isBefore($scope.startsAt) || newDate.isAfter($scope.endsAt)) {
            $scope.addResourceForm.startTime.$setValidity("range", false);
            // $scope.addResourceForm.startDate.$setValidity("range", false);
        } else if (newDate.isAfter($scope.addResourceFormData.endTime)) {
            $scope.addResourceForm.startTime.$setValidity("after", false);
            // $scope.addResourceForm.startDate.$setValidity("after", false);
        } else {
            if ($scope.addResourceForm) {
                // Set Time input
                $scope.addResourceForm.startTime.$setValidity("after", true);
                $scope.addResourceForm.startTime.$setValidity("range", true);
                // Set Date input
                // $scope.addResourceForm.startDate.$setValidity("after", true);
                // $scope.addResourceForm.startDate.$setValidity("range", true);
                // Set opposing input
                $scope.addResourceForm.endTime.$setValidity("before", true);
                // $scope.addResourceForm.endDate.$setValidity("before", true);
            }
        }
    }, true);

    $scope.$watch('addResourceFormData.endTime', function(newValue) {
        var newDate = moment(newValue);
        if (newDate.isAfter($scope.endsAt) || newDate.isBefore($scope.startsAt)) {
            $scope.addResourceForm.endTime.$setValidity("range", false);
            // $scope.addResourceForm.endDate.$setValidity("range", false);
        } else if (newDate.isBefore($scope.addResourceFormData.startTime)) {
            $scope.addResourceForm.endTime.$setValidity("before", false);
            // $scope.addResourceForm.endDate.$setValidity("before", false);
        } else {
            if ($scope.addResourceForm) {
                // Set Time input
                $scope.addResourceForm.endTime.$setValidity("before", true);
                $scope.addResourceForm.endTime.$setValidity("range", true);
                // Set Date input
                // $scope.addResourceForm.endDate.$setValidity("before", true);
                // $scope.addResourceForm.endDate.$setValidity("range", true);
                // Set opposing input
                $scope.addResourceForm.startTime.$setValidity("after", true);
                // $scope.addResourceForm.startDate.$setValidity("after", true);
            }
        }
    }, true);
    businessService.getResourceUsers({
        lat: $scope.eventInfo.loc.coordinates[1],
        lon: $scope.eventInfo.loc.coordinates[0],
        startsAt: $scope.startsAt,
        endsAt: $scope.endsAt,

    }).then(
        function(res) {
            $scope.users = res.data.users;
        });

    $scope.next = function() {
        if ($scope.resources.length) {
            $scope.resourcesCreated = true;
            if (!(!$scope.resources[0].unfilled && $scope.eventInfo.cutOff) || !$scope.resources[0].accepted) {
                $scope.resources[0].selected = true;
                $scope.selectedResource = 0;
                if ($scope.resources[0].filled) {
                    $scope.search.name = $scope.resources[0].filled.name;
                }
            }
            $scope.resetResourceForm();
            $scope.selectedIndex = 1;
        }
    };

    $scope.back = function() {
        $scope.resourcesCreated = false;
        $scope.selectedIndex = 0;
        $scope.resetResourceForm();
    };

    $scope.addResource = function() {
        if ($scope.addResourceForm.$valid) {
            $scope.addResourceFormData.compensation = ($scope.rate * $scope.hours) + $scope.fee;
            $scope.addResourceFormData.type = $scope.addResourceFormData.title + ' ' + $filter('date')($scope.addResourceFormData.startTime, 'h:mm a') + ' to ' + $filter('date')($scope.addResourceFormData.endTime, 'h:mm a');
            $scope.addResourceFormData.unfilled = true;
            $scope.addResourceFormData.changed = true;
            $scope.addResourceFormData.selected = false;
            $scope.addResourceFormData.event = $scope.eventInfo._id;
            $scope.addResourceFormData.business = $scope.eventInfo.business._id;
            $scope.addResourceFormData.formattedAddress = $scope.eventInfo.formattedAddress;
            $scope.addResourceFormData.loc = $scope.eventInfo.loc;
            $scope.addResourceFormData.users = [];
            $scope.resources.push($scope.addResourceFormData);
            $scope.resetResourceForm();
        }
    };

    $scope.updateResource = function() {
        if ($scope.addResourceForm.$valid) {
            var data = angular.copy($scope.addResourceFormData);
            if ($scope.resources[$scope.selectedResource].title !== data.title) {
                miniDialogService.showDialog('If you proceed, you will need to select a new user to fill the position.').then(function(confirmed) {
                    if (confirmed) {
                        $scope.addResourceFormData.compensation = ($scope.rate * $scope.hours) + $scope.fee;
                        $scope.resources[$scope.selectedResource].type = data.title + ' ' +
                            $filter('date')(data.startTime, 'h:mm a') + ' to ' +
                            $filter('date')(data.endTime, 'h:mm a');
                        $scope.resources[$scope.selectedResource].filled = null;
                        $scope.resources[$scope.selectedResource].unfilled = true;
                        $scope.resources[$scope.selectedResource].changed = true;
                        $scope.resources[$scope.selectedResource].title = data.title;
                        $scope.resources[$scope.selectedResource].compensation = data.compensation;
                        $scope.resources[$scope.selectedResource].startTime = data.startTime;
                        $scope.resources[$scope.selectedResource].endTime = data.endTime;
                        $scope.resources[$scope.selectedResource].busAttire = data.busAttire;
                        $scope.resources[$scope.selectedResource].attire = data.attire;
                        $scope.resources[$scope.selectedResource].additional = data.additional;
                        $scope.resetResourceForm();
                    }
                });
            } else {
                $scope.addResourceFormData.compensation = ($scope.rate * $scope.hours) + $scope.fee;
                $scope.resources[$scope.selectedResource].type = $scope.addResourceFormData.title + ' ' +
                    $filter('date')($scope.addResourceFormData.startTime, 'h:mm a') + ' to ' +
                    $filter('date')($scope.addResourceFormData.endTime, 'h:mm a');
                $scope.resources[$scope.selectedResource].title = data.title;
                $scope.resources[$scope.selectedResource].compensation = data.compensation;
                $scope.resources[$scope.selectedResource].startTime = data.startTime;
                $scope.resources[$scope.selectedResource].endTime = data.endTime;
                $scope.resources[$scope.selectedResource].busAttire = data.busAttire;
                $scope.resources[$scope.selectedResource].attire = data.attire;
                $scope.resources[$scope.selectedResource].additional = data.additional;
                $scope.resetResourceForm();
            }
        } else {
            // $scope.resourceForm.hasError = true;
        }
    };

    $scope.resetResourceForm = function() {
        $scope.$evalAsync(function() {
            if ($scope.selectedResource >= 0) $scope.resources[$scope.selectedResource].selected = false;
            $scope.selectedResource = -1;
            $scope.addResourceForm.$setPristine();
            $scope.addResourceForm.$setUntouched();
            $scope.addResourceFormData = {
                title: '',
                startTime: new Date($scope.startsAt),
                endTime: new Date($scope.endsAt)
            };
            $scope.addUpdate = true;
        });
    };

    $scope.duplicateResource = function(resource, ev) {
        ev.stopPropagation();
        var data = angular.copy(resource),
            newResource = {
                type: data.title + ' ' +
                    $filter('date')(data.startTime, 'h:mm a') + ' to ' +
                    $filter('date')(data.endTime, 'h:mm a'),
                filled: null,
                unfilled: true,
                title: data.title,
                compensation: data.compensation,
                startTime: data.startTime,
                endTime: data.endTime,
                busAttire: data.busAttire,
                attire: data.attire,
                additional: data.additional,
                event: $scope.eventInfo._id,
                business: $scope.eventInfo.business._id,
                formattedAddress: $scope.eventInfo.formattedAddress,
                loc: $scope.eventInfo.loc,
                users: []
            };
        $scope.resources.push(newResource);
    };

    $scope.removeResource = function(resource, ev) {
        ev.stopPropagation();
        var index = $scope.resources.indexOf(resource);
        $scope.$evalAsync(function() {
            if (index === $scope.selectedResource) {
                $scope.selectedResource = -1;
            }
            if ($scope.resources[index]._id) {
                if ($scope.resources[index].filled) {
                    miniDialogService.showDialog('If you proceed, the user filling this position will be notified of the deletion.').then(function(confirmed) {
                        if (confirmed) {
                            $scope.resources[index].delete = true;
                        }
                    });
                } else {
                    $scope.resources[index].delete = true;
                }
            } else {
                $scope.resources.splice(index, 1);
            }
        });
    };

    $scope.undoRemoveResource = function(resource, ev) {
        ev.stopPropagation();
        var index = $scope.resources.indexOf(resource);
        if (index === $scope.selectedResource) {
            $scope.selectedResource = -1;
        }
        $scope.resources[index].delete = false;
    };

    $scope.setAddSelected = function(resource) {
        var index = $scope.resources.indexOf(resource);
        if (!$scope.eventInfo.cutOff || !$scope.resources[index].accepted) {
            if (index === $scope.selectedResource) {
                $scope.resetResourceForm();
            } else {
                if ($scope.selectedResource >= 0) $scope.resources[$scope.selectedResource].selected = false;
                $scope.resources[index].selected = true;
                $scope.selectedResource = index;
                $scope.resources[index].startTime = new Date($scope.resources[index].startTime);
                $scope.resources[index].endTime = new Date($scope.resources[index].endTime);
                $scope.addResourceFormData = angular.copy($scope.resources[index]);
                $scope.addUpdate = false;
            }
        }
        $rootScope.firstWatch = false;
        $rootScope.secondWatch = false;
    };

    $scope.setSelected = function(resource) {
        var index = $scope.resources.indexOf(resource);
        if (!$scope.resources[index].unfilled && $scope.eventInfo.cutOff && $scope.resources[index].accepted) {
            if ($scope.selectedResource >= 0) $scope.resources[$scope.selectedResource].selected = false;
            $scope.selectedResource = -1;
            $scope.search.name = '';
        } else {
            if ($scope.selectedResource >= 0) $scope.resources[$scope.selectedResource].selected = false;
            $scope.resources[index].selected = true;
            $scope.selectedResource = index;
            if ($scope.resources[index].filled) {
                $scope.search.name = $scope.resources[index].filled.name;
            } else {
                $scope.search.name = '';
            }
        }
    };

    $scope.unfill = function(resource, ev) {
        ev.stopPropagation();
        var index = $scope.resources.indexOf(resource);
        $scope.resources[index].filled = null;
        $scope.resources[index].unfilled = true;
        $scope.resources[index].changed = true;
        _watchSelected();
        $scope.search.name = '';
    };

    $scope.hasSelected = (user) => {
        const result = isElementInArray(user, $scope.resources[$scope.selectedResource].invitedUsers);
        return result;
    }

    const isElementInArray = (element, array) => {
        let arr = array || $scope.resources[$scope.selectedResource].invitedUsers || [];
        for (var i = 0; i < arr.length ; i++) {
            const compare = arr[i]._id || arr[i]; // if its retrieved via backend, the array contains just the id, not an object
            if (compare == element._id){
                return i;
            }
        }
        return false
    }

    $scope.getIndex = (user) => {
        return (isElementInArray(user) + 1);
    }

    $scope.fillUser = function(user) {
        if (!$scope.eventInfo.cutOff || !$scope.resources[$scope.selectedResource].accepted) {
            const indexArrayElem = isElementInArray(user, $scope.resources[$scope.selectedResource].invitedUsers);
            if (indexArrayElem !== false){
                $scope.resources[$scope.selectedResource].invitedUsers.splice(indexArrayElem, 1);
            } else {
                if ($scope.resources[$scope.selectedResource].invitedUsers.length < 5)
                    $scope.resources[$scope.selectedResource].invitedUsers.push(user);
                // else TODO: Show a message saying that 5 users were selected
            }
        }
    };

    $scope.submit = function() {
        if ($scope.selectedResource > 0) {
            $scope.resources[$scope.selectedResource].selected = false;
        }
        $mdDialog.cancel();
        // Patch: Repeated control
        removeRepeatedInvitedUsers();
        var resourcesData = {
            eventId: $scope.eventInfo._id,
            businessId: $scope.eventInfo.business._id,
            resources: $scope.resources
        };

        businessService.addResources(resourcesData).then(
            function(res) {
                $rootScope.$emit('business.reload-profile');
                eventInfo.resources = res.data.event.resources;
            });
        
        function removeRepeatedInvitedUsers() {
            for (var i = $scope.resources.length - 1; i >= 0; i--) {
                var cleanUserList = [];
                for (var j = $scope.resources[i].invitedUsers.length - 1; j >= 0; j--) {
                    // if element doesn't exist then push it
                    if (cleanUserList.findIndex((item) => { return String(item._id) === String($scope.resources[i].invitedUsers[j]._id) })) {
                        cleanUserList.push($scope.resources[i].invitedUsers[j]);
                    }
                }
                // rewrite invited users list
                $log.log(cleanUserList);
                $scope.resources[i].invitedUsers = cleanUserList;
            }
        }
    };

    $scope.cancel = function() {
        $mdDialog.cancel();
    };
});
