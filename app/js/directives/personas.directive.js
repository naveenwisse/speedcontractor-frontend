angular.module('directive.personas', []).directive('ppPersonas', function($user) {
    return {
        scope: true,
        restrict: 'E',
        link: function($scope) {
            $scope.setPersona = function(persona) {
                var prev = $user.persona;
                $user.persona = persona;
                if (prev && prev._id !== persona._id) {
                    $scope.$root.$emit('persona.changed', persona);
                }
            };

            $scope.isAdmin = $user.roles.includes("admin");
        }
    };
});
