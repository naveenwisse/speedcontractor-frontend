(function() {
    'use strict';

    angular.module('directive.phone', [])
        .directive('ppPhone', function() {

            var regInputs = {
                inputs: {},
                add: function(name, ctrl) {
                    this.inputs[name] = this.inputs[name] || [];
                    this.inputs[name].push(ctrl);
                },
                setValidity: function(name, key, value) {
                    this.inputs[name].forEach(function(ctrl) {
                        ctrl.$setValidity(key, value);
                    });
                }
            };

            return {
                restrict: 'A',
                require: '?ngModel',
                link: function(scope, element, attrs, ctrl) {
                    var PHONE_REGEXP = /^[(]{0,1}[0-9]{3}[).\- ]{0,1}[0-9]{3}[.\- ]{0,1}[0-9]{4}$/;
                    element.on('change', function() {
                        var value = this.value;

                        regInputs.add('phone', ctrl);

                        if (PHONE_REGEXP.test(value)) {
                            // Valid input
                            regInputs.setValidity('phone', 'server', true);
                            scope.$apply();
                        } else {
                            // Invalid input
                            regInputs.setValidity('phone', 'server', false);
                            scope.$apply();
                        }
                    });
                }
            };
        });
})();
