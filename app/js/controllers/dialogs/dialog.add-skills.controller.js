angular.module('controller.dialog.add-skills', [])
    .controller('DialogAddSkillsController', function (
        $scope,
        skillsData,
        $mdDialog,
        userService,
        toastService
    ) {

        if (skillsData) {
            $scope.dialogFormData = {};
            angular.copy(skillsData, $scope.dialogFormData);
        }

        $scope.hide = function () {
            $mdDialog.hide();
        };

        $scope.cancel = function () {
            $mdDialog.cancel();
        };

        $scope.submitDialog = function (form) {
            if (form.$valid) {
                var data = $scope.dialogFormData;
                if (data._id) {
                    userService.updateSkill(data).then(
                        function () {
                            $mdDialog.hide(data);
                        },
                        function () {
                            $mdDialog.hide(data);
                        });
                } else {

                    userService.addSkill(data).then(
                        function () {
                            $mdDialog.hide(data);
                            const success = $mdDialog.alert({
                                title: 'New skill',
                                textContent: 'New skill was added',
                                ok: 'Close'
                            });
                            $mdDialog.show(success);
                        },
                        function (err) {
                            toastService.showToast(err.data.message, "error", 2000);
                            $mdDialog.hide(data);
                        });
                }
            }
        };
    });
