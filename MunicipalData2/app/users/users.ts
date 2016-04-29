/// <reference path="../../scripts/typings/jquery.datatables/jquery.datatables.d.ts" />
/// <reference path="../../scripts/typings/angularjs/angular.d.ts" />
(function () {
    "use strict";

    angular
        .module("app")
        .controller("users", users);

    users.$inject = ["$scope", "$state", "$timeout", "$resource", "userResource", "notifications", "appSettings", "$stateParams", "roleResource"];
    function users($scope, $state, $timeout, $resource, userResource, notifications, appSettings, $stateParams, roleResource) {

        var vm = this;
        vm.loading = true;
        var allRoles = { id: "", name: "All roles" };
        vm.roles = [allRoles];
		vm.search = { };
		vm.runSearch = runSearch;
        vm.goToUser = userId => $state.go("app.user", { id: userId });
        vm.newId = appSettings.newGuid;

		initPage();

		// events
		function initPage() {
            
			roleResource.query({ pageSize: 0 },
				data => {

					vm.search = { q: $stateParams.q, roleId: ($stateParams.roleId ? $stateParams.roleId : null) };
					vm.roles = vm.roles.concat(data);

					let role = undefined;
					for (let i = 0; i < vm.roles.length; i++) {
						if (vm.roles[i].id === vm.search.roleId)
							role = vm.roles[i];
					}

					// get the data
					userResource.query(
						{
							q: vm.search.q,
							roleId: role ? role.id : undefined
						},
						data => {

							// set the data to the model
							if ($scope.dataTable) $scope.dataTable.fnDestroy();

							// ensure datatable is reset
							$timeout(() => { vm.users = data; }, 0);

							// ensure model has bound to UI
							$timeout(() => {
								$scope.dataTable = $("table#resultsList").dataTable({
									fnDrawCallback() {
										vm.loading = false
									}
								});
							}, 0);

						},
						err => {

							notifications.error("Failed to load the users.", "Error", err);
							$state.go("app.home");

						});

				},
				err => {

					notifications.error("Failed to load the roles.", "Error", err);
					$state.go("app.home");

				}).$promise.finally(() => vm.loading = false);

		}

        function runSearch() {

            $state.go("app.users", { q: vm.search.q, roleId: vm.search.roleId });

        };

    };
} ());