angular.module('controller.profile', [])
.controller('ProfileController', function(
    $scope,
    $state,
    $window,
    $log,
    $timeout,
    userService,
    $user,
    $mdDialog,
    $rootScope,
    toastService,
    uploadService,
    geolocation
) {
    var toastLabels = {
        emailConfirmation: "You have not confirmed your email. Please check your inbox for a confirmation link.",
        removeJobError: "Error removing job, please try again later.",
        removeEducationError: "Error removing education information, please try again later.",
        removeSkillError: "Error removing skill information, please try again later."
    };

    $scope.isBusiness = false;

    $scope.isUser = true;
    $scope.rankingToggle = true;
    $scope.rankingDetails = false;
    $scope.count = 0;
    $scope.total = 0;
    $scope.limit = 2;
    $scope.addPosition = false;
    $scope.inviteMessage = '';
    $scope.showInviteMessage = false;
    $scope.loadingFeed = true;
    $scope.inviteIcon = '';
    $scope.inviteIconColor = {};
    $scope.feedItems = [];
    $scope.feedText = 'No Jobs or Tastings in your area';
    $scope.other = 1;
    $scope.user = {
        conflict: [],
    };
    $scope.tabs = {
        myTabIndex: 0,
    };
    $scope.now = new Date().getTime();

    // Auxiliar function to convert date
    $scope.getTime = function(date){
        return new Date(date).getTime();
    }
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
    };
    $scope.toggleRankingInfo = function() {
        $scope.rankingToggle = !$scope.rankingToggle;
    };

    $scope.toggleRankingDetails = () => {
        $scope.rankingDetails = !$scope.rankingDetails;
    };

    $scope.showUploadModal = function(imageType, profileType) {
        uploadService.showUploadModal(imageType, profileType).then(
            function(images) {
                $scope.user.image = images.image;
                $scope.user.coverImage = images.coverImage;
                getTheProfile();
            });
    };

    $scope.formData = {};
    $scope.ratings = [];

    $scope.dates = [{
        "name": "Current"
    }];

    for (var i = 115; i > 0; i--) {
        $scope.dates.push({
            "name": 1900 + i
        });
    }


    $scope.sendInvite = function(form, email) {
        if (form.$valid) {
            var outputData = {
                email: email
            };
            userService.sendInvite(outputData).then(
                function() {
                    $scope.showInviteMessage = true;
                    $scope.inviteIcon = 'check_circle';
                    $scope.inviteIconColor = {
                        'color': '#22ae00',
                        'vertical-align': 'bottom'
                    };
                    $scope.inviteMessage = 'Invite sent.';
                    $timeout(function() {
                        $scope.showInviteMessage = false;
                        $scope.inviteEmail = '';
                        form.$setPristine();
                        form.$setUntouched();
                    }, 3000);
                },
                function() {
                    $scope.showInviteMessage = true;
                    $scope.inviteIcon = 'error';
                    $scope.inviteIconColor = {
                        'color': 'rgb(216,67,21)',
                        'vertical-align': 'bottom'
                    };
                    $scope.inviteMessage = 'Error sending invite.';
                    $timeout(function() {
                        $scope.showInviteMessage = false;
                        $scope.inviteEmail = '';
                        form.$setPristine();
                        form.$setUntouched();
                    }, 3000);
                });
        }
    };

    $scope.businessReviews = function(ev, massHire) {
        $mdDialog.show({
            templateUrl: 'dialogs/view-business-reviews.tmpl.html',
            controller: 'DialogViewBusinessReviewsController',
            parent: angular.element(document.body),
            targetEvent: ev,
            locals: {
                business: massHire.business,
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

    $scope.applyJob = function(massHire) {
        // find available resource
        let resource;
        for (let i = massHire.resources.length - 1; i >= 0; i--) {
            if (massHire.resources[i].users.length == 0) resource = massHire.resources[i];
        }
        if (resource) { // check if exist resource available
            var applyData = {
                resourceId: resource._id,
                startTime: resource.startTime,
                endTime: resource.endTime,
                massHire: true
            };
            userService.applyResourceJob(applyData).then( // chequear si se usa el apply para otro method sino replicar api en job
                function(res) {
                    $mdDialog.cancel();
                    toastService.showToast(res.data.message, "success", 2000);
                    getTheProfile();
                },
                function(err) {
                    $mdDialog.cancel();
                    toastService.showToast(err.data.message, "success", 2000);
                });
        }
    };

    $scope.apply = function(resource) {
        var applyData = {
            resourceId: resource._id
        };
        userService.applyResource(applyData).then(
            function(res) {
                $mdDialog.cancel();
                toastService.showToast(res.data.message, "success", 2000);
                getTheProfile();
            },
            function(err) {
                $mdDialog.cancel();
                toastService.showToast(err.data.message, "success", 2000);
            });
    };

    $scope.attend = function(ev,tasting) {
        $mdDialog.show({
            controller: 'DialogApplyTastingController',
            templateUrl: 'dialogs/apply-resource.tmpl.html',
            parent: angular.element(document.body),
            targetEvent: ev,
            locals: {
                conflict: $scope.user.conflict,
                tasting: tasting,
                userInfo: $scope.user
            }
        })
        .then(function() {
            getTheProfile();
        }).catch(err => {
            $mdDialog.cancel();
            toastService.showToast(err.data.message, "success", 2000);
        });
    };

    // Dialog Toggles
    $scope.editAddressDialog = function(ev) {
        $mdDialog.show({
            templateUrl: 'dialogs/edit-address.tmpl.html',
            controller: 'DialogUserEditAddressController',
            parent: angular.element(document.body),
            targetEvent: ev,
            locals: {
                userInfo: $scope.user
            }
        }).then(function() {
            getTheProfile();
        });
    };

    $scope.editPhoneDialog = function(ev) {
        $mdDialog.show({
            templateUrl: 'dialogs/edit-phone.tmpl.html',
            controller: 'DialogUserEditPhoneController',
            parent: angular.element(document.body),
            targetEvent: ev,
            locals: {
                userInfo: $scope.user
            }
        }).then(function() {
            getTheProfile();
        });
    };

    $scope.editProfileDialog = function(ev) {
        $mdDialog.show({
                controller: 'DialogEditProfileController',
                templateUrl: 'dialogs/edit-profile.tmpl.html',
                parent: angular.element(document.body),
                targetEvent: ev,
                locals: {
                    userInfo: $scope.user
                }
            })
            .then(function(answer) {
                $scope.status = 'You said the information was "' + answer + '".';
            }, function() {
                $scope.status = 'You cancelled the dialog.';
            });
    };

    $scope.acceptJob = function(ev, resource) {
        $mdDialog.show({
                controller: 'DialogAcceptJobController',
                templateUrl: 'dialogs/accept-job.tmpl.html',
                parent: angular.element(document.body),
                targetEvent: ev,
                locals: {
                    pendingResources: $scope.user.pendingResources,
                    conflict: $scope.user.conflict,
                    resource: resource,
                    userInfo: $scope.user
                }
            })
            .then(function() {
                getTheProfile();
            });
    };

    $scope.acceptCompetitionDialog = function(ev, comp) {
        $mdDialog.show({
                controller: 'DialogProfileAcceptCompetitionController',
                templateUrl: 'dialogs/profile-acept-competition.tmpl.html',
                parent: angular.element(document.body),
                targetEvent: ev,
                locals: {
                    userInfo: $scope.user,
                    comp: comp
                }
            })
            .then(function() {
                getTheProfile();
            });
    };

    $scope.experienceDialog = function(ev) {
        $mdDialog.show({
                controller: 'DialogAddExperienceController',
                templateUrl: "dialogs/add-experience.tmpl.html",
                parent: angular.element(document.body),
                targetEvent: ev,
                locals: {
                    userInfo: $scope.user,
                    jobTypesData: $scope.jobTypes
                }
            })
            .then(function() {
                getTheProfile();
            });
    };

    $scope.skillsDialog = function(ev, skills) {
        $mdDialog.show({
                controller: 'DialogAddSkillsController',
                templateUrl: "dialogs/add-skills.tmpl.html",
                parent: angular.element(document.body),
                targetEvent: ev,
                locals: {
                    skillsData: skills
                }
            })
            .then(function() {
                getTheProfile();
            });
    };

    $scope.createBusinessDialog = function(ev) {
        $mdDialog.show({
            controller: 'DialogCreateBusinessController',
            templateUrl: 'dialogs/create-business.tmpl.html',
            parent: angular.element(document.body),
            targetEvent: ev
        });
    };

    $scope.mapDialog = function(ev) {
        $mdDialog.show({
            controller: 'DialogMapController',
            templateUrl: 'dialogs/map.tmpl.html',
            parent: angular.element(document.body),
            targetEvent: ev
        });
    };

    $scope.rateBusiness = function(resourceId, ev) {
        $mdDialog.show({
            templateUrl: 'dialogs/review-business.tmpl.html',
            controller: 'DialogRateBusinessController',
            parent: angular.element(document.body),
            targetEvent: ev,
            locals: {
                userId: $scope.user._id,
                resourceId: resourceId
            }
        }).then(function() {
            //k getTheBusiness();
        });

    };

    $scope.removeExperience = function(ev, position) {
        var confirm = $mdDialog.confirm()
            .title('Are you sure you want to delete ' + position.title + ' job experience information?')
            .textContent('Deletion of job experience cannot be undone. Please proceed with caution!')
            .ariaLabel('Remove Experience')
            .targetEvent(ev)
            .ok('Delete')
            .cancel('Cancel');

        $mdDialog.show(confirm).then(function() {
            userService.removeExperience(position).then(
                function() {
                    var index = $user.positions.indexOf(position.title);
                    if (index !== -1) {
                        $user.positions.splice(index, 1);
                    }
                    getTheProfile();
                },
                function() {
                    toastService.showToast(toastLabels.removeJobError);
                });
        });
    };

    $scope.removeCertificate = function(ev, imageUrl) {
        uploadService.removeCertificate(imageUrl)
            .then(function(res) {
                toastService.showToast(res.data.message, "success", 2000);
                getTheProfile();
            })
            .catch(function(err) {
                toastService.showToast(err.data.message, "error", 2000);
            });
    }

    $scope.showCertificate = function(ev, imageUrl) {
        $mdDialog.show({
            controller: function($mdDialog) {
                var vm = this;
                vm.image = imageUrl;
                vm.hide = function() {
                    $mdDialog.hide();
                }
                vm.cancel = function() {
                    $mdDialog.cancel();
                };
            },
            controllerAs: 'scm',
            templateUrl: 'dialogs/view-certificate.tmpl.html',
            parent: angular.element(document.body),
            targetEvent: ev,
        })
    }

    $scope.removeSkill = function(ev, skill) {
        var confirm = $mdDialog.confirm()
            .title('Are you sure you want to delete ' + skill.title + ' skill information?')
            .textContent('Deletion of skill information cannot be undone. Please proceed with caution!')
            .ariaLabel('Remove Skill')
            .targetEvent(ev)
            .ok('Delete')
            .cancel('Cancel');

        $mdDialog.show(confirm).then(function() {
            userService.removeSkill(skill).then(
                function() {
                    getTheProfile();
                },
                function() {
                    toastService.showToast(toastLabels.removeSkillError);
                });
        });
    };

    $scope.educationDialog = function(ev, education) {
        $mdDialog.show({
                controller: 'DialogProfileEducationController',
                templateUrl: "dialogs/add-education.tmpl.html",
                parent: angular.element(document.body),
                targetEvent: ev,
                locals: {
                    educationData: education
                }
            })
            .then(function() {
                getTheProfile();
            }, function() {
                $scope.status = 'You cancelled the dialog.';
            });
    };

    $scope.removeEducation = function(ev, education) {
        var educationName = education.studied || "this";

        var confirm = $mdDialog.confirm()
            .title('Are you sure you want to delete the ' + educationName + ' education information?')
            .textContent('Deletion of education information cannot be undone. Please proceed with caution!')
            .ariaLabel('Remove Education Info')
            .targetEvent(ev)
            .ok('Delete')
            .cancel('Cancel');

        $mdDialog.show(confirm).then(function() {
            userService.removeEducation(education).then(
                function() {
                    getTheProfile();
                },
                function() {
                    toastService.showToast(toastLabels.removeEducationError);
                });
        });
    };

    $scope.updateEmail = function(currentEmail, newUserEmail) {
        if (currentEmail != newUserEmail) {
            const alert = $mdDialog.alert({
                title: 'Error',
                textContent: 'Both emails must be equals',
                ok: 'Close'
            });
            $mdDialog.show(alert);
        } else {
            var confirm = $mdDialog.confirm()
                .title('Change Address Email')
                .textContent('Are you sure you want to change your email address account')
                .ok('Change')
                .cancel('Cancel');

            $mdDialog.show(confirm).then(function() {
                userService.updateEmail($scope.user.email, newUserEmail).then(
                    function() {
                        getTheProfile();
                        $user.email = newUserEmail;
                        const alert = $mdDialog.alert({
                            title: 'Success',
                            textContent: 'Your email address account has been changed',
                            ok: 'Close'
                        });
                        $mdDialog.show(alert);
                    },
                    function() {
                        const alert = $mdDialog.alert({
                            title: 'Error',
                            textContent: 'An error has been ocurred, try again.',
                            ok: 'Close'
                        });
                        $mdDialog.show(alert);
                    });
            });
        }
    };

    function splitUserTerms(terms) {
        let separate = {};
        for (let i = terms.length - 1; i >= 0; i--) {
            const term = terms[i];
            if (!separate[term.category])
                separate[term.category] = [];

            separate[term.category].push(term);
        }

        return separate;
    }

    function detection(resource) {
        let result = false;
        const endTime = moment(resource.endTime),
            startTime = moment(resource.startTime)
        if($scope.user.resources){
            for (; i < $scope.user.resources.length; i++) {
                // (StartA <= EndB)  and  (EndA >= StartB)
                let start = moment($scope.user.resources[i].startTime);
                let end = moment($scope.user.resources[i].endTime);
                if ((start.isSame(endTime) || start.isBefore(endTime)) &&
                    (end.isSame(startTime) || end.isAfter(startTime))) {
                    result = true;
                    break;
                }
            }
        }
        // $scope.user.conflict.forEach(conf => {
        //     if (!conf.accepted) {
        //         let start = moment(conf.startTime);
        //         let end = moment(conf.endTime);
        //         // $log.log('srtart',start.isSame(endTime) || start.isBefore(endTime));
        //         // $log.log('end',end.isSame(startTime) || end.isAfter(startTime));
        //         // $log.log('id',resource._id !== conf._id);
        //         // $log.log('------------');
        //         if (resource._id !== conf._id &&
        //             (start.isSame(endTime) || start.isBefore(endTime)) && (end.isSame(startTime) || end.isAfter(startTime))) {
        //             result = true;
        //         }
        //     }
        // });
        return result
    }

    function getTheProfile() {
        userService.getProfile({ _id: $user._id }).then(
            function(res) {
                $scope.user = res.data.user;
                $scope.userEmail = res.data.user.email;
                $scope.terms = splitUserTerms($scope.user.terms);
                if (!$scope.user.stripeAccount || !$scope.user.formattedAddress) {
                    $scope.loadingFeed = false;
                }
                $scope.overallSkill = Math.round($scope.user.overallSkill * 10);
                if (!$scope.user.emailConfirm) {
                    toastService.showToast(toastLabels.emailConfirmation, 'confirmation');
                }
                if (res.data.jobTypes) {
                    $scope.jobTypes = res.data.jobTypes;
                }
                $scope.user.publicTasting = [];
                $scope.user.privateTasting = [];
                $scope.user.jobs = [];
                $scope.user.events_resource = [];

                $scope.user.tastings.forEach((tast) => {
                    if (tast.tastingType == 'PUBLIC') {
                        $scope.user.publicTasting.push(tast);
                    } else {
                        $scope.user.privateTasting.push(tast);
                    }
                });
                $scope.badges.tasting.green = ($scope.user.tastings) ? $scope.user.tastings.length :0;
                let countGreen = 0;
                let countBlue = 0;
                $scope.user.competitions.forEach((comp) => {
                    let diff = moment().diff(comp.startsAt, 'days');
                    if (-2 >= diff && diff >= 0) {
                        countBlue += 1;
                    } else {
                        countGreen += 1;
                    }
                });
                let countJobGreen = 0,
                    countJobBlue = 0,
                    countEventGreen = 0,
                    countEventBlue = 0;

                $scope.massHireList = [];
                if ($scope.user.myMassHireResource) {
                    $scope.user.myMassHireResource.forEach((massHire) => {
                        let include = false;
                        for (var i = massHire.resources.length - 1; i >= 0; i--) {
                            const startTime = moment(massHire.resources[i].startTime);
                            const now = moment();
                            const diff = startTime.diff(now);
                            if (diff > 0) // The resource hasn't been start yet
                                include = true;
                        }
                        if (include) {
                            massHire.resourcesGroups = getResourcesGroups(massHire.resources);
                            massHire.available = getStatusMassHire(massHire.resources);
                            massHire.groups = getMassHireGroups(massHire.resources);
                            massHire.businessName = massHire.resources[0].business.companyName;
                            $scope.massHireList.push(massHire);
                        }
                    });                    
                }

                $scope.user.resources.forEach((resource) => {
                    if (!resource.event) {
                        $scope.user.jobs.push(resource);
                    }
                    else {
                        $scope.user.events_resource.push(resource);
                    }
                    let diff = moment().diff(resource.startTime, 'days');
                    if (-2 <= diff) {
                        if (resource.event) {
                            countEventBlue += 1;
                        } else {
                            countJobBlue += 1;
                        }
                    } else {
                        if (resource.event) {
                            countEventGreen += 1;
                        } else {
                            countJobGreen += 1;
                        }
                    }
                });
                $scope.badges.competition = {
                    red: ($scope.user.pendingCompetitions) ? $scope.user.pendingCompetitions.length :0,
                    blue: countBlue,
                    green: countGreen
                }

                $scope.user.pendingJobs = [];
                $scope.user.pendingEvents = [];

                $scope.user.pendingResources.forEach((resource) => {
                    if (!detection(resource) && resource.business.status === 'active'){
                        if (resource.event) {
                            $scope.user.pendingEvents.push(resource);
                        } else {
                            $scope.user.pendingJobs.push(resource);
                        }
                    }
                });

                $scope.filterRateBusinessResources = [];
                $scope.user.rateBusinessResources.forEach(resource => {
//                    if (resource.filled)
                    {
                        $scope.filterRateBusinessResources.push(resource);
                    }
                });

                $scope.badges.event = {
                    red: $scope.user.pendingEvents.length,
                    blue: countEventBlue,
                    green: countEventGreen
                }
                $scope.badges.job = {
                    red: $scope.user.pendingJobs.length,
                    blue: countJobBlue,
                    green: countJobGreen
                }
                supportedGeo();
            },
            function(err) {
                toastService.showToast('Unable to retrieve the business.', "success", 2000);
                $log.log(err.data.message);
            });
    }

    $scope.hasConflict = function(item) {
        const startTime = moment(item.startTime);
        const endTime = moment(item.endTime);
        let result = false;
        $scope.user.conflict.forEach(conf => {
            if (conf.accepted) {
                let start = moment(conf.startTime);
                let end = moment(conf.endTime);
                //if (startTime.isBetween(start, end) || endTime.isBetween(start, end))
                if ((start.isSame(endTime) || start.isBefore(endTime)) && (end.isSame(startTime) || end.isAfter(startTime)))
                    result = true
            }
        });
        return result;
    }

    $scope.isInside = function(item) {
        let result = false;
        item.resources.forEach(it => {
            $scope.user.resources.forEach(res => {
                $log.log(it._id, res._id);
                if (it._id === res._id)
                    result = true;
            });            
        })
        return result;
    }

    function getFeed() {
        var businessEmployeer = $scope.user.positions.map(a => a.business);
        businessEmployeer = businessEmployeer.filter( function(e) { return e });
        var feedData = {
                positions: $user.positions,
                resources: [],
                businessEmployeer
            },
            pos = $scope.position;
        // New hawtness
        if (pos) {
            feedData.lon = pos.lon;
            feedData.lat = pos.lat;
        } else {
            // What we have on file :/
            feedData.lon = $user.loc.coordinates[0];
            feedData.lat = $user.loc.coordinates[1];
        }
        userService.getFeed(feedData).then(function(res) {
            $scope.loadingFeed = false;
            $scope.feedItems = res.data.feed;
            $scope.feedTasting = [];
            $scope.feedJobs = [];
            $scope.feedEvents = [];
            $scope.feedItems.forEach((feed) => {
                if (!detection(feed)){
                    if (feed.modelType === 'TASTING') {
                        $scope.feedTasting.push(feed);
                    } else {
                        if (feed.event) {
                            $scope.feedEvents.push(feed);
                        } else {
                            $scope.feedJobs.push(feed);
                        }
                    }
                }
            });

            
            $scope.badges.event.red =  $scope.badges.event.red + $scope.feedEvents.length;
            $scope.badges.job.red =  $scope.badges.job.red + $scope.feedJobs.length;
            $scope.badges.tasting.red = $scope.feedTasting.length;
        }, function() {
            $scope.loadingFeed = false;
        });
    }

    $rootScope.$on('profile.get-feed', getTheProfile);

    $scope.updateName = function() {
        userService.updateName({
            name: $scope.user.name
        });
    };

    getTheProfile();

    function supportedGeo() {
        if (geolocation.support) {

            geolocation.position.then(function(position) {
                $scope.position = position;
                getFeed();
            })
            .catch( error => {
                $log.error(error);
                $scope.loadingFeed = false;
                $scope.feedText = 'Unable to retrieve your location.';
            });
        } else {
            $log.log('Geolocation is not supported for this Browser/OS version yet.');
        }
    }

    function getResourcesGroups(jobs) {
        const groups = { };
        for (let i = jobs.length - 1; i >= 0; i--) {
                const currentTitle = jobs[i].title;
            if (groups[currentTitle]) {
                groups[currentTitle].count++;
                groups[currentTitle].resources.push(jobs[i]);
                if (jobs[i].users.length === 0) groups[currentTitle].vacants++;
            } else {
                groups[currentTitle] = Object.assign({
                    count: 1,
                    vacants: jobs[i].users.length === 0 ? Number('1') : Number('0'),
                    title: currentTitle,
                    resources: [ jobs[i] ]
                }, jobs[i]);
            }
        }
        return Object.values(groups);
    }

    function getStatusMassHire(jobs) {
        let available = 0;
        for (let i = jobs.length - 1; i >= 0; i--) {
            if (jobs[i].unfilled == true)
                available++;
        }
        return available; // return how many jobs are available by massHire
    }

    $scope.currentMasshire = null;
    $scope.selectMasshire = function(item) {
        $scope.currentMasshire = item;
    }

    $scope.backToMassHireList = function() {
        $scope.currentMasshire = null;
    }

    function getMassHireGroups(jobs) {
        const groups = { };
        for (let i = jobs.length - 1; i >= 0; i--) {
            if (!groups[jobs[i].group]) 
                groups[jobs[i].group] = [];
            groups[jobs[i].group].push(jobs[i]);
        }
        return Object.values(groups);
    }

});
