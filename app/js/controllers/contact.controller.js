angular.module('controller.contact', [])
.controller('ContactController', function($scope, userService) {

    var vm = this;

    vm.result = 'hidden';
    vm.resultType = {
        error: false,
        success: false
    };
    vm.resultMessage = '';
    vm.formData = {};
    vm.submitButtonDisabled = false;
    vm.submitted = false;

    vm.submit = function() {
        if ($scope.contactForm.$valid) {
            vm.submitButtonDisabled = true;
            vm.resultType.error = false;
            vm.resultType.success = false;

            userService.contact(vm.formData).then(
                function(res) {
                    vm.submitButtonDisabled = true;
                    vm.resultOutput = "Message has been sent!";
                    vm.resultType.success = true;
                    vm.resultMessage = res.data.message;
                },
                function(err) {
                    vm.submitButtonDisabled = false;
                    vm.resultType.error = true;
                    vm.resultOutput = "Error sending message, please try again later!";
                    vm.resultMessage = err.data.message;
                });
        }
    };

});
