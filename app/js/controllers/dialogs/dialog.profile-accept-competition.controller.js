angular.module('controller.dialog.profile-accept-competition', [])
.controller('DialogProfileAcceptCompetitionController', function($scope, $mdDialog, comp, userService) {

    $scope.comp = angular.copy(comp);

    $scope.accept = function() {
        userService.acceptCompetitionProfile($scope.comp).then(
            function() {
                $mdDialog.hide();
            });
    };

    $scope.decline = function() {
        userService.declineCompetitionProfile($scope.comp).then(
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
