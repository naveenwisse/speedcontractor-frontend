angular.module('controller.position-edit-admin', [])
.controller('PositionEditAdminController', function($scope, $stateParams, $log, $mdDialog, adminService, toastService) {

    var vm = this;
    vm.position = {};
    vm.positionBackup = {};
    vm.showView = 'questions'; // [questions, terms]

    function init() {
      adminService.getPosition($stateParams.id)
      .then(({ data }) => {
        vm.position = data.position;
        vm.positionBackup = JSON.parse(JSON.stringify(data.position)); // Clone
        vm.questions = getArrayQuestions(data.position.questions.length);
      },
      (err) => {
        $log.log(err);
      });
    }

    function getArrayQuestions(length) {
      const array = [];
      let i = 0;
      for (; i < length; i++) {
        array[i] = i + 1;
      }
      return array;
    }

    // Controller Init Operations
    // Get position
    init();

    vm.changeView = (view) => {
      vm.showView = view;
    }

    vm.resetPosition = () => {
      const confirm = $mdDialog.confirm()
        .title('Reset Changes')
        .textContent('Are you sure you want reset all changes?')
        .ariaLabel('Reset Changes')
        .cancel('Cancel')
        .ok('Reset');
      $mdDialog.show(confirm).then(function() {
        vm.position = JSON.parse(JSON.stringify(vm.positionBackup)); // Clone
      });
    }

    vm.updatePosition = () => {
      $log.log(vm.position);
      const confirm = $mdDialog.confirm()
        .title('Save All Changes')
        .textContent('Are you sure you want save all changes?')
        .ariaLabel('Save All Changes')
        .cancel('Cancel')
        .ok('Save');
      $mdDialog.show(confirm).then(function() {
        adminService.updatePosition(vm.position)
        .then(({ data }) => {
          $log.log(data);
          toastService.showToast('Position ' + vm.position.name + ' updated successfully', 'success', 5000);
        },
        (err) => {
          $log.error(err);
          toastService.showToast('An error was ocurred, please try again', 'error', 5000);
        });
      });
    }

    vm.isChecked = (term, question) => {
      question--; // fix index
      $log.log(question);
      let i = vm.position.terms.length - 1;
      for (; i >= 0; i--) {
        if (vm.position.terms[i].model === term) {
          return vm.position.terms[i].questions.includes(question);
        }
      }
      return false;
    }

    vm.check = (term, question) => {
      question--; // fix index
      let i = vm.position.terms.length - 1;
      for (; i >= 0; i--) {
        if (vm.position.terms[i].model === term) {
          if (vm.position.terms[i].questions.includes(question)) {
            const index = vm.position.terms[i].questions.indexOf(question);
            if (index > -1) {
              vm.position.terms[i].questions.splice(index, 1);
              return false;
            }
          } else {
            vm.position.terms[i].questions.push(question);
            return true;
          }
        }
      }
      return false;
    }

    vm.addQuestion = () => {
      const question = {
        question: 'Question',
        answers: ['Answer 1', 'Answer 2', 'Answer 3'],
      };
      vm.position.questions.push(question);
      vm.questions = getArrayQuestions(vm.position.questions.length);
    }

    vm.removeQuestion = (index) => {
      vm.position.questions.splice(index, 1);
    }
});
