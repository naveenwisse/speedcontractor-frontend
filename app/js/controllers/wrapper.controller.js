import away from 'away';

angular.module('controller.wrapper', []).controller('WrapperController', function($mdDialog, $interval, $state) {
    this.createBusinessDialog = function(ev) {
        $mdDialog.show({
            controller: 'DialogCreateBusinessController',
            templateUrl: 'dialogs/create-business.tmpl.html',
            parent: angular.element(document.body),
            targetEvent: ev
        });
    };    

    // Initialize var to hook and default time to be idle
    var refreshHook = { };
    // var intervalTimeIdle = 300000;
    var intervalTimeIdle = 1000*60*1;
    // Detect user who are idle for 10 seconds 
    var timer = away(intervalTimeIdle);
    timer.on('idle', function() {
        // User is idle
        $state.reload(); // First reload when user is idle
        // Refresh when user still idle
        refreshHook = $interval(function() {
          // Refresh data
          $state.reload();
        }, intervalTimeIdle);
    });
    // Detect user active and cancel refreshHook
    timer.on('active', function() {
        // User is active
        $interval.cancel(refreshHook);
    });
});
