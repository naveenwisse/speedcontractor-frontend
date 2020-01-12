(function() {
    'use strict';
    angular.module('service.business', [])
        .factory('businessService', function($http, apiBase) {

            var businessServiceFactory = {};

            var _getBusinesses = function(data) {

                return $http({
                    method: 'POST',
                    url: apiBase + 'api/getBusinesses',
                    data: data
                });

            };

            var _getResourceUsers = function(data) {

                return $http({
                    method: 'POST',
                    url: apiBase + 'api/getResourceUsers',
                    data: data
                });

            };

            var _getUsers = function(data) {

                return $http({
                    method: 'POST',
                    url: apiBase + 'api/getUsers',
                    data: data
                });

            };

            var _addResources = function(data) {
                return $http({
                    method: 'POST',
                    url: apiBase + 'api/addResources',
                    data: data
                });
            };

            var _addResource = function(data) {
                return $http({
                    method: 'POST',
                    url: apiBase + 'api/addResource',
                    data: data
                });
            };

            var _editResource = function(data) {
                return $http({
                    method: 'POST',
                    url: apiBase + 'api/editResource',
                    data: data
                });
            };

            var _getTasting = function(data) {

                return $http({
                    method: 'POST',
                    url: apiBase + 'tasting',
                    data: data
                });

            };

            var _getCompetition = function(data) {

                return $http({
                    method: 'POST',
                    url: apiBase + 'competition',
                    data: data
                });

            };

            var _addTasting = function(data) {
                return $http({
                    method: 'POST',
                    url: apiBase + 'api/addTasting',
                    data: data
                });
            };

            var _acceptTasting = function(data) {
                return $http({
                    method: 'POST',
                    url: apiBase + 'api/acceptTasting',
                    data: data
                });
            };

            var _acceptReschedule = function(data) {
                return $http({
                    method: 'POST',
                    url: apiBase + 'api/acceptReschedule',
                    data: data
                });
            };

            var _rescheduleTasting = function(data) {
                return $http({
                    method: 'POST',
                    url: apiBase + 'api/rescheduleTasting',
                    data: data
                });
            };

            var _declineTasting = function(data) {
                return $http({
                    method: 'POST',
                    url: apiBase + 'api/declineTasting',
                    data: data
                });
            };

            var _deleteEvent = function(data) {
                return $http({
                    method: 'POST',
                    url: apiBase + 'api/deleteEvent',
                    data: data
                });
            };

            var _deleteResource = function(data) {
                return $http({
                    method: 'POST',
                    url: apiBase + 'api/deleteResource',
                    data: data
                });
            };

            var _finishResource = function(data) {
                return $http({
                    method: 'POST',
                    url: apiBase + 'api/finishResource',
                    data: data
                });
            };

            var _deleteTasting = function(data) {
                return $http({
                    method: 'POST',
                    url: apiBase + 'api/deleteTasting',
                    data: data
                });
            };

            var _checkInTasting = function(data) {
                return $http({
                    method: 'POST',
                    url: apiBase + 'api/checkInTasting',
                    data: data
                });
            };

            var _addAdministrator = function(data) {
                return $http({
                    method: 'POST',
                    url: apiBase + 'api/addAdministrator',
                    data: data
                });
            };

            var _addFBAdministrator = function(data) {
                return $http({
                    method: 'POST',
                    url: apiBase + 'api/addFBAdministrator',
                    data: data
                });
            };

            var _removeAdministrator = function(data) {
                return $http({
                    method: 'POST',
                    url: apiBase + 'api/removeAdministrator',
                    data: data
                });
            };

            var _removeFBAdministrator = function(data) {
                return $http({
                    method: 'POST',
                    url: apiBase + 'api/removeFBAdministrator',
                    data: data
                });
            };

            var _deleteTastingImage = function(data) {
                return $http({
                    method: 'POST',
                    url: apiBase + 'api/deleteTastingImage',
                    data: data
                });
            };

            var _acceptEmployee = function(data) {
                return $http({
                    method: 'POST',
                    url: apiBase + 'api/acceptEmployee',
                    data: data
                });
            };

            var _declineEmployee = function(data) {
                return $http({
                    method: 'POST',
                    url: apiBase + 'api/declineEmployee',
                    data: data
                });
            };

            var _addCompetition = function(data) {
                return $http({
                    method: 'POST',
                    url: apiBase + 'api/addCompetition',
                    data: data
                });
            };

            var _deleteCompetition = function(data) {
                return $http({
                    method: 'POST',
                    url: apiBase + 'api/deleteCompetition',
                    data: data
                });
            };

            var _updateCompetitorScore = function(data) {
                return $http({
                    method: 'POST',
                    url: apiBase + 'api/updateCompetitorScore',
                    data: data
                });
            };

            var _updateEmployeeCompetitorScore = function(data) {
                return $http({
                    method: 'POST',
                    url: apiBase + 'api/updateEmployeeCompetitorScore',
                    data: data
                });
            };

            var _acceptCompetition = function(data) {
                return $http({
                    method: 'POST',
                    url: apiBase + 'api/acceptCompetition',
                    data: data
                });
            };

            var _declineCompetition = function(data) {
                return $http({
                    method: 'POST',
                    url: apiBase + 'api/declineCompetition',
                    data: data
                });
            };

            var _editEvent = function(data) {
                return $http({
                    method: 'POST',
                    url: apiBase + 'api/editEvent',
                    data: data
                });
            };

            var _addProduct = function(data) {
                return $http({
                    method: 'POST',
                    url: apiBase + 'api/addProduct',
                    data: data
                });
            };

            var _removeProduct = function(data) {
                return $http({
                    method: 'POST',
                    url: apiBase + 'api/removeProduct',
                    data: data
                });
            };

            var _addEventProducts = function(data) {
                return $http({
                    method: 'POST',
                    url: apiBase + 'api/addEventProducts',
                    data: data
                });
            };

            var _addProductReview = function(data) {
                return $http({
                    method: 'POST',
                    url: apiBase + 'api/addProductReview',
                    data: data
                });
            };

            var _getProductReviews = function(data) {
                return $http({
                    method: 'POST',
                    url: apiBase + 'api/getProductReviews',
                    data: data
                });
            };

            var _addCompetingEmployees = function(data) {
                return $http({
                    method: 'POST',
                    url: apiBase + 'api/addCompetingEmployees',
                    data: data
                });
            };

            var _addCheckIns = function(data) {
                return $http({
                    method: 'POST',
                    url: apiBase + 'api/addCheckIns',
                    data: data
                });
            };

            var _finalizeCompetition = function(data) {
                return $http({
                    method: 'POST',
                    url: apiBase + 'api/finalizeCompetition',
                    data: data
                });
            };

            var _getBillableHours = function(begin, end) {
                // Auxiliars to calculate hours diff in one day (hours per day)
                const dateAux1 = moment().hours(moment(begin).hours()).minutes(moment(begin).minutes());
                const dateAux2 = moment().hours(moment(end).hours()).minutes(moment(end).minutes());
                if (moment(begin).hours() > moment(end).hours()) {
                    dateAux2.add(1, 'days');
                }
                let diffHours = dateAux2.diff(dateAux1, 'hours', true);
                diffHours = Math.round(diffHours * 100) / 100;
                // Calculate days diff
                const diffDays = moment(end).diff(moment(begin), 'days') + 1; // fix current day
                // Calculate total hours
                return diffDays * diffHours;
            }

            var _getBusinessGallery = function(businessId) {
                return $http({
                    method: 'POST',
                    url: apiBase + 'api/full-gallery',
                    data: { businessId }
                });
            }

            var _removePhotoGallery = function(id, photo) {
                return $http({
                    method: 'POST',
                    url: apiBase + 'api/remove-photo-gallery',
                    data: { id, photo }
                });
            }

            var _removeVideoGallery = function(id, video) {
                return $http({
                    method: 'POST',
                    url: apiBase + 'api/remove-video-gallery',
                    data: { id, video }
                });
            }

            var _getMapMarkers = function() {
                return $http({
                    method: 'GET',
                    url: apiBase + 'markers'
                });
            }

            var _getAllByCoords = function(coords) {
                return $http({
                    method: 'POST',
                    url: apiBase + 'allbycoords',
                    data: { coords }
                });
            }

            var _requestJobInvitation = function(jobId, userId) {
                return $http({
                    method: 'POST',
                    url: apiBase + 'requestjobinvitation',
                    data: { jobId, userId }
                });
            }

            var _getJobById = function(massHireResource, group) {
                return $http({
                    method: 'POST',
                    url: apiBase + 'getjob',
                    data: { massHireResource, group }
                });
            }

            var _sendInvitationJob = function(user, resource) {
                return $http({
                    method: 'POST',
                    url: apiBase + 'sendinvitationjob',
                    data: { user, resource }
                });
            }

            businessServiceFactory.getBusinesses = _getBusinesses;
            businessServiceFactory.getResourceUsers = _getResourceUsers;
            businessServiceFactory.getUsers = _getUsers;
            businessServiceFactory.addResources = _addResources;
            businessServiceFactory.addResource = _addResource;
            businessServiceFactory.getTasting = _getTasting;
            businessServiceFactory.getCompetition = _getCompetition;
            businessServiceFactory.addTasting = _addTasting;
            businessServiceFactory.acceptTasting = _acceptTasting;
            businessServiceFactory.acceptReschedule = _acceptReschedule;
            businessServiceFactory.rescheduleTasting = _rescheduleTasting;
            businessServiceFactory.declineTasting = _declineTasting;
            businessServiceFactory.editResource = _editResource;
            businessServiceFactory.deleteEvent = _deleteEvent;
            businessServiceFactory.deleteResource = _deleteResource;
            businessServiceFactory.finishResource = _finishResource;
            businessServiceFactory.deleteTasting = _deleteTasting;
            businessServiceFactory.checkInTasting =_checkInTasting;
            businessServiceFactory.addAdministrator = _addAdministrator;
            businessServiceFactory.addFBAdministrator = _addFBAdministrator;
            businessServiceFactory.removeAdministrator = _removeAdministrator;
            businessServiceFactory.removeFBAdministrator = _removeFBAdministrator;
            businessServiceFactory.deleteTastingImage = _deleteTastingImage;
            businessServiceFactory.acceptEmployee = _acceptEmployee;
            businessServiceFactory.declineEmployee = _declineEmployee;
            businessServiceFactory.addCompetition = _addCompetition;
            businessServiceFactory.deleteCompetition = _deleteCompetition;
            businessServiceFactory.updateCompetitorScore = _updateCompetitorScore;
            businessServiceFactory.updateEmployeeCompetitorScore = _updateEmployeeCompetitorScore;
            businessServiceFactory.acceptCompetition = _acceptCompetition;
            businessServiceFactory.declineCompetition = _declineCompetition;
            businessServiceFactory.editEvent = _editEvent;
            businessServiceFactory.addProduct = _addProduct;
            businessServiceFactory.removeProduct = _removeProduct;
            businessServiceFactory.addEventProducts = _addEventProducts;
            businessServiceFactory.addProductReview = _addProductReview;
            businessServiceFactory.getProductReviews = _getProductReviews;
            businessServiceFactory.addCompetingEmployees = _addCompetingEmployees;
            businessServiceFactory.finalizeCompetition = _finalizeCompetition;
            businessServiceFactory.addCheckIns = _addCheckIns;
            businessServiceFactory.getBillableHours = _getBillableHours;
            businessServiceFactory.getBusinessGallery = _getBusinessGallery;
            businessServiceFactory.removePhotoGallery = _removePhotoGallery;
            businessServiceFactory.removeVideoGallery = _removeVideoGallery;
            businessServiceFactory.getMapMarkers = _getMapMarkers;
            businessServiceFactory.getAllByCoords = _getAllByCoords;
            businessServiceFactory.requestJobInvitation = _requestJobInvitation;
            businessServiceFactory.getJobById = _getJobById;
            businessServiceFactory.sendInvitationJob = _sendInvitationJob;
            return businessServiceFactory;
        });

})();
