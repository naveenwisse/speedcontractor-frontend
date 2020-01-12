angular.module('controller.registration', [])
.controller('RegistrationController', function($scope, $auth, $stateParams, $log, vcRecaptchaService) {
    var now = new Date(),
        monthNames = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'],
        i,
        init = false;
    $scope.formData = {};
    $scope.years = [];
    $scope.recaptchaResponse = null;
    $scope.recaptchaWidgetId = null;

    $scope.recaptchaModel = {
        key: '6Lf_JYQUAAAAAItabJNJaj0NzXjQ5b0Cq4Qv6RMM'
    };

    $scope.setRecaptchaResponse = function (response) {
        $log.info('Response available');
        $scope.recaptchaResponse = response;
    };
 
    $scope.setRecaptchaWidgetId = function (widgetId) {
        $log.info('Created widget ID: %s', widgetId);
        $scope.recaptchaWidgetId = widgetId;
    };

    $scope.cbExpiration = function() {
        $log.info('Captcha expired. Resetting response object');
        vcRecaptchaService.reload($scope.widgetId);
        $scope.recaptchaResponse = null;
    };

    for (i = now.getFullYear(); i >= now.getFullYear() - 100; i--) {
        $scope.years.push(i);
    }
    $scope.months = [];
    for (i = 0; i <= 11; i++) {
        $scope.months.push({
            value: i,
            name: monthNames[i]
        });
    }
    $scope.dates = [];
    for (i = 1; i <= 31; i++) {
        $scope.dates.push(i);
    }

    $scope.$watch('formData', function() {
        if (init) {
            $scope.regForm.month.$setValidity("validDate", true);
        } else {
            init = true;
        }
    }, true);

    $scope.registerBasic = function(form) {
        if (form.$valid) {
            var birthDate = moment([$scope.formData.year, $scope.formData.month, $scope.formData.date]),
                credentials;

            if (!birthDate.isValid()) {
                $scope.regForm.month.$setValidity("validDate", false);
                return;
            }

            credentials = {
                name: $scope.formData.first + " " + $scope.formData.last,
                email: $scope.formData.email,
                birthday: birthDate.toISOString(),
                password: $scope.formData.password,
                termsOfService: true,
                token: $stateParams.token
            };

            $auth.signup(credentials).catch(function(response) {
                var errors = [];
                if (response && response.data && response.data.modelState) {
                    for (var key in response.data.modelState) {
                        for (var i = 0; i < response.data.modelState[key].length; i++) {
                            errors.push(response.data.modelState[key][i]);
                        }
                    }
                }
                $scope.signupError = true;
                if (errors.length) {
                    $scope.signupErrorText = errors.join(' ');
                } else {
                    if (response && response.data && response.data.code === 11000) {
                      $scope.signupErrorText = "Duplicate email address, please use another email address and try again.";
                    } else {
                      $scope.signupErrorText = "Unknown error occured, please try again later.";
                    }
                }
            });
        }
    };
});
