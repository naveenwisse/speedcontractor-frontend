angular.module('controller.dialog.additional-comment', [])
	.controller('AdditionalCommentController', function(
			$mdDialog
		) {

			var vm = this;
			vm.show = false;
			vm.field = "";
			vm.title = "This event has been modified do you wish to add any additional comments to send to your resources?";

			vm.cancel = function() {
				vm.field = "";
				$mdDialog.cancel();
			};

			vm.accept = function() {
				vm.title = "Add comment";
				vm.show = true;
			}

			vm.send = function() {
				$mdDialog.hide(vm.field);
			};
	});
