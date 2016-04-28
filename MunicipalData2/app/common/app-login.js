/// <reference path="../../scripts/typings/toastr/toastr.d.ts" />
/// <reference path="../../scripts/typings/angularjs/angular.d.ts" />
(function () {
    "use strict";
    // replicated in app
    var settings = {
        apiServiceBaseUri: window.location.toString().substring(0, window.location.toString().indexOf(window.location.pathname)) + "/",
        apiPrefix: "api/",
        newGuid: "00000000-0000-0000-0000-000000000000",
        newInt: "0"
    };
    angular
        .module("app", [
        "ui.router",
        "angular-storage" // token storage
    ])
        .config(config)
        .factory("notifications", notificationFactory)
        .constant("appSettings", settings)
        .run(run);
    config.$inject = ["$urlRouterProvider", "$stateProvider", "$locationProvider"];
    function config($urlRouterProvider, $stateProvider, $locationProvider) {
        // configure routes
        setupRoutes($urlRouterProvider, $stateProvider, $locationProvider);
    }
    run.$inject = [];
    function run() {
        // set default options for toastr
        toastr.options = {
            "closeButton": true,
            "debug": false,
            "progressBar": false,
            "positionClass": "toast-bottom-right",
            "onclick": null,
            "showDuration": 300,
            "hideDuration": 1000,
            "timeOut": 5000,
            "extendedTimeOut": 1000,
            "showEasing": "swing",
            "hideEasing": "linear",
            "showMethod": "fadeIn",
            "hideMethod": "fadeOut"
        };
    }
    function notificationFactory() {
        return {
            success: function (text, title) {
                // console.log(title, text);
                toastr.success(text, title);
            },
            error: function (text, title, err) {
                console.log(title, text, err);
                toastr.error(text, title);
            }
        };
    }
    function setupRoutes($urlRouterProvider, $stateProvider, $locationProvider) {
        $locationProvider.html5Mode(true);
        $urlRouterProvider.otherwise("/login");
        $stateProvider
            .state("login", {
            url: "/login?url",
            templateUrl: "/app/login/login.html",
            controller: "login",
            controllerAs: "vm"
        }).state("resetpassword", {
            url: "/resetpassword",
            templateUrl: "/app/login/resetpassword.html",
            controller: "resetpassword",
            controllerAs: "vm"
        }).state("reset", {
            url: "/reset",
            templateUrl: "/app/login/passwordreset.html",
            controller: "passwordreset",
            controllerAs: "vm"
        });
    }
}());
