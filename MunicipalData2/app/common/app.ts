/// <reference path="../../scripts/typings/toastr/toastr.d.ts" />
/// <reference path="../../scripts/typings/moment/moment.d.ts" />
/// <reference path="../../scripts/typings/angularjs/angular.d.ts" />
(function () {
    "use strict";

    var refreshTokenPromise,
        roles = [],
        appSettings = {
            apiServiceBaseUri: window.location.toString().substring(0, window.location.pathname === "/" ? window.location.toString().length - 1 : window.location.toString().indexOf(window.location.pathname)) + "/",
            apiPrefix: "api/",
            formatDate: (input) => { return input ? moment(input).format("YYYY-MM-DD") : "" },
            months: [{ id: 1, name: "January" }, { id: 2, name: "February" }, { id: 3, name: "March" }, { id: 4, name: "April" }, { id: 5, name: "May" }, { id: 6, name: "June" }, { id: 7, name: "July" }, { id: 8, name: "August" }, { id: 9, name: "September" }, { id: 10, name: "October" }, { id: 11, name: "November" }, { id: 12, name: "December" }],
            newGuid: "00000000-0000-0000-0000-000000000000",
            newInt: "0"
        };

    angular
        .module("app",
        [
            "ui.router",        			// routing (UI version)
            "ngResource",       			// api interaction
            "LocalStorageModule",				// html storage
            //"ui.bootstrap",					// login modal
            //"ngMessages",					// form validation messages
            "ncy-angular-breadcrumb",		// breadcrumbs
            //"nya.bootstrap.select",			// angular bootstrap-select
            //"ngSanitize",					// for ng-bind-html
            //"ui.calendar",					// calendar
            //"ui.sortable"					// sortable e.g. milestones
        ])
        .config(config)
        .factory("notifications", notificationFactory)
        .factory("appStarter", appStarter)
        .constant("appSettings", appSettings)
        .constant("roles", roles)
        .run(run);

    appStarter.$inject = ["settingsResource", "notifications", "$timeout", "authService", "$window", "userResource", "$q", "$rootScope", "roleResource"];
    function appStarter(settingsResource, notifications, $timeout, authService, $window, userResource, $q, $rootScope, roleResource) {

        return {

            start: function () {

                var promises = [];

                promises.push(roleResource.query(
                    { pageSize: 0 },
                    data=> {
                        for (var k in data) {
                            if (data.hasOwnProperty(k) && k.substring(0, 1) !== "$")
                                roles[k] = data[k];
                        }
                    },
                    err=> {
                        notifications.error("Failed to load the roles", "Initialization error");
                    }).$promise);

                promises.push(userResource.profile(
                    {},
                    data=> {
                        var identity = {};
                        for (var k in data) {
                            if (data.hasOwnProperty(k) && k.substring(0, 1) !== "$")
                                identity[k] = data[k];
                        }
                        $rootScope.identity = identity;
                    },
                    err=> {
                        notifications.error("Failed to load the user profile", "Initialization error");
                    }).$promise);

                promises.push(settingsResource.get(
                    {},
                    data=> {
                        for (var k in data) {
                            if (data.hasOwnProperty(k) && k.substring(0, 1) !== "$")
                                appSettings[k] = data[k];
                        }
                    },
                    err=> {
                        notifications.error("Failed to load the application settings", "Initialization error");
                    }).$promise);


                return $q.all(promises);
            }
        }
    };

    config.$inject = ["$urlRouterProvider", "$stateProvider", "$locationProvider", "$httpProvider", "$breadcrumbProvider"];
    function config($urlRouterProvider, $stateProvider, $locationProvider, $httpProvider, $breadcrumbProvider) {
        // configure routes
        setupRoutes($urlRouterProvider, $stateProvider, $locationProvider);

        // convert dates
        $httpProvider.defaults.transformResponse.push(function (responseData) {

            //var dateRegEx = /^[1-2]\d{3}-(0[1-9]|1[0-2])-([0-2][0-9]|3[0-1])T([0-1]\d|2[0-3]):([0-5]\d):([0-5]\d)Z{0,1}$/
            var dateRegEx = /^[1-2]\d{3}-(0[1-9]|1[0-2])-([0-2][0-9]|3[0-1])T([0-1]\d|2[0-3]):([0-5]\d):([0-5]\d)$/

            function convertDateStringsToDates(input) {
                if (typeof input !== "object") return input;

                for (var key in input) {
                    if (!input.hasOwnProperty(key)) continue;

                    var value = input[key];
                    var match;
                    // check for string properties which look like dates
                    if (typeof value === "string" && (match = value.match(dateRegEx))) {
                        var milliseconds = Date.parse(match[0])
                        if (!isNaN(milliseconds)) {
                            input[key] = new Date(milliseconds);
                        }
                    } else if (typeof value === "object") {
                        // recurse into object
                        convertDateStringsToDates(value);
                    }
                }
            }

            convertDateStringsToDates(responseData);

            return responseData;
        });
		
        // setup breadcrumb
        $breadcrumbProvider.setOptions({
            prefixStateName: "app.home",
            template: "bootstrap3"
        });

        // setup date picker
        //uibDatepickerConfig.startingDay = 1;
        //uibDatepickerConfig.showWeeks = false;
        //uibDatepickerConfig.formatYear = "yyyy";

        // setup tooltip
        //$tooltipProvider.options({ appendToBody: true });
    }

    run.$inject = ["$timeout", "$rootScope", "$state", "notifications", "authService", "authorization"];
    function run($timeout, $rootScope, $state, notifications, authService, authorization) {

        $rootScope.$on("$stateChangeStart", function (event, toState, toStateParams) {
            // from: http://stackoverflow.com/questions/22537311/angular-ui-router-login-authentication
            // todo: track the state the user wants to go to; authorization service needs this
            $rootScope.toState = toState;
            $rootScope.toStateParams = toStateParams;
        });

        $rootScope.$on("$stateChangeSuccess", function () {
            // scroll back to top of window
            // todo: use $window + animate
            $timeout(() => { window.scrollTo(0, 0) }, 0);
        });

        // set defaults for data tables
        $.extend(true, $.fn.dataTable.defaults, {
            "searching": false,
            "ordering": false,
            "info": false,
            "lengthChange": false,
            "order": [[0, "asc"]]
        });

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
        $urlRouterProvider.otherwise("/");
        //debugger;
        $stateProvider
            // logged-in pages ------------------------
            .state("app", {
                abstract: true,
                template: "<div ui-view></div>",
                resolve: {
                    load: ["appStarter", function (appStarter) {
                        var appStarterPromise = appStarter.start();
                        return appStarterPromise.then(function () {
                            $("body").removeClass("loading");
                        });
                    }]
                }
            }).state("app.home", {
                url: "/",
                templateUrl: "/app/home/home.html",
                controller: "home",
                controllerAs: "vm",
                data: { allowAny: true },
                ncyBreadcrumb: {
                    label: "Home"
                }
            }).state("app.user", {
                url: "/users/:id",
                templateUrl: "/app/users/user.html",
                controller: "user",
                controllerAs: "vm",
                data: {
                    roles: ["Administrator"]
                },
                ncyBreadcrumb: {
                    parent: "app.users",
                    label: "{{vm.user.firstName}} {{vm.user.lastName}}"
                }
            }).state("app.users", {
                url: "/users?searchText&roleId",
                templateUrl: "/app/users/users.html",
                controller: "users",
                controllerAs: "vm",
                data: {
                    roles: ["Administrator"]
                },
                ncyBreadcrumb: {
                    label: "Users"
                }
            }).state("app.settings", {
                url: "/settings",
                templateUrl: "/app/settings/settings.html",
                controller: "settings",
                controllerAs: "vm",
                data: {
                    roles: ["Administrator"]
                },
                ncyBreadcrumb: {
                    label: "Settings"
                }
            });

    }

} ());
