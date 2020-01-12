(function() {
    'use strict';
    angular.module('directive.ppExposeController', []).directive('ppExposeController', ['$parse', function($parse) {
        // someCtrl [as assigned.asThis]
        // 1. Controller to get
        // 2. Assignment expression for setting the
        //    value we find into the scope
        //                      11111           22222
        var expressionRe = /^\s*(\S+)(?:\s*as\s*(\S+))?\s*$/;
        return {
            restrict: 'A',
            link: {
                pre: function($scope, $element, $attrs) {
                    var expressionParts = $attrs.ppExposeController.match(expressionRe),
                    ctrl = expressionParts[1],
                    as = expressionParts[2] || ctrl,
                    instance;
                    instance = $element.data('$' + ctrl + 'Controller');
                    if (instance) {
                        $parse(as).assign($scope, instance);
                    } else {
                        throw new Error('ppExposeController: Could not find controller ["' +
                        '$' + ctrl + 'Controller' + '"]');
                    }
                }
            }
        };
    }]);
})();
