angular.module('controller.business', [])
.controller('BusinessController', function(
    $window,
    $scope,
    $state,
    $rootScope,
    $log,
    userService,
    $mdDialog,
    toastService,
    uploadService,
    $anchorScroll,
    businessService,
    business,
    $user
) {

    // Weird renaming, should be `business`.
    // We'll deal with that later.
    $scope.isBusiness = true;

    $scope.user = business;
    $scope.isUser = business.isUser;
    $scope.other = 2;
    $scope.feedTasting = [];
    $scope.feedJobs = [];
    $scope.feedCompetition = [];
    $scope.feedEvents = [];
    $scope.tabs = {
        myTabIndex: 0
    };

    $rootScope.photoVideoGallery = [];

    $rootScope.tabsProfile = {
        categoryItemCount: 0,
        myCategory:"",
        categoryLabels:{
            "facility":"Facility Images/Videos",
            "promotional":"Promotional Special",
            "amentities":"Amenities",
            "benefits":"Benefits",
            "foodlist":"Food Lists",
            "drinklist":"Drink Lists",
            "winelist":"Wine Lists"
        }
    };

    $scope.badges = {
        event: {
            red: 0,
            blue: 0,
            green: 0
        },
        job: {
            red: 0,
            blue: 0,
            green: 0
        },
        tasting: {
            red: 0,
            blue: 0,
            green: 0
        },
        competition: {
            red: 0,
            blue: 0,
            green: 0
        }
    };


    $scope.changeOther = function(value) {
        $scope.other = value;
        $scope.tabs.myTabIndex = 5;
        if($scope.other == 1) // Reviews
        {
            var reviewData = {
                businessId: business._id
            };
            // if (optionalArray && optionalArray.length > 0) reviewData.optionalArray = optionalArray;
            // $scope.product = angular.copy(productInfo);
            $scope.loading = true;
            $scope.businessName = business.companyName;
            userService.getBusinessReviews(reviewData).then(
                function(res) {
                    $scope.reviews = res.data.reviews;
                    $scope.loading = false;
                    if (!res.data.reviews.length) {
                        $scope.loadError = true;
                        $scope.loadErrorText = 'There are no reviews for this product yet.';
                    }
                },
                function() {
                    $scope.loading = false;
                    $scope.loadError = true;
                    $scope.loadErrorText = 'Error loading the reviews.';
                });
        }
    };
    $scope.changeCategory = function(value){
        $rootScope.tabsProfile.myCategory = value;

        $rootScope.tabsProfile.categoryItemCount = 0;
        $rootScope.photoVideoGallery.forEach((item) => {
            if(item.category === $rootScope.tabsProfile.myCategory)
                $rootScope.tabsProfile.categoryItemCount++;
        });
    }
    
    $scope.showUploadModal = function(imageType, profileType) {
        uploadService.showUploadModal(imageType, profileType).then(
            function(images) {
                $scope.user.image = images.image;
                $scope.user.coverImage = images.coverImage;
            });
    };

    $scope.showUploadModalGallery = function(imageType, profileType, businessId, itemType, category) {
        uploadService.showUploadModal(imageType, profileType, businessId, itemType, category).then(
            function() {
                $log.log('Update images list');
                $rootScope.$emit('refresh-gallery');
            });
    };

    $scope.showUploadVideoModalGallery = function(businessId, itemType, category) {
        uploadService.showUploadVideoModal(businessId, itemType, category).then(
            function() {
                $log.log('Update video list');
                $rootScope.$emit('refresh-gallery');
            });
    };

    $scope.openAddPaymentInfo = function(ev) {
        $mdDialog.show({
            templateUrl: 'dialogs/payment.tmpl.html',
            controller: 'DialogPaymentController',
            parent: angular.element(document.body),
            targetEvent: ev,
            locals: {
                businessInfo: $scope.user
            },
            onShowing: function() {
                $anchorScroll();
            }
        });
    };

    $scope.openAddEvent = function(ev) {
        $mdDialog.show({
            templateUrl: 'dialogs/add-event.tmpl.html',
            controller: 'DialogAddEventController',
            parent: angular.element(document.body),
            targetEvent: ev,
            locals: {
                businessInfo: $scope.user
            },
            onShowing: function() {
                $anchorScroll();
            }
        }).then(getTheBusiness);
    };

    $scope.editResource = function(ev, resource) {
        $mdDialog.show({
            templateUrl: 'dialogs/add-resource.tmpl.html',
            controller: 'DialogEditResourceController',
            parent: angular.element(document.body),
            targetEvent: ev,
            locals: {
                businessInfo: $scope.user,
                resourceInfo: resource
            },
            onShowing: function() {
                $anchorScroll();
            }
        });
    };

    $scope.openAddResource = function(ev) {
        $mdDialog.show({
            templateUrl: 'dialogs/add-resource.tmpl.html',
            controller: 'DialogAddResourceController',
            parent: angular.element(document.body),
            targetEvent: ev,
            locals: {
                businessInfo: $scope.user
            },
            onShowing: function() {
                $anchorScroll();
            }
        }).then(getTheBusiness);
    };

    $scope.openAddCompetition = function(ev) {
        $mdDialog.show({
            templateUrl: 'dialogs/add-competition.tmpl.html',
            controller: 'DialogAddCompetitionController',
            parent: angular.element(document.body),
            targetEvent: ev,
            locals: {
                businessInfo: $scope.user
            },
            onShowing: function() {
                $anchorScroll();
            }
        }).then(function() {
            getTheBusiness();
        });
    };

    $scope.openAddProduct = function(ev) {
        $mdDialog.show({
            templateUrl: 'dialogs/add-product.tmpl.html',
            controller: 'DialogAddProductController',
            parent: angular.element(document.body),
            targetEvent: ev,
            locals: {
                businessInfo: $scope.user
            },
            onShowing: function() {
                $anchorScroll();
            }
        }).then(getTheBusiness);
    };

    $scope.openViewProductReviews = function(ev, product, optionalArray, eventId) {
        $mdDialog.show({
            templateUrl: 'dialogs/view-product-reviews.tmpl.html',
            controller: 'DialogViewProductReviewsController',
            parent: angular.element(document.body),
            targetEvent: ev,
            locals: {
                businessInfo: $scope.user,
                productInfo: product,
                optionalArray: optionalArray,
                eventId: eventId
            }
        });
    };
    $scope.openViewBusinessReviews = function(ev, business) {
        $mdDialog.show({
            templateUrl: 'dialogs/view-business-reviews.tmpl.html',
            controller: 'DialogViewBusinessReviewsController',
            parent: angular.element(document.body),
            targetEvent: ev,
            locals: {
                business: business,
            }
        });
    };

    $scope.acceptCompetition = function(ev, competition) {
        $mdDialog.show({
                controller: 'DialogAcceptCompetitionController',
                templateUrl: 'dialogs/accept-competition.tmpl.html',
                parent: angular.element(document.body),
                targetEvent: ev,
                locals: {
                    pendingCompetitions: $scope.user.pendingCompetitions,
                    competition: competition,
                    businessInfo: $scope.user
                }
            }).then(function() {
                getTheBusiness();
            });
    };

    $scope.deleteResource = function(ev, resource) {
        var confirm = $mdDialog.confirm()
            .title('Are you sure you want to cancel ' + resource.title + '?')
            .textContent('Cancellation of this resource cannot be undone. The user filling the position will be notified of the cancellation. Please proceed with caution!')
            .ariaLabel('Cancel Event')
            .targetEvent(ev)
            .ok('Delete')
            .cancel('Cancel');
        $mdDialog.show(confirm).then(function() {
            var resourceData = {
                businessId: $user.persona._id,
                resource: resource
            };
            businessService.deleteResource(resourceData).then(
                function() {
                    getTheBusiness();
                });
        });
    };

    $scope.openAddTasting = function(ev) {
        $mdDialog.show({
            templateUrl: 'dialogs/add-tasting.tmpl.html',
            controller: 'DialogAddTastingController',
            parent: angular.element(document.body),
            targetEvent: ev,
            locals: {
                businessInfo: $scope.user
            },
            onShowing: function() {
                $anchorScroll();
            }
        });
    };

    $scope.acceptTasting = function(ev, tasting) {
        $mdDialog.show({
            controller: 'DialogAcceptTastingController',
            templateUrl: 'dialogs/accept-tasting.tmpl.html',
            parent: angular.element(document.body),
            targetEvent: ev,
            locals: {
                pendingTastings: $scope.user.pendingTastings,
                tasting: tasting,
                businessInfo: $scope.user
            }
        }).then(getTheBusiness);
    };

    $scope.acceptReschedule = function(ev, tasting) {
        $mdDialog.show({
            controller: 'DialogAcceptRescheduleController',
            templateUrl: 'dialogs/accept-reschedule.tmpl.html',
            parent: angular.element(document.body),
            targetEvent: ev,
            locals: {
                tasting: tasting,
                businessInfo: $scope.user
            }
        }).then(getTheBusiness);
    };

    $scope.acceptEmployee = function(ev, employee) {
        $mdDialog.show({
                controller: 'DialogAcceptEmployeeController',
                templateUrl: 'dialogs/accept-employee.tmpl.html',
                parent: angular.element(document.body),
                targetEvent: ev,
                locals: {
                    employee: employee,
                    businessInfo: $scope.user
                }
            }).then(getTheBusiness);
    };

    $scope.deleteTasting = function(ev, tasting) {
        var confirm = $mdDialog.confirm()
            .title('Are you sure you want to cancel ' + tasting.title + '?')
            .textContent('Cancellation of this tasting event cannot be undone. Everyone planning to attend the event will be notified of the cancellation. Please proceed with caution!')
            .ariaLabel('Cancel Event')
            .targetEvent(ev)
            .ok('Cancel Tasting')
            .cancel('Go Back');
        $mdDialog.show(confirm).then(function() {
            var data = {
                businessId: $user.persona._id,
                tasting: tasting
            };
            businessService
                .deleteTasting(data)
                .then(function() {
                    getTheBusiness();
                    $state.go('business.main');
                });
        });
    };

    $scope.rateUser = function(resourceId, ev) {
        $mdDialog.show({
            templateUrl: 'dialogs/rate-user.tmpl.html',
            controller: 'DialogRateUserController',
            parent: angular.element(document.body),
            targetEvent: ev,
            locals: {
                businessId: $scope.user._id,
                resourceId: resourceId
            }
        }).then(function() {
            getTheBusiness();
        });

    };

    $scope.editAddressDialog = function(ev) {
        $mdDialog.show({
            templateUrl: 'dialogs/edit-address.tmpl.html',
            controller: 'DialogBizEditAddressController',
            parent: angular.element(document.body),
            targetEvent: ev,
            locals: {
                businessInfo: $scope.user
            }
        }).then(function() {
            getTheBusiness();
        });
    };

    $scope.goToJob = function(job) {
        $state.go('business.job', { massHireId: job.massHireResource, group: job.group });
    }

    var businessReq;
    function getTheBusiness() {
        if (businessReq) return;
        businessReq = userService
            .getBusiness({ _id: business._id })
            .then(function(res) {
                $scope.badges = {
                    event: {
                        red: 0,
                        blue: 0,
                        green: 0
                    },
                    job: {
                        red: 0,
                        blue: 0,
                        green: 0
                    },
                    tasting: {
                        red: 0,
                        blue: 0,
                        green: 0
                    },
                    competition: {
                        red: 0,
                        blue: 0,
                        green: 0
                    }
                };
                $scope.user = res.data.business;
                $scope.filterRateResources = [];
                $scope.user.rateResources.forEach(resource => {
                    if (resource.filled) {
                        $scope.filterRateResources.push(resource);
                    }
                });
                $scope.feedEvents = [];
                $scope.feedJobs = [];
                $scope.feedTasting = [];
                $scope.feedCompetition = [];
                $scope.user.feed.forEach((feed) => {
                    if (feed.modelType === 'EVENT') {
                        let diff = moment().diff(feed.startsAt, 'days');
                        if (!checkAllResourcesFilled(feed.resources)) {
                            $scope.badges.event.red +=  1;
                        } else {
                            if (-2 <= diff) {
                                $scope.badges.event.blue +=  1;
                            } else {
                                $scope.badges.event.green +=  1;
                            }
                        }
                        // check if feed have filled all resources
                        var allFilled = true;
                        for (var i = feed.resources.length - 1; i >= 0; i--) {
                            if (feed.resources[i].unfilled) {
                                allFilled = false;
                                break;
                            }
                        }
                        feed.allResourcesFilled = allFilled;
                        $scope.feedEvents.push(feed);
                    }
                    if (feed.modelType === 'RESOURCE') {
                        let diff = moment().diff(feed.startTime, 'days');
                        if (-2 <= diff ) {
                            $scope.badges.job.blue +=  1;
                        } else {
                            if (feed.unfilled) {
                                $scope.badges.job.red +=  1;
                            } else {
                                $scope.badges.job.green +=  1;
                            }
                        }
                        $scope.feedJobs.push(feed);
                    }
                    if (feed.modelType === 'TASTING') {
                        let diff = moment().diff(feed.startTime, 'days');
                        if (-2 <= diff) {
                            $scope.badges.tasting.blue +=  1;
                        } else {
                            $scope.badges.tasting.green +=  1;
                        }
                        $scope.feedTasting.push(feed);
                    }
                    if (feed.modelType === 'COMPETITION') {
                        $scope.feedCompetition.push(feed);
                    }
                });
                for (let i = $scope.user.myMassHireResource.length - 1; i >= 0; i--) {
                    $scope.user.myMassHireResource[i].resourcesGroups = getResourcesGroups($scope.user.myMassHireResource[i].resources);
                    $scope.user.myMassHireResource[i].available = getStatusMassHire($scope.user.myMassHireResource[i].resources);
                    $scope.user.myMassHireResource[i].businessName = $scope.user.companyName;
                    $scope.user.myMassHireResource[i].invitationsCount = getRequestInvitationsCount($scope.user.myMassHireResource[i].resources);
                }
                $scope.massHire = $scope.user.myMassHireResource;
                $scope.badges.competition.green = $scope.user.competitions.length;
                $scope.badges.competition.red = $scope.user.pendingCompetitions.length;
                $scope.badges.tasting.red = $scope.user.pendingTastings.length;
                $scope.isUser = res.data.business.isUser;
            }, function(err) {
                toastService.showToast('Unable to retrieve the business.', "error", 2000);
                $log.log('Unable to retrieve the business.', err.data.message);
            }).finally(function() {
                businessReq = null;
            });

            function checkAllResourcesFilled(resources) {
                var allFilled = true;
                for (var i = resources.length - 1; i >= 0; i--) {
                    if (resources[i].unfilled) {
                        allFilled = false;
                        break;
                    }
                }
                return allFilled;
            }
    }

    function getResourcesGroups(jobs) {
        const groups = { };
        for (let i = jobs.length - 1; i >= 0; i--) {
                const currentTitle = jobs[i].title;
            if (groups[currentTitle]) {
                groups[currentTitle].count++;
                groups[currentTitle].resources.push(jobs[i]);
                groups[currentTitle].invitationRequest = groups[currentTitle].invitationRequest.concat(jobs[i].invitationRequest);
                if (jobs[i].users.length === 0) groups[currentTitle].vacants++;
            } else {
                groups[currentTitle] = Object.assign({
                    count: 1,
                    vacants: jobs[i].users.length === 0 ? Number('1') : Number('0'),
                    title: currentTitle,
                    resources: [ jobs[i] ],
                    invitationRequest: jobs[i].invitationRequest
                }, jobs[i]);
            }
        }
        return Object.values(groups);
    }


    function getStatusMassHire(jobs) {
        let available = 0;
        for (let i = jobs.length - 1; i >= 0; i--) {
            for (let j = $scope.feedJobs.length - 1; j >= 0; j--) {
                if ($scope.feedJobs[j]._id === jobs[i]._id)
                    available++;
            }
        }
        return available; // return how many jobs are available by massHire
    }

    function getRequestInvitationsCount(jobs) {
        let invitations = 0;
        for (let i = jobs.length - 1; i >= 0; i--) {
            invitations += jobs[i].invitationRequest.length;
        }
        return invitations;
    }

    $scope.currentMasshire = null;

    $scope.selectMasshire = function(item) {
        $scope.currentMasshire = item;
    }

    $scope.updateMasshire = null;
    $scope.addPositions = function(ev, item){
        $mdDialog.show({
            templateUrl: 'dialogs/add-resource_mass.tmpl.html',
            controller: 'DialogAddResourceMassController',
            parent: angular.element(document.body),
            targetEvent: ev,
            locals: {
                businessInfo: $scope.user,
                massHire: item
            },
            onShowing: function() {
                $anchorScroll();
            }
        });
    }

    $scope.backToMassHireList = function() {
        $scope.currentMasshire = null;
    }

    $scope.finishResource = function(event, item) {
        const ids = item.resources.map(r => r._id);
        var confirm = $mdDialog.confirm()
            .title('Are you sure you want to finish this job?')
            .textContent('Finalization of this resource cannot be undone.')
            .ariaLabel('Finish Event')
            .ok('Finish')
            .cancel('Cancel');
        $mdDialog.show(confirm).then(function() {
            var resourceData = {
                ids
            };
            businessService.finishResource(resourceData).then(
                function() {
                    getTheBusiness();
                });
        });
    }

    // need a reload. Can be triggered by child states.
    var removeReloadProfileHandler =
        $rootScope.$on('business.reload-profile', getTheBusiness);

    // Clean up
    $scope.$on('$destroy', removeReloadProfileHandler);

    getTheBusiness();


});
