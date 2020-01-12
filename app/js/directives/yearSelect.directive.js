(function() {
    'use strict';
    angular.module('directive.yearSelect', [])
        .directive('yearSelect', function() {
            return {
                restrict: "AE",
                require: "ngModel",
                scope: {
                    'maxYears'     : '=',
                    'allowCurrent' : '=',
                    'minYear'      : '='
                },
                replace: true,
                templateUrl: 'year-select.html',
                link: function(scope, element, attrs, ngModel) {
                    var totalYears = scope.maxYears || 100,
                        allowCurrent = scope.allowCurrent,
                        data = {
                            years : []
                        },
                        date = new Date();

                    function generateYears(total) {
                        var yearArray = [],
                            currentYear = date.getFullYear(),
                            endYear = currentYear - total,
                            minYear = scope.minYear;

                        if (minYear) {
                            endYear = minYear;
                        }

                        if (allowCurrent === true) {
                            yearArray.push("Current");
                        }

                        while (endYear <= currentYear) {
                            yearArray.push((currentYear--).toString());
                        }

                        return yearArray;
                    }

                    scope.$watch("minYear", function(newValue, oldValue) {
                        if (newValue && newValue !== oldValue) {
                            data.years = generateYears(totalYears);
                            if (newValue > ngModel.$viewValue) {
                                ngModel.$setViewValue(newValue);
                            }
                        }
                    });

                    data.years = generateYears(totalYears);
                    scope.data = data;
                }
            };
        });
})();

