(function() {
    'use strict';
    angular.module('service.upload', [])
        .factory('uploadService', function($mdDialog, $http, $filter, $log, Upload, $user, apiBase) {
            var service = {};


            function updateUserImages(imageProp, imageUri) {
                var thingsToMaybeUpdate = $user.businesses.concat($user.personas),
                    personaId = $user.persona._id;
                thingsToMaybeUpdate.forEach(function(item) {
                    if (item._id === personaId) {
                        item[imageProp] = imageUri;
                    }
                });
            }

            function getRandomInt(min, max) {
                return Math.floor(Math.random() * (max - min)) + min;
            }

            service.showUploadModal = function(imageType, profileType, businessId = null, itemType = null, category = null) {
                var templateUrl;
                switch (imageType) {
                    case 'profile':
                        templateUrl = 'dialogs/upload-profile-photo.tmpl.html';
                        break;
                    case 'cover':
                        templateUrl = 'dialogs/upload-cover-photo.tmpl.html';
                        break;
                    case 'certificate':
                        templateUrl = 'dialogs/upload-certificate-photo.tmpl.html';
                        break;
                    case 'gallery':
                        templateUrl = 'dialogs/upload-gallery-photo.tmpl.html';
                        break;
                    default:
                        templateUrl = 'dialogs/upload-cover-photo.tmpl.html';
                }

                return $mdDialog.show({
                    templateUrl: templateUrl,
                    controller: function($timeout, $rootScope, $window, $scope, $mdDialog) {

                        $scope.title = $filter('titleCase')(imageType + ' Photo Upload');
                        $scope.errorMsg = null;
                        $scope.invalidFiles = [];

                        // make invalidFiles array for not multiple to be able to be used in ng-repeat in the ui
                        $scope.$watch('invalidFiles', function(invalidFiles) {
                            if (invalidFiles != null && !angular.isArray(invalidFiles)) {
                                $timeout(function() { $scope.invalidFiles = [invalidFiles]; });
                            }
                        });

                        $scope.deleteImage = function() {
                            var query = {
                                imageType: imageType,
                                profileType: profileType,
                                _id: $user.persona._id
                            };
                            $http.post(apiBase + 'api/deleteImage', query).then(
                                function(res) {
                                    if (imageType === 'profile' || imageType === 'cover') {
                                        var imageProp = imageType === 'profile' ? 'image' : 'coverImage';
                                        updateUserImages(imageProp, res[imageProp]);
                                    }
                                    $mdDialog.hide(res.data);
                                },
                                function() {
                                    $scope.errorMsg = 'An error occured while uploading the file.';
                                    $mdDialog.cancel();
                                });
                        };

                        $scope.upload = function(files) {
                            $scope.errorMsg = null;
                            var encodedFilename;
                            if (files.length) {
                                var filename = '';
                                if (profileType === 'profile' && imageType !== 'certificate') {
                                    filename = $user.name + '.jpg';
                                } else if (profileType === 'business') {
                                    filename = $user.persona.name + '.jpg';
                                } else if (profileType === 'profile' && imageType === 'certificate') {
                                    filename = $user.persona.name + getRandomInt(1, 99999999) + '.jpg';
                                } else if (imageType === 'gallery') {
                                    filename = 'gallery' + getRandomInt(1, 99999999) + '.jpg';
                                }
                                encodedFilename = encodeURIComponent(filename).replace(/[!'()*]/g, function(c) {
                                    return '%' + c.charCodeAt(0).toString(16);
                                });
                                var type = files[0].type;
                                var query = {
                                    imageTitle: $scope.imageTitle || '',
                                    imageComment: $scope.imageComment || '',
                                    filename: filename,
                                    encodedFilename: encodedFilename,
                                    type: type,
                                    imageType: imageType,
                                    profileType: profileType,
                                    _id: $user.persona._id,
                                    itemType: itemType,
                                    category: category,
                                    businessId
                                };
                                $http.post(apiBase + 'api/imageUpload', query).then(
                                    function(res) {
                                        Upload.upload({
                                            url: res.data.credentials.url, //s3Url
                                            transformRequest: function(data, headersGetter) {
                                                var headers = headersGetter();
                                                delete headers.Authorization;
                                                return data;
                                            },
                                            fields: res.data.credentials.fields, //credentials
                                            method: 'POST',
                                            file: files[0]
                                        }).then(
                                            function(res) {
                                                $log.log('res2', res);
                                                // file is uploaded successfully
                                                if (imageType === 'profile' || imageType === 'cover') {
                                                    var imageProp = imageType === 'profile' ? 'image' : 'coverImage';
                                                    updateUserImages(imageProp, res.data[imageProp]);
                                                }
                                                $mdDialog.hide(res.data);
                                            },
                                            function() {
                                                $scope.errorMsg = 'An error occured while uploading the file.';
                                            },
                                            function(evt) {
                                                $scope.progress = parseInt(100.0 * evt.loaded / evt.total);
                                            });
                                    },
                                    function() {
                                        $scope.errorMsg = 'An error occured while uploading the file.';
                                        $mdDialog.cancel();
                                        // called asynchronously if an error occurs
                                        // or server returns response with an error status.
                                    });
                            }
                        };

                        $scope.cancel = function() {
                            $mdDialog.cancel();
                        };
                    }
                });
            };

            service.showUploadVideoModal = function(businessId = null, itemType = null, category = null) {
                var templateUrl = 'dialogs/upload-gallery-video.tmpl.html';

                return $mdDialog.show({
                    templateUrl: templateUrl,
                    controller: function($timeout, $rootScope, $window, $scope, $mdDialog) {

                        $scope.title = $filter('titleCase')('Gallery Video Upload');
                        $scope.errorMsg = null;
                        $scope.invalidFiles = [];

                        // make invalidFiles array for not multiple to be able to be used in ng-repeat in the ui
                        $scope.$watch('invalidFiles', function(invalidFiles) {
                            if (invalidFiles != null && !angular.isArray(invalidFiles)) {
                                $timeout(function() { $scope.invalidFiles = [invalidFiles]; });
                            }
                        });
                        /*
                        $scope.deleteImage = function() {
                            var query = {
                                imageType: imageType,
                                profileType: profileType,
                                _id: $user.persona._id
                            };
                            $http.post(apiBase + 'api/deleteImage', query).then(
                                function(res) {
                                    if (imageType === 'profile' || imageType === 'cover') {
                                        var imageProp = imageType === 'profile' ? 'image' : 'coverImage';
                                        updateUserImages(imageProp, res[imageProp]);
                                    }
                                    $mdDialog.hide(res.data);
                                },
                                function() {
                                    $scope.errorMsg = 'An error occured while uploading the file.';
                                    $mdDialog.cancel();
                                });
                        };
                        */

                        $scope.upload = function(files) {
                            $scope.errorMsg = null;
                            var encodedFilename;
                            if (files.length) {
                                var filename = 'video-gallery' + getRandomInt(1, 99999999) + '.mp4';
                                encodedFilename = encodeURIComponent(filename).replace(/[!'()*]/g, function(c) {
                                    return '%' + c.charCodeAt(0).toString(16);
                                });
                                var type = files[0].type;
                                var query = {
                                    videoTitle: $scope.videoTitle || '',
                                    videoComment: $scope.videoComment || '',
                                    filename: filename,
                                    encodedFilename: encodedFilename,
                                    type: type,
                                    _id: $user.persona._id,
                                    itemType: itemType,
                                    category: category,
                                    businessId
                                };
                                $http.post(apiBase + 'api/video-gallery-upload', query).then(
                                    function(res) {
                                        Upload.upload({
                                            url: res.data.credentials.url, //s3Url
                                            transformRequest: function(data, headersGetter) {
                                                var headers = headersGetter();
                                                delete headers.Authorization;
                                                return data;
                                            },
                                            fields: res.data.credentials.fields, //credentials
                                            method: 'POST',
                                            file: files[0]
                                        }).then(
                                            function(res) {
                                                $log.log('res', res);
                                                // file is uploaded successfully
                                                /*
                                                if (imageType === 'profile' || imageType === 'cover') {
                                                    var imageProp = imageType === 'profile' ? 'image' : 'coverImage';
                                                    updateUserImages(imageProp, res.data[imageProp]);
                                                }
                                                */
                                                $mdDialog.hide(res.data);
                                            },
                                            function() {
                                                $scope.errorMsg = 'An error occured while uploading the file.';
                                            },
                                            function(evt) {
                                                $scope.progress = parseInt(100.0 * evt.loaded / evt.total);
                                            });
                                    },
                                    function() {
                                        $scope.errorMsg = 'An error occured while uploading the file.';
                                        $mdDialog.cancel();
                                        // called asynchronously if an error occurs
                                        // or server returns response with an error status.
                                    });
                            }
                        };

                        $scope.cancel = function() {
                            $mdDialog.cancel();
                        };
                    }
                });
            };

            service.removeCertificate = function(imageUrl) {
                var query = {
                    imageType: 'certificate',
                    profileType: 'profile',
                    _id: $user.persona._id,
                    imageUrl: imageUrl
                };
                return $http.post(apiBase + 'api/deleteImage', query);
            };

            return service;
        });

})();
