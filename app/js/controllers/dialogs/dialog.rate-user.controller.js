angular.module('controller.dialog.rate-user', [])
.controller('DialogRateUserController', function(
    $scope,
    $rootScope,
    $timeout,
    $log,
    $mdDialog,
    userService,
    businessId,
    resourceId
) {
    var resourceData = {
        resourceId: resourceId,
        rateType: "toUser"
    };
    $scope.loading = true;
    userService.getRatingResource(resourceData).then(
        function(res) {
            $scope.loading = false;
            $scope.resourceUserName = res.data.resource.filled.name;
            $scope.questions = res.data.questions;

            $scope.formData = {
                answers: [],
                error: false,
                errorText: ''
            };

            $scope.submit = function() {
                $mdDialog.hide($scope.formData);

                var ratedData = {
                    businessId: businessId,
                    resourceId: res.data.resource._id,
                    userId: res.data.resource.filled._id,
                    ratings: $scope.formData.answers
                };

                // convert data to a JSON string for transport
                //ratedData = JSON.stringify(ratedData);
                // add the rating and remove the user for the array of users to be rated
                userService.addRating(ratedData).then(
                    function() {
                        $rootScope.$emit('business.reload-profile');
                    },
                    function(err) {
                        $log.log(err.data.message);
                    });
            };

            $scope.$watchCollection(function() {
                return $scope.formData.answers;
            }, function(answers) {
                var form = $scope.dialogForm,
                    isValid = answers.length === $scope.questions.length &&
                        (function() {
                            var len = answers.length;
                            while (len--) {
                                if (!answers[len]) {
                                    return false;
                                }
                            }
                            return true;
                        })();
                form.$setValidity('required', isValid, form.allQuestionsAnswered);
            });
        },
        function(err) {
            $log.log(err.data.message);
        });

    $scope.advance = function(direction, delay) {
        var waitMs = delay ? 350 : 0;
        if (waitMs) {
            $timeout(function() {
                $scope.$tabsCtrl.incrementIndex(direction);
            }, 350);
        } else {
            $scope.$tabsCtrl.incrementIndex(direction);
        }
    };

    $scope.hide = function() {
        $mdDialog.hide();
    };

    $scope.cancel = function() {
        $mdDialog.cancel();
    };
});
