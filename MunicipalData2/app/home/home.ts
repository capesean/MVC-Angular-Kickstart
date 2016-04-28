/// <reference path="../../scripts/typings/angularjs/angular.d.ts" />
(function () {
    "use strict";

    angular
        .module("app")
        .controller("home", home);

    home.$inject = ["authService", "$rootScope", "appSettings"];

    function home(authService, $rootScope, appSettings) {

        console.log("homecontroller");
        var vm = this;
        vm.appSettings = appSettings; //todo: remove
		initPage();

		// events
        function initPage() {
            vm.identity = $rootScope.identity;
		}
    }

} ());