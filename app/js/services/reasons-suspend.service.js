(function() {
	'use strict';
	angular.module('service.reasons-suspend', [])
		.factory('reasonsSuspendService', function($mdDialog) {
			var service = {};

			service.openReasonsSuspendModal = function(ev) {

				return $mdDialog.show({
          templateUrl: 'dialogs/reasons-suspend.tmpl.html',
          controller: 'ReasonsSuspendController as rsc',
          parent: angular.element(document.body),
          targetEvent: ev,
          locals: {
            //eventInfo: vm.event
          }
        });
			}

			return service;
		});
})();
