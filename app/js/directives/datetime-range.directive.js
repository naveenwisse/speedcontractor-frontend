angular.module('directive.datetimeRange', [])
    .directive('datetimeRange', function() {
        return {
            restrict: 'E',
            scope: {
                startsAt: '=?',
                endsAt: '=?',
                minDateDayOffset: '<?',
                defaultDateOffsetBetween: '<?',
                showEnd: '<?',
            },
            templateUrl: 'datetime-range.html',
            link: {
                pre: function(scope) {
                    if (!scope.showEnd) scope.showEnd = true;
                    let firstWatch = false;
                    let secondWatch = false;

                    scope.minDate = createDate(new Date(), {
                        day: +scope.minDateDayOffset || 0
                    });
                    scope.diffDate = scope.defaultDateOffsetBetween || { year: 0, month: 0, date: 0, hour: 2 };
                    scope.startsAt = createDate(scope.startsAt || scope.minDate);
                    if (scope.endsAt) {
                        scope.endsAt = createDate(scope.endsAt);
                    } else {
                        scope.endsAt = createDate(scope.startsAt, scope.diffDate);
                    }

                    scope.$watch(function() {
                        return +scope.startsAt;
                    }, function(stamp, last) {
//                        if ($rootScope.firstWatch) {
                        if (firstWatch) {
                            var startsAt = scope.startsAt;
                            last = new Date(last);
                            // Date part changed, set the timestamp
                            if (datePartDidChange(startsAt, last)) {
                                transferHoursAndMinutes(startsAt, last);
                            }
                            // If start time is after end time adjust the end time
                            // to be two hours after the start time
                            if (isAfter(startsAt, scope.endsAt)) {// This control is not needed now
                                scope.endsAt = createDate(startsAt, scope.diffDate);
                            }
                        }
                        firstWatch = true;
                        // $rootScope.firstWatch = true;
                    });

                    scope.$watch(function() {
                        return +scope.endsAt;
                    }, function(stamp, last) {
                        if (secondWatch) {
                            var endsAt = scope.endsAt;
                            last = new Date(last);
                            // Date part changed, set the timestamp
                            if (datePartDidChange(endsAt, last)) {
                                transferHoursAndMinutes(endsAt, last);
                            }
                            // If start time is after end time adjust the start time
                            if (isAfter(scope.startsAt, endsAt)) {
                                scope.endsAt = createDate(scope.startsAt, scope.diffDate);
                            }
                        }
                        secondWatch = true;
                    });
                }
            }
        };

        //////////////////////////
        // Simple date util stuffs
        //////////////////////////

        function isAfter(date1, date2) {
            return +date1 >= +date2;
        }

        function datePartDidChange(date1, date2) {
            return date1.getFullYear() !== date2.getFullYear() ||
                date1.getMonth() !== date2.getMonth() ||
                date1.getDate() !== date2.getDate();
        }

        function transferHoursAndMinutes(date1, date2) {
            date1.setHours(date2.getHours());
            date1.setMinutes(date2.getMinutes());
        }

        function createDate(date, adjust) {
            var defaults = { year: 0, month: 0, date: 0, hour: 0 },
                adders = Object.assign({}, defaults, adjust),
                ret = new Date(
                date.getFullYear() + adders.year,
                date.getMonth() + adders.month,
                date.getDate() + adders.date,
                date.getHours() + adders.hour);
            // Transfer minutes when the occurr in increments
            // of 15, as this may be a legit minute part
            if (date.getMinutes() % 15 === 0) {
                ret.setMinutes(date.getMinutes());
            }
            return ret;
        }
    });
