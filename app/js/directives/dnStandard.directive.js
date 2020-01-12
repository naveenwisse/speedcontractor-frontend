(function() {
    'use strict';

    angular.module('directive.dnStandard', [])
        .directive('dnMultipleEmailValidator', function() {
            return {
                require: 'ngModel',
                link: dnMultipleEmailValidatorLinkImpl
            };
        });


    function dnMultipleEmailValidatorLinkImpl(scope, element,  attributes, controller) {
        var patterPhone = /^[+]?[(]?[0-9]{3}[)]?[-\s.]?[0-9]{4}[-\s.]?[0-9]{4,7}$/
        var patternEmail =  /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/
        controller.$validators.dnMultipleEmailValidator = function(modelValue, viewValue) {
        var errorFlag = true;
        if (!controller.$isEmpty(viewValue)) {
        var emailIdsArr = viewValue.split(/,|;/g);
            angular.forEach( emailIdsArr, function( value ) {
                if (!patternEmail.test(value.trim()) && !patterPhone.test(value.trim())) {
                    errorFlag = false;
                }
            });
        }
        return errorFlag;
        };
    }
})();
