angular.module('controller.dialog.reasons-suspend', [])
.controller('ReasonsSuspendController', function($mdDialog) {
		const vm = this;
		vm.reasons= '';

		vm.cancel = function() {
			$mdDialog.cancel();
		};
		vm.accept = function() {
			$mdDialog.hide(vm.reasons);
		}
});
