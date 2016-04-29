/// <reference path="../../scripts/typings/angularjs/angular.d.ts" />
(function () {
    "use strict";

    angular
        .module("app")
		.controller("masterPageController", masterPageController);

    masterPageController.$inject = ["$scope", "$state", "$rootScope", "notifications", "$window", "localStorageService", "authService"];
    function masterPageController($scope, $state, $rootScope, notifications, $window, localStorageService, authService) {

        var vm = this;
        vm.isAdministrator = false;
        vm.identity = null;
        vm.logout = logout;
		vm.minimizeMenu = minimizeMenu;
		vm.minimizedMenu = false;
		vm.maximizeMenu = maximizeMenu;

		initPage();

		function initPage() {
            if (localStorageService.get("showWelcomeMessage")) {
                localStorageService.remove("showWelcomeMessage");
				notifications.success("Hello " + vm.user.firstName, "Logged in");
			};

			$scope.$on("search", function (event, args) {
				// if a search is run from the querystring, populate the textbox
				$scope.q = args.q;
			});

            $rootScope.$watch("identity", function () {
                vm.identity = $rootScope.identity;
                vm.isAdministrator = vm.identity && authService.isInRole('Administrator');
            });            
		}

        function logout() {
            $window.location.assign("/logout");
        }

		function minimizeMenu() {
			vm.minimizedMenu = true;
        }

		function maximizeMenu() {
			vm.minimizedMenu = false;
		}

    }

})();