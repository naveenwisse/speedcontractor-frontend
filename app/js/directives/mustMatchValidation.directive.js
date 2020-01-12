angular.module('directive.mustMatch', [])
.directive('mustMatch', function($log) {
    return {
        restrict: "A",
        require: "ngModel",
        link: function(scope, element, attributes, ngModel) {
            ngModel.$validators.mustMatch = function(modelValue) {
                var term1 = attributes.mustMatch,
                    term2 = modelValue;

                if (!attributes.type) {
                    $log.warn("must-match validator requires Type attribute on input");
                }

                if (attributes.type != "password") {
                    if (term1) {
                        term1 = term1.toLowerCase();
                    }
                    if (term2) {
                        term2 = term2.toLowerCase();
                    }
                }

                return term1 === term2;
            };

        }
    };
});
