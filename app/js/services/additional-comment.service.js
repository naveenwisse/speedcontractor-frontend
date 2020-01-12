(function() {
	'use strict';
	angular.module('service.additional-comment', [])
		.factory('additionalCommentService', function($mdDialog) {
			var service = {};

			service.openAdditionalCommentModal = function(ev) {

				return $mdDialog.show({
          templateUrl: 'dialogs/additional-comment.tmpl.html',
          controller: 'AdditionalCommentController as acc',
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