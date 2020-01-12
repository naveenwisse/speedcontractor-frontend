angular.module('controller.dialog.map', [])
.controller('DialogMapController', function($scope, $mdDialog, $log, $state, businessService, NgMap) {
  $scope.markers = [];

  function init() {
    businessService.getMapMarkers()
    .then(({data}) => {
      $log.log(data.groups);
      $scope.groups = data.groups;
      $scope.positions = 0;
      $scope.groups.forEach((group) => {
        $scope.positions += group.titles.length;
      });

      
    })
    .catch(err => {
      $log.log(err);
    })
  }
  init();

  $scope.hide = function() {
      $mdDialog.hide();
  };

  $scope.cancel = function() {
      $mdDialog.cancel();
  };

  $scope.onClickMarker = function(ev, info) {
    var confirm = $mdDialog.confirm()
      .multiple(true)
      .title('Go to Jobs')
      .textContent('Do you want to see the jobs on ' + info.formattedAddress + '?')
      .ariaLabel('Cancel')
      .targetEvent(ev)
      .ok('Go')
      .cancel('Cancel');
    $mdDialog.show(confirm).then(function() {
      $log.log('info', info);
      $mdDialog.hide();
      // $scope.map.showInfoWindow('myInfoWindow', this);
      $state.go('profile.eventListByCoor', {
        lat: info.coordinates[0],
        long: info.coordinates[1],
      });
    });
  }

  NgMap.getMap().then(function(map) {
    $scope.map = map;
  });

  $scope.showCity = function(event, group) {
    $scope.info = {
      titles: { },
      address: group.formattedAddress
    };
    $scope.selectedGroup = group;
    group.titles.forEach((title) => {
      if ($scope.info.titles[title]) {
        $scope.info.titles[title].count++;
      } else {
        $scope.info.titles[title] = {
          count: 1,
          title: title
        }
      }
    });
    $scope.map.showInfoWindow('myInfoWindow', this);
  };
});
