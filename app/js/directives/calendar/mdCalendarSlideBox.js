(function() {
    'use strict';

    angular
        .module('md.calendar')
        .controller('MdCalendarSlideBoxCtrl', function($sce, $scope, $timeout, calendarConfig) {

            var vm = this;
            vm.$sce = $sce;
            vm.calendarConfig = calendarConfig;

            vm.isCollapsed = true;
            $scope.$watch('vm.isOpen', function(isOpen) {
                //events must be populated first to set the element height before animation will work
                $timeout(function() {
                    vm.isCollapsed = !isOpen;
                });
            });

        })
        .directive('mdCalendarSlideBox', function() {

            return {
                restrict: 'EA',
                templateUrl: 'calendar/calendarSlideBox.html',
                replace: true,
                controller: 'MdCalendarSlideBoxCtrl as vm',
                require: ['^?mdCalendarMonth', '^?mdCalendarYear'],
                link: function(scope, elm, attrs, ctrls) {
                    scope.isMonthView = !!ctrls[0];
                    scope.isYearView = !!ctrls[1];
                },
                scope: {
                    isOpen: '=',
                    events: '=',
                    onEventClick: '=',
                    editEventHtml: '=',
                    onEditEventClick: '=',
                    deleteEventHtml: '=',
                    onDeleteEventClick: '='
                },
                bindToController: true
            };

        });
})();
