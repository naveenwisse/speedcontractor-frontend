angular.module('controller.dialog.add-competition', [])
.controller('DialogAddCompetitionController', function(
    $state,
    $scope,
    $log,
    $mdDialog,
    $filter,
    priceService,
    businessInfo,
    businessService,
    miniDialogService,
    stripeRequireService
) {

    var now = new Date();
    $scope.offsetDate = { year: 0, month: 2, date: 0, hour: 0 };

    $scope.businessInfo = angular.copy(businessInfo);

    $scope.minDate = new Date(
        now.getFullYear(),
        now.getMonth(),
        now.getDate() + 2);
    $scope.formData = {
        startsAt:new Date(
            now.getFullYear(),
            now.getMonth(),
            now.getDate() + 2,
            now.getHours()),
        endsAt: new Date(
            now.getFullYear(),
            now.getMonth() + 2,
            now.getDate() + 2,
            now.getHours())
    };
    $scope.selectedIndex = 0;
    $scope.typeSelected = 0;
    $scope.typeSelectedCompetition = 4;
    $scope.competitors = [];

    // $scope.typesCompetitions = {
    //     1: {
    //         name: 'Tier 1 are your biggest account usually reserved for Alcohol sales of $200,000 and up per year.',
    //         selected: false
    //     },
    //     2: {
    //         name: 'Tier 2 are B accounts usually from $130,000-$200,000 in total alcohol sales sold per year.',
    //         selected: false
    //     },
    //     3: {
    //         name: 'Tier 3 is lower than $130,000 sold per year.',
    //         selected: false
    //     },
    //     4: {
    //         name: 'Tier 4 is a custom amount.',
    //         selected: false
    //     },
    // };

    // priceService.getPrices({priceType: 'competition'}).then(
    //     function(res) {
    //         competitionPrices = res.data.prices;
    //     }, function(err) {
    //         $log.error('Could not get prices: ', err);
    //     });

    // $scope.selectTypeCompetition = function(competition) {
    //     Object.keys($scope.typesCompetitions).forEach((index) => {
    //         $scope.typesCompetitions[index].selected = false
    //     });
    //     $scope.typesCompetitions[competition].selected = true;
    //     $scope.typeSelectedCompetition = competition;
    // }


    $scope.updateCost = function(amount) {
        $scope.formData.cost = amount + amount * 0.15;
        $scope.formData.fee = amount * 0.15;
           
    }
    $scope.submit = function(form) {
        if (form.$valid && $scope.competitors.length > 0 && $scope.competitors.length <= 3) {

            let price = 0;
//            if ($scope.typeSelectedCompetition === '4')
                price = $scope.formData.cost;
//            else // format the price to human readable
//                price = $filter('currency')(competitionPrices[$scope.typeSelectedCompetition][$scope.competitors.length].price/100, "$", 0);
            stripeRequireService.stripeAccountRequired($scope.businessInfo)
            .then(function(){
                miniDialogService.showDialog('If you proceed, you will be charged $' + price.toLocaleString('en') + ' for this competition.').then(function(confirmed) {
                    if (confirmed) {
                        var data = {
                            title: $scope.formData.title,
                            competitors: $scope.competitors.map(function(obj) {
                                return {
                                    business: obj._id,
                                    name: obj.companyName,
                                    image: obj.image
                                };
                            }),
                            tier: $scope.typeSelectedCompetition,
                            base: $scope.formData.gift || 0,
                            startsAt: $scope.formData.startsAt,
                            endsAt: $scope.formData.endsAt,
                            description: $scope.formData.description,
                            business: businessInfo._id
                        };

                        businessService.addCompetition(data).then(
                            function(res) {
                                $mdDialog.hide();
                                data.competitors = $scope.competitors;
                                businessInfo.competitions.push(data);
                                $state.go('business.competition', {
                                    competitionId: res.data.competitionId
                            });
                        });
                    }
                });
            });
        }
    };

    $scope.selectedItemChange = function(business) {
        if (business) {
            var newBiz = $scope.competitors.some(function(biz) {
                return business._id === biz._id;
            });
            if (!newBiz && $scope.competitors.length <=2) {
                $scope.competitors.push(business);
                $scope.formData.searchText = null;
            }
        }
    };

    $scope.removeCompetitor = function(index) {
        $scope.competitors.splice(index, 1);
    };

    $scope.searchTextChange = function(query) {
        $scope.formData.business = null;
        if (query && query.length >= 3) {
            this.businessQueryPromise =
                businessService.getBusinesses({
                    companyName: query
                }).then(function(res) {
                    return res.data.businesses || [];
                });
        }
    };

    // $scope.nextType = function() {
    //     $scope.typeSelected = $scope.typeSelected + 1;
    //     $scope.selectedIndex = 1;
    // };
    $scope.next = function(form) {
        if (form.$valid) {
            $scope.typeSelected = $scope.typeSelected + 1;
            $scope.selectedIndex += 1;

            if ($scope.selectedIndex == 2){
                $scope.prize = [$scope.formData.gift, 0, 0, 0];
                if($scope.competitors.length==1){
                    $scope.prize[1] = $scope.prize[0];
                }
                else if($scope.competitors.length==2){
                    $scope.prize[1] = $scope.prize[0] * 0.6;
                    $scope.prize[2] = $scope.prize[0] * 0.4;
                }
                else if($scope.competitors.length==3){
                    $scope.prize[1] = $scope.prize[0] * 0.5;
                    $scope.prize[2] = $scope.prize[0] * 0.3;
                    $scope.prize[3] = $scope.prize[0] * 0.2;
                }
            }
        }
    };

    $scope.back = function() {
        $scope.typeSelected = $scope.typeSelected - 1;
        $scope.selectedIndex -= 1;
    };

    $scope.querySearch = function(query) {
        if (this.businessQueryPromise) {
            return this.businessQueryPromise.then(function(businesses) {
                return businesses.filter(createFilterFor(query));
            });
        } else {
            return [];
        }
    };

    function createFilterFor(query) {
        var lowercaseQuery = angular.lowercase(query);
        return function filterFn(business) {
            return angular.lowercase(business.companyName).indexOf(lowercaseQuery) !== -1;
        };
    }

    $scope.cancel = function() {
        $mdDialog.cancel();
    };
});
