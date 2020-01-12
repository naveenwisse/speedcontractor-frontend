angular.module('service.user', [])
.factory('userService', function($http, $q, apiBase) {

    var userServiceFactory = {};

    var _saveBusiness = function(business) {
        return $http({
            method: 'post',
            url: apiBase + 'api/regBus',
            data: business
        });
    };

    var _addEvent = function(eventData) {
        return $http({
            method: 'post',
            url: apiBase + 'api/addEvent',
            data: eventData
        });
    };

    var _addRating = function(ratedData) {
        return $http({
            method: 'post',
            url: apiBase + 'api/addRating',
            data: ratedData
        });
    };
    var _addRating2Business = function(ratedData) {
        return $http({
            method: 'post',
            url: apiBase + 'api/addRating2Business',
            data: ratedData
        });
    };
    var _getBusinessReviews = function(data) {
        return $http({
            method: 'post',
            url: apiBase + 'api/getBusinessReviews',
            data: data
        });
    };
    var _addExperience = function(experience) {
        return $http({
            method: 'post',
            url: apiBase + 'api/addExperience',
            data: experience
        });
    };

    var _removeExperience = function(experience) {
        return $http({
            method: 'post',
            url: apiBase + 'api/removeExperience',
            data: experience
        });
    };

    var _addEducation = function(education) {
        return $http({
            method: 'post',
            url: apiBase + 'api/addEducation',
            data: education
        });
    };

    var _updateEducation = function(education) {
        return $http({
            method: 'post',
            url: apiBase + 'api/updateEducation',
            data: education
        });
    };

    var _removeEducation = function(education) {
        return $http({
            method: 'post',
            url: apiBase + 'api/removeEducation',
            data: education
        });

    };

    var _addSkill = function(skill) {
        return $http({
            method: 'post',
            url: apiBase + 'api/addSkill',
            data: skill
        });
    };

    var _updateSkill = function(skill) {
        return $http({
            method: 'post',
            url: apiBase + 'api/updateSkill',
            data: skill
        });

    };

    var _removeSkill = function(skill) {
        return $http({
            method: 'post',
            url: apiBase + 'api/removeSkill',
            data: skill
        });
    };

    var _addJob = function(job) {
        return $http({
            method: 'post',
            url: apiBase + 'api/addJob',
            data: job
        });
    };

    var _removeJob = function(data) {
        return $http({
            method: 'post',
            url: apiBase + 'api/removeJob',
            data: data
        });
    };

    var _acceptResource = function(data) {
        return $http({
            method: 'post',
            url: apiBase + 'api/acceptResource',
            data: data
        });
    };

    var _declineResource = function(data) {
        return $http({
            method: 'post',
            url: apiBase + 'api/declineResource',
            data: data
        });
    };

    var _contact = function(contactData) {
        return $http({
            method: 'post',
            url: apiBase + 'contact',
            data: {
                name: contactData.name,
                email: contactData.email,
                subject: contactData.subject,
                inputMessage: contactData.inputMessage
            }
        });
    };

    var _sendInvite = function(emailData) {
        return $http({
            method: 'post',
            url: apiBase + 'api/sendInvite',
            data: emailData
        });
    };

    var _getProfile = function(user) {
        return $http({
            method: 'post',
            url: apiBase + 'profile',
            data: user
        });
    };

    var _getBusiness = function(business) {
        return $http({
            method: 'post',
            url: apiBase + 'business',
            data: business
        });
    };

    var _getUserCalendar = function() {
        return $http({
            method: 'post',
            url: apiBase + 'api/getUserCalendar'
        });
    };
    var _getBusinessCalendar = function(companyData) {
        return $http({
            method: 'post',
            url: apiBase + 'api/getBusinessCalendar',
            data: companyData
        });
    };

    var _getUserEvents = function() {
        return $http({
            method: 'post',
            url: apiBase + 'api/getUserEvents'
        });
    };

    var _getEvent = function(event) {
        return $http({
            method: 'post',
            url: apiBase + 'event',
            data: event
        });
    };

    var _getResource = function(resource) {
        return $http({
            method: 'post',
            url: apiBase + 'resource',
            data: resource
        });
    };

    var _getRatingResource = function(resource) {
        return $http({
            method: 'post',
            url: apiBase + 'api/getRatingResource',
            data: resource
        });
    };

    var _getFeed = function(feedData) {
        return $http({
            method: 'post',
            url: apiBase + 'api/getFeed',
            data: feedData
        });
    };

    var _findInvite = function(inviteData) {
        return $http({
            method: 'post',
            url: apiBase + 'findInvite',
            data: inviteData
        });
    };

    var _getEventsById = function(ids) {
        return $http({
            method: 'post',
            url: apiBase + 'api/getEventsById',
            data: ids
        });
    };

    var _applyResource = function(event) {
        return $http({
            method: 'post',
            url: apiBase + 'api/applyResource',
            data: event
        });
    };

    var _applyResourceJob = function(event) {
        return $http({
            method: 'post',
            url: apiBase + 'api/applyResourcejob',
            data: event
        });
    };

    var _attendTasting = function(data) {
        return $http({
            method: 'post',
            url: apiBase + 'api/attendTasting',
            data: data
        });
    };

    var _updateName = function(name) {
        return $http({
            method: 'post',
            url: apiBase + 'api/updateName',
            data: name
        });
    };

    var _updateOccupation = function(occupation) {
        return $http({
            method: 'post',
            url: apiBase + 'api/updateOccupation',
            data: occupation
        });
    };

    var _updateAddress = function(address) {
        return $http({
            method: 'post',
            url: apiBase + 'api/updateAddress',
            data: address
        });
    };

    var _updatePhone = function(data) {
        return $http({
            method: 'post',
            url: apiBase + 'api/updatePhone',
            data: data
        });
    };

    var _acceptCompetitionProfile = function(competition) {
        return $http({
            method: 'post',
            url: apiBase + 'api/acceptCompetitionProfile',
            data: competition
        });
    };

    var _declineCompetitionProfile = function(competition) {
        return $http({
            method: 'post',
            url: apiBase + 'api/declineCompetitionProfile',
            data: competition
        });
    };

    var _updateEmail = function(currentEmail, newEmail) {
        return $http({
            method: 'post',
            url: apiBase + 'updateemail',
            data: { currentEmail, newEmail }
        });
    }

    userServiceFactory.saveBusiness = _saveBusiness;
    userServiceFactory.addEvent = _addEvent;
    userServiceFactory.addEducation = _addEducation;
    userServiceFactory.removeEducation = _removeEducation;
    userServiceFactory.addSkill = _addSkill;
    userServiceFactory.updateSkill = _updateSkill;
    userServiceFactory.removeSkill = _removeSkill;
    userServiceFactory.addRating = _addRating;
    userServiceFactory.addRating2Business = _addRating2Business;
    userServiceFactory.getBusinessReviews = _getBusinessReviews;
    userServiceFactory.addExperience = _addExperience;
    userServiceFactory.removeExperience = _removeExperience;
    userServiceFactory.addJob = _addJob;
    userServiceFactory.removeJob = _removeJob;
    userServiceFactory.acceptResource = _acceptResource;
    userServiceFactory.declineResource = _declineResource;
    userServiceFactory.contact = _contact;
    userServiceFactory.sendInvite = _sendInvite;
    userServiceFactory.getProfile = _getProfile;
    userServiceFactory.getBusiness = _getBusiness;
    userServiceFactory.getUserCalendar = _getUserCalendar;
    userServiceFactory.getBusinessCalendar = _getBusinessCalendar;
    userServiceFactory.getUserEvents = _getUserEvents;
    userServiceFactory.getEvent = _getEvent;
    userServiceFactory.getResource = _getResource;
    userServiceFactory.getRatingResource = _getRatingResource;
    userServiceFactory.getFeed = _getFeed;
    userServiceFactory.findInvite = _findInvite;
    userServiceFactory.getEventsById = _getEventsById;
    userServiceFactory.applyResource = _applyResource;
    userServiceFactory.applyResourceJob = _applyResourceJob;
    userServiceFactory.attendTasting = _attendTasting;
    userServiceFactory.updateName = _updateName;
    userServiceFactory.updateOccupation = _updateOccupation;
    userServiceFactory.updateEducation = _updateEducation;
    userServiceFactory.updateAddress = _updateAddress;
    userServiceFactory.acceptCompetitionProfile = _acceptCompetitionProfile;
    userServiceFactory.declineCompetitionProfile = _declineCompetitionProfile;
    userServiceFactory.updatePhone = _updatePhone;
    userServiceFactory.updateEmail = _updateEmail;

    return userServiceFactory;
});
