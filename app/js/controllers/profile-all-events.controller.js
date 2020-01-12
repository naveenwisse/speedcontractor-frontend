angular.module('controller.profile-all-events', [])
.controller('AllEventsController', function($scope, $log, userService) {
    userService.getUserEvents().then(
        function(res) {
            $scope.events = res.data.events;
        },
        function(err) {
            $log.error(err.data.message);
        });
});
