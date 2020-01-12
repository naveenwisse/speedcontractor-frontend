angular.module('directive.fakeAction', [])
.directive('fakeAction', function() {
    return {
        link: function($scope, $element) {
            $element.attr('action', '');
        }
    };
});
