angular.module('controller.business-gallery', [])
.controller('BusinessGalleryController', function(
    /*
    
    $anchorScroll,
    toastService,
    $scope,
    $user*/
    $mdDialog,
    $rootScope,
    $log,
    businessService,
    $stateParams
) {
    const vm = this;
    vm.businessId = $stateParams.id;
//    vm.photoGallery = [];
//    vm.videoGallery = [];
    vm.photoVideoGallery = [];
//    vm.galleryCurrent = 'photos-g';
    updateGallery();

    $rootScope.$on('refresh-gallery', () => {
        $log.log('Updating Gallery');
        updateGallery();
    });

    function updateGallery() {
        businessService.getBusinessGallery(vm.businessId)
        .then((res) => {
            //vm.photoVideoGallery = res.data.gallery.galleryPhotoVideos.reverse();
            $rootScope.photoVideoGallery = res.data.gallery.galleryPhotoVideos.reverse();
            
            $rootScope.photoVideoGallery.forEach((item) => {
                if(item.category === $rootScope.tabsProfile.myCategory)
                    $rootScope.tabsProfile.categoryItemCount++;
            });
//            vm.videoGallery = res.data.gallery.galleryVideos.reverse();
            //$log.log(vm.photoVideoGallery);
        })
        .catch((err) => {
            $log.log('err', err)
        })
    }

    vm.removePhoto = (photo) => {
        // Appending dialog to document.body to cover sidenav in docs app
        var confirm = $mdDialog.confirm()
            .title('Would you like to remove?')
            .targetEvent(vm)
            .ok('OK')
            .cancel('Cancel');
        
        $mdDialog.show(confirm).then(function() {
            businessService.removePhotoGallery(vm.businessId, photo)
            .then(()=> {
                updateGallery();
            })
            .catch((err) => {
                $log.log('err', err);
            })
        }, function() {
        });
    }

    vm.removeVideo = (video) => {
        businessService.removeVideoGallery(vm.businessId, video)
        .then(()=> {
            updateGallery();
        })
        .catch((err) => {
            $log.log('err', err);
        })
    }
});
