// http://angulartutorial.blogspot.com/2014/03/rating-stars-in-angular-js-using.html

(function() {
    'use strict';

    angular
        .module('directive.starRating', [])
        .directive('starRating', function() {
            return {
                restrict: 'EA',
                template: '<ul class="star-rating" ng-class="{readonly: readonly}">' +
                    '  <li ng-repeat="star in stars" class="star" ng-class="{filled: star.filled}" ng-click="toggle($index)">' +
                    '       <md-icon ng-hide="!star.filled" class="material-icons">star</md-icon>' +
                    '       <md-icon ng-hide="star.filled" class="material-icons">star_border</md-icon>' +
                    '  </li>' +
                    '</ul>',
                scope: {
                    ratingValue: '=ngModel',
                    max: '=?',
                    onRatingSelect: '&?',
                    onConstruct: '&?',
                    readonly: '=?',
                    starIndex: '=?'
                },
                link: function(scope) {
                    scope.ratingValue = scope.ratingValue || 1;
                    scope.max = scope.max || 10;

                    function _updateStars() {
                        scope.stars = [];
                        for (var i = 0; i < scope.max; i++) {
                            scope.stars.push({
                                filled: i < scope.ratingValue
                            });
                        }
                    }

                    scope.toggle = function(index) {
                        if (scope.readonly === undefined || scope.readonly === false) {
                            scope.ratingValue = index + 1;
                        }
                    };

                    scope.$watch('ratingValue', function(oldValue, newValue) {
                        if (newValue) {
                            _updateStars();
                        }
                    });

                    _updateStars();
                }
            };
        });
})();
