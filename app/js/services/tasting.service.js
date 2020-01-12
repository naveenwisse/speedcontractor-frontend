(function() {
    'use strict';
    angular.module('service.tasting-levels', [])
        .value('tastingLevels', {
            "100": ['Bar Back','Busser','Bartender','Cocktail Server','Dining Room Server','Banquet Manager','General Manager','Floor Manager','Bar Manager'],
            "200": ['Bartender','Cocktail Server','Dining Room Server','Banquet Manager','General Manager','Floor Manager','Bar Manager'],
            "300": ['Banquet Manager','General Manager','Floor Manager','Bar Manager']
        });
})();
