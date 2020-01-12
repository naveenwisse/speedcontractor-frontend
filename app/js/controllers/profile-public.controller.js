angular.module('controller.profile-public', [])
.controller('PublicProfileController', function($scope, $stateParams, $log, userService) {
    $scope.isUser = false;
    $scope.showInviteMessage = false;
    $scope.loadingFeed = true;
    $scope.gotProfile = false;
    $scope.rankingToggle = true;
    $scope.rankingDetails = false;

    $scope.toggleRankingInfo = function() {
        $scope.rankingToggle = !$scope.rankingToggle;
    };

    $scope.toggleRankingDetails = () => {
        $scope.rankingDetails = !$scope.rankingDetails;
    };

    $scope.splitUserTerms = (terms) => {
        let separate = {};
        for (let i = terms.length - 1; i >= 0; i--) {
            const term = terms[i];
            if (!separate[term.category])
                separate[term.category] = [];

            separate[term.category].push(term);
        }

        return separate;
    }

    userService
        .getProfile({ _id: $stateParams.id })
        .then(function(res) {
            $scope.gotProfile = true;
            $scope.user = res.data.user;
            $scope.terms = $scope.splitUserTerms($scope.user.terms);
            $scope.overallSkill = Math.round($scope.user.overallSkill * 10);
        });

});
