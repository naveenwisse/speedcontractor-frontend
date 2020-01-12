(function() {
    'use strict';
    angular.module('directive.passwordCheck', [])
        .directive('passwordCheck', function() {
            return {
                restrict: "A",
                require: "ngModel",

                link: function(scope, element, attributes, ngModel) {
                    function testPassword(password) {
                        var passRe =/^(?=.*[A-Za-z])(?=.*\d)[A-Za-z\d$@!%*#?&-_]{4,14}$/; //At least 1 letter, 1 number, between 4-16 characters and can contain special characters;
                        return passRe.test(password);
                    }

                    ngModel.$validators.passwordCheck = function(modelValue) {
                        return testPassword(modelValue);
                    };

                }
            };
        });
})();

