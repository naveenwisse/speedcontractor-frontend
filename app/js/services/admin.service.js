angular.module('service.admin', [])
  .factory('adminService', function($rootScope, $http, $log, apiBase) {
    const factoryObject = {};

    const _getAllUsers = function(filter) {
      return $http({
        method: 'POST',
        url: apiBase + 'api/admin/users',
        data: filter
      });
    }

    const _suspend = function(info) {
      return $http({
        method: 'POST',
        url: apiBase + 'api/admin/suspend',
        data: info
      });
    }
    const _suspendBusinesses = function(info) {
      return $http({
        method: 'POST',
        url: apiBase + 'api/admin/suspendBusinesses',
        data: info
      });
    }
    const _getAllPositions = function() {
      return $http({
        method: 'GET',
        url: apiBase + 'api/admin/positions'
      })
    }

    const _getPosition = function(id) {
      return $http({
        method: 'GET',
        url: apiBase + 'api/admin/position/' + id
      })
    }

    const _updatePosition = function(position) {
      return $http({
        method: 'PUT',
        url: apiBase + 'api/admin/position',
        data: position
      });
    }

    const _addPosition = function(position) {
      return $http({
        method: 'POST',
        url: apiBase + 'api/admin/position',
        data: position
      });
    }

    const _switchStatus = function(info) {
      return $http({
        method: 'POST',
        url: apiBase + 'api/admin/positionswitch',
        data: info
      });
    }

    const _getAllTerms = function() {
      return $http({
        method: 'GET',
        url: apiBase + 'api/admin/terms',
      });
    }

    const _addTerm = function(term) {
      return $http({
        method: 'POST',
        url: apiBase + 'api/admin/term',
        data: term
      });
    }

    const _removeTerm = function(info) {
      return $http({
        method: 'POST',
        url: apiBase + 'api/admin/removeterm',
        data: info
      });
    }

    const _editTerm = function(term) {
      return $http({
        method: 'POST',
        url: apiBase + 'api/admin/editterm',
        data: term
      });
    }

    const _getTerm = function(id) {
      return $http({
        method: 'GET',
        url: apiBase + 'api/admin/term/' + id
      })
    }

    var _getBusinesses = function(data) {

      return $http({
          method: 'POST',
          url: apiBase + 'api/admin/businesses',
          data: data
      });

  };
  
    factoryObject.suspendBusinesses = _suspendBusinesses;
    factoryObject.getBusinesses = _getBusinesses;
    factoryObject.getAllUsers = _getAllUsers;
    factoryObject.suspend = _suspend;
    factoryObject.getAllPositions = _getAllPositions;
    factoryObject.getPosition = _getPosition;
    factoryObject.updatePosition = _updatePosition;
    factoryObject.addPosition = _addPosition;
    factoryObject.switchStatus = _switchStatus;
    factoryObject.getAllTerms = _getAllTerms;
    factoryObject.addTerm = _addTerm;
    factoryObject.removeTerm = _removeTerm;
    factoryObject.editTerm = _editTerm;
    factoryObject.getTerm = _getTerm;

    return factoryObject;
  });
