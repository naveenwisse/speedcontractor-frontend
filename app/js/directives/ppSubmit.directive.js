angular.module('directive.ppSubmit', [])
.directive('ppSubmit', function($parse) {
    return {
        restrict: 'A',
        require: ['ppSubmit', '?form'],
        controller: function() {
            this.attempted = false;

            var formController = null;

            this.setAttempted = function() {
                this.attempted = true;
            };

            this.setFormController = function(controller) {
                formController = controller;
            };

            this.needsAttention = function(fieldModelController) {
                if (!formController) return false;

                if (fieldModelController) {
                    return fieldModelController.$invalid && (fieldModelController.$dirty || this.attempted);
                } else {
                    return formController && formController.$invalid && (formController.$dirty || this.attempted);
                }
            };
        },
        link: {
            pre: function(scope, formElement, attributes, controllers) {

                var submitController = controllers[0];
                var formController = (controllers.length > 1) ? controllers[1] : null;

                submitController.setFormController(formController);

                scope.pp = scope.pp || {};
                scope.pp[attributes.name] = submitController;
            },
            post: function(scope, formElement, attributes, controllers) {

                var submitController = controllers[0];
                var formController = (controllers.length > 1) ? controllers[1] : null;
                var fn = $parse(attributes.ppSubmit);

                formElement.bind('submit', function(event) {
                    submitController.setAttempted();
                    if (!scope.$$phase) scope.$apply();

                    if (!formController.$valid) {
                        return false;
                    }

                    scope.$apply(function() {
                        fn(scope, {
                            $event: event
                        });
                    });
                });
            }
        }
    };
});
