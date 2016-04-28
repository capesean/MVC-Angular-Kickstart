/// <reference path="../../scripts/typings/angularjs/angular.d.ts" />
(function () {
    "use strict";
    angular
        .module("app")
        .controller("user", user);
    user.$inject = ["$scope", "$state", "$stateParams", "userResource", "notifications", "appSettings", "$q", "consultantResource", "errorService", "roleResource"];
    function user($scope, $state, $stateParams, userResource, notifications, appSettings, $q, consultantResource, errorService, roleResource) {
        var vm = this;
        vm.loading = true;
        vm.user = null;
        vm.save = saveUser;
        //todo: allow delete, but only if there is no linked data - server side check (don't let EF delete the data!)
        vm.isNew = $stateParams.id === appSettings.newGuid;
        vm.roles = [];
        initPage();
        // events
        function initPage() {
            var promises = [
                consultantResource.query({ pageSize: 0 }, function (data) { vm.consultants = data; }, function (err) {
                    notifications.error("Failed to load the consultants.", "Error", err);
                    $state.go("app.users");
                }).$promise,
                // load the roles
                roleResource.query({ pageSize: 0 }, function (data) { vm.roles = data; }, function (err) {
                    notifications.error("Failed to load the roles.", "Error", err);
                    $state.go("app.users");
                }).$promise
            ];
            $q.all(promises)
                .then(function () {
                // setup the new/existing item
                if (vm.isNew) {
                    vm.user = new userResource();
                    vm.user.enabled = true;
                    vm.user.id = appSettings.newGuid;
                    vm.loading = false;
                }
                else {
                    promises = [];
                    promises.push(userResource.get({
                        id: $stateParams.id
                    }, function (data) {
                        vm.user = data;
                        //vm.user.selectedRoles = ["9d8d89b8-be05-49d5-b81a-7dbd44f14167", "63b0c09c-bc72-4fda-9789-d50daa1cb646"];
                    }, function (err) {
                        if (err.status === 404) {
                            notifications.error("The requested user does not exist.", "Error");
                        }
                        else {
                            notifications.error("Failed to load the user.", "Error", err);
                        }
                        $state.go("app.users");
                    })
                        .$promise);
                    $q.all(promises).finally(function () { return vm.loading = false; });
                }
            });
        }
        function saveUser() {
            //todo: if saving self, issue if removing/setting a consultant, as it won't update the user's profile data
            if ($scope.mainForm.$invalid) {
                notifications.error("The form has not been completed correctly.", "Error");
            }
            else {
                vm.loading = true;
                //				vm.user.roleIds = vm.selectedRoles;
                vm.user.$save(function (data) {
                    vm.user = data;
                    notifications.success("The user has been saved.", "Saved");
                    $state.go("app.user", { id: vm.user.id });
                }, function (err) {
                    errorService.handleApiError(err, "user");
                }).finally(function () { return vm.loading = false; });
            }
        }
        ;
    }
    ;
}());
