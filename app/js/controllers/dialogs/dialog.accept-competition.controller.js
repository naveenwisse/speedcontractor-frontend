angular.module('controller.dialog.accept-competition', [])
.controller('DialogAcceptCompetitionController', function($scope, $mdDialog, pendingCompetitions, competition, businessInfo, businessService) {

    $scope.pendingCompetitions = angular.copy(pendingCompetitions);
    $scope.competition = angular.copy(competition);
    $scope.businessInfo = angular.copy(businessInfo);
    $scope.conflictingCompetitions = [];

    var endsAt = $scope.competition.endsAt,
        startsAt = $scope.competition.startsAt,
        i = 0,
        start,
        end;

    for (; i < $scope.pendingCompetitions.length; i++) {
        // (StartA <= EndB)  and  (EndA >= StartB)
        start = moment($scope.pendingCompetitions[i].startsAt);
        end = moment($scope.pendingCompetitions[i].endsAt);
        if ($scope.competition._id !== $scope.pendingCompetitions[i]._id &&
            ((start.isSame(endsAt) || start.isBefore(endsAt)) && (end.isSame(startsAt) || end.isAfter(startsAt)))) {
            // conflict = true;
            $scope.conflictingCompetitions.push($scope.pendingCompetitions[i]);
        }
    }

    $scope.accept = function() {
        var conflicting = $scope.conflictingCompetitions.map(function(obj) {
                return obj._id;
            }),
            data = {
                businessId: $scope.businessInfo._id,
                competitionId: $scope.competition._id,
                conflictingCompetitions: conflicting
            };
        businessService.acceptCompetition(data).then(
            function() {
                $mdDialog.hide();
            });
    };

    $scope.decline = function() {
        var data = {
            businessId: $scope.businessInfo._id,
            competitionId: $scope.competition._id
        };
        businessService.declineCompetition(data).then(
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
