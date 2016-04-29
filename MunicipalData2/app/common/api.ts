/// <reference path="../../scripts/typings/angularjs/angular.d.ts" />
// todo: consider restangular or breeze?
(function () {
    "use strict";

    angular
        .module("app")
        .factory("roleResource", roleResource)
        .factory("settingsResource", settingsResource)
        .factory("userResource", userResource);

    //#region role resource
    roleResource.$inject = ["$resource", "appSettings"];
    function roleResource($resource, appSettings) {
        return $resource(appSettings.apiServiceBaseUri + appSettings.apiPrefix + "roles/:roleId");
    }
    //#endregion

    //#region settings resource
    settingsResource.$inject = ["$resource", "appSettings"];
    function settingsResource($resource, appSettings) {
        return $resource(appSettings.apiServiceBaseUri + appSettings.apiPrefix + "settings");
    }
    //#endregion

    //#region user resource
    userResource.$inject = ["$resource", "appSettings"];
    function userResource($resource, appSettings) {
        return $resource(appSettings.apiServiceBaseUri + appSettings.apiPrefix + "users/:id",
            { id: "@id" },
            {
                profile: {
                    method: "GET",
                    url: appSettings.apiServiceBaseUri + appSettings.apiPrefix + "users/:id/profile"
                }
            });
    }
    //#endregion

} ());
