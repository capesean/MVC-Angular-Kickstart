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
        vm.search = {};
        vm.runSearch = runSearch;
        vm.goToUser = function (userId) { return $state.go("app.user", { id: userId }); };
        vm.newId = appSettings.newGuid;
        initPage();
        // events
        function initPage() {
            roleResource.query({ pageSize: 0 }, function (data) {
                vm.search = { text: $stateParams.searchText, roleId: ($stateParams.roleId ? $stateParams.roleId : "") };
                vm.roles = vm.roles.concat(data);
                var role = undefined;
                for (var i = 0; i < vm.roles.length; i++) {
                    if (vm.roles[i].id === vm.search.roleId)
                        role = vm.roles[i];
                }
                // get the data
                userResource.query({
                    searchText: vm.search.text,
                    roleId: role ? role.id : undefined
                }, function (data) {
                    // set the data to the model
                    if ($scope.dataTable)
                        $scope.dataTable.fnDestroy();
                    // ensure datatable is reset
                    $timeout(function () { vm.users = data; }, 0);
                    // ensure model has bound to UI
                    $timeout(function () {
                        $scope.dataTable = $("table#resultsList").dataTable({
                            fnDrawCallback: function () {
                                vm.loading = false;
                            }
                        });
                    }, 0);
                }, function (err) {
                    notifications.error("Failed to load the users.", "Error", err);
                    $state.go("app.home");
                });
            }, function (err) {
                notifications.error("Failed to load the roles.", "Error", err);
                $state.go("app.home");
            }).$promise.finally(function () { return vm.loading = false; });
        }
        function runSearch() {
            $state.go("app.users", { searchText: vm.search.text, roleId: vm.search.roleId });
        }
        ;
    }
    ;
}());
