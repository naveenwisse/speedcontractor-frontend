angular.module('controller.competition', [])
    .controller('CompetitionController', function(
        $rootScope,
        $scope,
        $state,
        $stateParams,
        $mdDialog,
        Upload,
        businessService,
        $log,
        $user
    ) {

        $scope.competition = {};
        $scope.isResumeSupported = Upload.isResumeSupported();
        $scope.sortBy = 'user.name';
        $scope.competitors = [];
        $scope.isCompetitionUser = false;

        var businessId = $stateParams.id;
        var competitionData = {
            _id: $stateParams.competitionId
        };
        $scope.isMyCompetition = $scope.user.myCompetitions.filter(x => x.id === $stateParams.competitionId).length > 0;
        function getCompetition() {
            businessService.getCompetition(competitionData).then(
                function(res) {
                    $scope.competition = res.data.competition;
                    $scope.competitors = res.data.competition.competitors;
                    // Is logged user an competitor?
                    var competingEmployees = $scope.competitors.map(competitor => competitor.competingEmployees);
                    var users = [];
                    for (var i = competingEmployees.length - 1; i >= 0; i--) {
                        for (var j = competingEmployees[i].length - 1; j >= 0; j--) {
                            users.push(competingEmployees[i][j].user);
                        }
                    }
                    $scope.isCompetitionUser = users.map(user => user.id).indexOf($user._id) > -1;
                    $log.log($user._id);
                    $log.log($scope.isCompetitionUser);
                },
                function(err) {
                    $log.log(err.data.message);
                });
        }

        $scope.deleteCompetition = function(ev) {
            var confirm = $mdDialog.confirm()
                .title('Are you sure you want to cancel ' + $scope.competition.title + '?')
                .textContent('Cancellation of this competition cannot be undone. Everyone planning to attend the competition will be notified of the cancellation and you will be refunded in full. Please proceed with caution!')
                .ariaLabel('Cancel Competition')
                .targetEvent(ev)
                .ok('Cancel Competition')
                .cancel('Go Back');
            $mdDialog.show(confirm).then(function() {
                var competitionData = {
                    businessId: businessId,
                    competitionId: $scope.competition._id
                };
                businessService.deleteCompetition(competitionData).then(
                    function() {
                        $rootScope.$emit('business.reload-profile');
                        $state.go('business.main');
                    });
            });
        };

        $scope.finalizeCompetition = function(ev) {
            var confirm = $mdDialog.confirm()
                .title('Are you sure you want to finalize ' + $scope.competition.title + '?')
                .textContent('Finalizing this competition cannot be undone. Competitors will be ranked on final scores and notified.')
                .ariaLabel('Finalize Competition')
                .targetEvent(ev)
                .ok('Finalize Competition')
                .cancel('Go Back');
            $mdDialog.show(confirm).then(function() {
                var finalData = {
                    businessId: businessId,
                    competitionId: $scope.competition._id
                };
                businessService.finalizeCompetition(finalData).then(
                    function() {
                        $rootScope.$emit('business.reload-profile');
                        $state.go('business.main');
                    },
                    function(err) {
                        $log.log(err.data.message);
                    });
            });
        };

        $scope.updateCompetitorScore = function(form, competitor) {
            if (form.$valid) {
                var scoreData = {
                    businessId: businessId,
                    competitionId: $scope.competition._id,
                    competitorId: competitor._id,
                    newScore: competitor.score
                };
                businessService.updateCompetitorScore(scoreData).then(
                    function() {
                        competitor.score = competitor.score;
                    },
                    function(err) {
                        $log.log(err.data.message);
                    });
            }
        };

        $scope.updateEmployeeCompetitorScore = function(form, employee, score) {
            if (form.$valid) {
                employee.score = score;
                var scoreData = {
                    businessId: employee.business,
                    competingEmployeeId: employee._id,
                    newScore: employee.score
                };
                businessService.updateEmployeeCompetitorScore(scoreData).then(
                    function() {
                        employee.score = employee.score;
                    },
                    function(err) {
                        $log.error(err.data.message);
                    });
            }
        };

        $scope.openAddProducts = function(ev) {
            $mdDialog.show({
                templateUrl: 'dialogs/add-event-products.tmpl.html',
                controller: 'DialogAddEventProductsController',
                parent: angular.element(document.body),
                targetEvent: ev,
                locals: {
                    businessInfo: $scope.user,
                    eventData: $scope.competition
                }
            });
        };

        $scope.openAddCompetingEmployees = function(ev, competitor, competitorIndex) {
            $mdDialog.show({
                templateUrl: 'dialogs/add-competing-employees.tmpl.html',
                controller: 'DialogAddCompetingEmployeesController',
                parent: angular.element(document.body),
                targetEvent: ev,
                locals: {
                    competitorIndex: competitorIndex,
                    competitorInfo: competitor,
                    competitionInfo: $scope.competition
                }
            });
        };

        $scope.openReviewProduct = function(ev, product) {
            $mdDialog.show({
                templateUrl: 'dialogs/review-product.tmpl.html',
                controller: 'DialogReviewProductController',
                parent: angular.element(document.body),
                targetEvent: ev,
                locals: {
                    productInfo: product,
                    eventData: $scope.competition
                }
            });
        };

        getCompetition();

    });
