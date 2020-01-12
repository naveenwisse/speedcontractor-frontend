angular
.module('service.api', [])
.provider('apiBase', function() {
    this.base = "@@apiBase";
    this.$get = function() {
        return this.base;
    };
});
