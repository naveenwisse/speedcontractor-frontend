angular.module('controller.dialog.profile-education', [])
.controller('DialogProfileEducationController', function($scope, $log, educationData, states, $mdDialog, userService, toastService) {
    var data = {
            today: new Date(),
            states: states,
            educationData: educationData
        },
        editMode = false;

    if (educationData) {
        editMode = true;
        $scope.dialogFormData = {};
        angular.copy(educationData, $scope.dialogFormData);
    }

    $scope.hide = function() {
        $mdDialog.hide();
    };

    $scope.cancel = function() {
        $mdDialog.cancel();
    };

    $scope.submitDialog = function(form) {
        if (form.$valid) {
            var outputData = $scope.dialogFormData;
            if (editMode) {
                userService.updateEducation(outputData).then(
                    function() {
                        $mdDialog.hide(outputData);
                    },
                    function() {
                        $log.log("Error Adding Education");
                    });
            } else {
                userService.addEducation(outputData).then(
                    function() {
                        $mdDialog.hide(outputData);
                        const success = $mdDialog.alert({
                            title: 'New Education',
                            textContent: 'New education was added',
                            ok: 'Close'
                        });
                        $mdDialog.show(success);
                    },
                    function(err) {
                        toastService.showToast(err.data.message, "error", 2000);
                        $mdDialog.hide(outputData);
                    });
            }
        }
    };

    $scope.editMode = editMode;
    $scope.data = data;
});
