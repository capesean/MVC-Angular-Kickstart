/// <reference path="../../scripts/typings/toastr/toastr.d.ts" />
/// <reference path="../../scripts/typings/moment/moment.d.ts" />
/// <reference path="../../scripts/typings/angularjs/angular.d.ts" />
(function () {
    "use strict";
    var refreshTokenPromise, roles = [], appSettings = {
        apiServiceBaseUri: window.location.toString().substring(0, window.location.pathname === "/" ? window.location.toString().length - 1 : window.location.toString().indexOf(window.location.pathname)) + "/",
        apiPrefix: "api/",
        formatDate: function (input) { return input ? moment(input).format("YYYY-MM-DD") : ""; },
        months: [{ id: 1, name: "January" }, { id: 2, name: "February" }, { id: 3, name: "March" }, { id: 4, name: "April" }, { id: 5, name: "May" }, { id: 6, name: "June" }, { id: 7, name: "July" }, { id: 8, name: "August" }, { id: 9, name: "September" }, { id: 10, name: "October" }, { id: 11, name: "November" }, { id: 12, name: "December" }],
        newGuid: "00000000-0000-0000-0000-000000000000",
        newInt: "0"
    };
    angular
        .module("app", [
        "ui.router",
        "ngResource",
        "LocalStorageModule",
        //"ui.bootstrap",					// login modal
        //"ngMessages",					// form validation messages
        "ncy-angular-breadcrumb",
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
                promises.push(roleResource.query({ pageSize: 0 }, function (data) {
                    for (var k in data) {
                        if (data.hasOwnProperty(k) && k.substring(0, 1) !== "$")
                            roles[k] = data[k];
                    }
                }, function (err) {
                    notifications.error("Failed to load the roles", "Initialization error");
                }).$promise);
                promises.push(userResource.profile({}, function (data) {
                    var identity = {};
                    for (var k in data) {
                        if (data.hasOwnProperty(k) && k.substring(0, 1) !== "$")
                            identity[k] = data[k];
                    }
                    $rootScope.identity = identity;
                }, function (err) {
                    notifications.error("Failed to load the user profile", "Initialization error");
                }).$promise);
                promises.push(settingsResource.get({}, function (data) {
                    for (var k in data) {
                        if (data.hasOwnProperty(k) && k.substring(0, 1) !== "$")
                            appSettings[k] = data[k];
                    }
                }, function (err) {
                    notifications.error("Failed to load the application settings", "Initialization error");
                }).$promise);
                return $q.all(promises);
            }
        };
    }
    ;
    config.$inject = ["$urlRouterProvider", "$stateProvider", "$locationProvider", "$httpProvider", "$breadcrumbProvider"];
    function config($urlRouterProvider, $stateProvider, $locationProvider, $httpProvider, $breadcrumbProvider) {
        // configure routes
        setupRoutes($urlRouterProvider, $stateProvider, $locationProvider);
        // convert dates
        $httpProvider.defaults.transformResponse.push(function (responseData) {
            //var dateRegEx = /^[1-2]\d{3}-(0[1-9]|1[0-2])-([0-2][0-9]|3[0-1])T([0-1]\d|2[0-3]):([0-5]\d):([0-5]\d)Z{0,1}$/
            var dateRegEx = /^[1-2]\d{3}-(0[1-9]|1[0-2])-([0-2][0-9]|3[0-1])T([0-1]\d|2[0-3]):([0-5]\d):([0-5]\d)$/;
            function convertDateStringsToDates(input) {
                if (typeof input !== "object")
                    return input;
                for (var key in input) {
                    if (!input.hasOwnProperty(key))
                        continue;
                    var value = input[key];
                    var match;
                    // check for string properties which look like dates
                    if (typeof value === "string" && (match = value.match(dateRegEx))) {
                        var milliseconds = Date.parse(match[0]);
                        if (!isNaN(milliseconds)) {
                            input[key] = new Date(milliseconds);
                        }
                    }
                    else if (typeof value === "object") {
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
            $timeout(function () { window.scrollTo(0, 0); }, 0);
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
        }).state("app.accessdenied", {
            url: "/accessdenied",
            templateUrl: "/app/login/denied.html",
            data: { allowAny: true },
            ncyBreadcrumb: {
                skip: true
            }
        }).state("app.approvedisbursements", {
            url: "/disbursements/approve?searchText&fromDate&toDate&consultantId",
            templateUrl: "/app/disbursements/approve.html",
            controller: "approvedisbursements",
            controllerAs: "vm",
            data: { allowAny: true },
            ncyBreadcrumb: {
                parent: "app.home",
                label: "Approve Disbursements"
            }
        }).state("app.calendar", {
            url: "/calendar",
            templateUrl: "/app/calendar/calendar.html",
            controller: "calendar",
            controllerAs: "vm",
            data: { allowAny: true },
            ncyBreadcrumb: {
                label: "Calendar"
            }
        }).state("app.client", {
            url: "/clients/:clientId",
            templateUrl: "/app/clients/client.html",
            controller: "client",
            controllerAs: "vm",
            data: { allowAny: true },
            ncyBreadcrumb: {
                label: "{{vm.client.name}}"
            }
        }).state("app.clients", {
            url: "/clients?searchText",
            templateUrl: "/app/clients/clients.html",
            controller: "clients",
            controllerAs: "vm",
            data: { allowAny: true },
            ncyBreadcrumb: {
                label: "Clients"
            }
        }).state("app.clientType", {
            url: "/clienttypes/:clientTypeId",
            templateUrl: "/app/clienttypes/clienttype.html",
            controller: "clientType",
            controllerAs: "vm",
            data: {
                roles: ["Administrator"]
            },
            ncyBreadcrumb: {
                parent: "app.clientTypes",
                label: "{{vm.clientType.name}}"
            }
        }).state("app.clientTypes", {
            url: "/clienttypes?searchText",
            templateUrl: "/app/clienttypes/clienttypes.html",
            controller: "clientTypes",
            controllerAs: "vm",
            data: {
                roles: ["Administrator"]
            },
            ncyBreadcrumb: {
                label: "Client Type"
            }
        }).state("app.consultant", {
            url: "/consultants/:consultantId",
            templateUrl: "/app/consultants/consultant.html",
            controller: "consultant",
            controllerAs: "vm",
            data: {
                roles: ["Administrator"]
            },
            ncyBreadcrumb: {
                parent: "app.consultants",
                label: "{{vm.consultant.firstName + ' ' + vm.consultant.lastName}}"
            }
        }).state("app.consultants", {
            url: "/consultants?searchText",
            templateUrl: "/app/consultants/consultants.html",
            controller: "consultants",
            controllerAs: "vm",
            data: {
                roles: ["Administrator"]
            },
            ncyBreadcrumb: {
                label: "Consultants"
            }
        }).state("app.consultantmonths", {
            url: "/consultantmonths",
            templateUrl: "/app/consultantmonths/consultantmonths.html",
            controller: "consultantMonths",
            controllerAs: "vm",
            data: {
                roles: ["Administrator"]
            },
            ncyBreadcrumb: {
                label: "Consultant Months"
            }
        }).state("app.disbursement", {
            url: "/disbursementbatches/:disbursementBatchId/:disbursementId",
            templateUrl: "/app/disbursements/disbursement.html",
            controller: "disbursement",
            controllerAs: "vm",
            data: { allowAny: true },
            ncyBreadcrumb: {
                parent: "app.disbursementBatch",
                label: "{{vm.disbursement.date | date:'d MMM yyyy:'}} {{vm.disbursement.description}}"
            }
        }).state("app.disbursements", {
            url: "/disbursements?searchText&fromDate&toDate&consultantId&state",
            templateUrl: "/app/disbursements/disbursements.html",
            controller: "disbursements",
            controllerAs: "vm",
            data: { allowAny: true },
            ncyBreadcrumb: {
                parent: "app.home",
                label: "Disbursements"
            }
        }).state("app.disbursementBatch", {
            url: "/disbursementbatches/:disbursementBatchId",
            templateUrl: "/app/disbursementbatches/disbursementbatch.html",
            controller: "disbursementBatch",
            controllerAs: "vm",
            data: { allowAny: true },
            ncyBreadcrumb: {
                parent: "app.disbursementBatches",
                label: "{{vm.disbursementBatch.disbursementBatchId}}"
            }
        }).state("app.disbursementBatches", {
            url: "/disbursementbatches?searchText&fromDate&toDate&consultantId",
            templateUrl: "/app/disbursementbatches/disbursementbatches.html",
            controller: "disbursementBatches",
            controllerAs: "vm",
            data: { allowAny: true },
            ncyBreadcrumb: {
                parent: "app.home",
                label: "Disbursement Batches"
            }
        }).state("app.disbursementBudget", {
            url: "/clients/:clientId/projects/:projectId/milestones/:milestoneId/disbursementbudgets/:disbursementBudgetId",
            templateUrl: "/app/disbursementbudgets/disbursementbudget.html",
            controller: "disbursementBudget",
            controllerAs: "vm",
            data: { allowAny: true },
            ncyBreadcrumb: {
                parent: "app.milestone",
                label: "{{vm.disbursementBudget.expenditureType.name}}: {{vm.disbursementBudget.description}}"
            }
        }).state("app.expenditureType", {
            url: "/expendituretypes/:expenditureTypeId",
            templateUrl: "/app/expendituretypes/expendituretype.html",
            controller: "expenditureType",
            controllerAs: "vm",
            data: {
                roles: ["Administrator"]
            },
            ncyBreadcrumb: {
                parent: "app.expenditureTypes",
                label: "{{vm.expenditureType.name}}"
            }
        }).state("app.expenditureTypes", {
            url: "/expendituretypes?searchText",
            templateUrl: "/app/expendituretypes/expendituretypes.html",
            controller: "expenditureTypes",
            controllerAs: "vm",
            data: {
                roles: ["Administrator"]
            },
            ncyBreadcrumb: {
                label: "Expenditure Types"
            }
        }).state("app.invoice", {
            url: "/clients/:clientId/projects/:projectId/invoices/:invoiceId",
            templateUrl: "/app/invoices/invoice.html",
            controller: "invoice",
            controllerAs: "vm",
            data: { allowAny: true },
            ncyBreadcrumb: {
                parent: "app.project",
                label: "{{vm.invoice.invoiceNumber}}"
            }
        }).state("app.invoices", {
            url: "/invoices?searchText&state",
            templateUrl: "/app/invoices/invoices.html",
            controller: "invoices",
            controllerAs: "vm",
            data: { allowAny: true },
            ncyBreadcrumb: {
                parent: "app.home",
                label: "Invoices"
            }
        }).state("app.lineItem", {
            url: "/clients/:clientId/projects/:projectId/invoices/:invoiceId/lineitems/:lineItemId",
            templateUrl: "/app/lineitems/lineitem.html",
            controller: "lineItem",
            controllerAs: "vm",
            data: { allowAny: true },
            ncyBreadcrumb: {
                parent: "app.invoice",
                label: "{{vm.lineItem.description}}"
            }
        }).state("app.milestone", {
            url: "/clients/:clientId/projects/:projectId/milestones/:milestoneId",
            templateUrl: "/app/milestones/milestone.html",
            controller: "milestone",
            controllerAs: "vm",
            data: { allowAny: true },
            ncyBreadcrumb: {
                parent: "app.project",
                label: "{{vm.milestone.name}}"
            }
        }).state("app.milestones", {
            url: "/milestones?searchText",
            templateUrl: "/app/milestones/milestones.html",
            controller: "milestones",
            controllerAs: "vm",
            data: { allowAny: true },
            ncyBreadcrumb: {
                parent: "app.home",
                label: "Milestones"
            }
        }).state("app.pastelAccount", {
            url: "/pastelaccounts/:pastelAccountId",
            templateUrl: "/app/pastelaccounts/pastelaccount.html",
            controller: "pastelAccount",
            controllerAs: "vm",
            data: {
                roles: ["Administrator"]
            },
            ncyBreadcrumb: {
                parent: "app.pastelAccounts",
                label: "{{vm.pastelAccount.account}}"
            }
        }).state("app.pastelAccounts", {
            url: "/pastelaccounts?searchText",
            templateUrl: "/app/pastelaccounts/pastelaccounts.html",
            controller: "pastelAccounts",
            controllerAs: "vm",
            data: {
                roles: ["Administrator"]
            },
            ncyBreadcrumb: {
                label: "Pastel Accounts"
            }
        }).state("app.pastelCreditor", {
            url: "/pastelcreditors/:pastelCreditorId",
            templateUrl: "/app/pastelcreditors/pastelcreditor.html",
            controller: "pastelCreditor",
            controllerAs: "vm",
            data: {
                roles: ["Administrator"]
            },
            ncyBreadcrumb: {
                parent: "app.pastelCreditors",
                label: "{{vm.pastelCreditor.creditorCode}}"
            }
        }).state("app.pastelCreditors", {
            url: "/pastelcreditors?searchText",
            templateUrl: "/app/pastelcreditors/pastelcreditors.html",
            controller: "pastelCreditors",
            controllerAs: "vm",
            data: {
                roles: ["Administrator"]
            },
            ncyBreadcrumb: {
                label: "Pastel Creditors"
            }
        }).state("app.practiceArea", {
            url: "/practiceareas/:practiceAreaId",
            templateUrl: "/app/practiceareas/practicearea.html",
            controller: "practiceArea",
            controllerAs: "vm",
            data: {
                roles: ["Administrator"]
            },
            ncyBreadcrumb: {
                parent: "app.practiceAreas",
                label: "{{vm.practiceArea.mainPracticeArea + ': ' + vm.practiceArea.subPracticeArea}}"
            }
        }).state("app.practiceAreas", {
            url: "/practiceareas?searchText",
            templateUrl: "/app/practiceareas/practiceareas.html",
            controller: "practiceAreas",
            controllerAs: "vm",
            data: {
                roles: ["Administrator"]
            },
            ncyBreadcrumb: {
                label: "Practice Area"
            }
        }).state("app.project", {
            url: "/clients/:clientId/projects/:projectId",
            templateUrl: "/app/projects/project.html",
            controller: "project",
            controllerAs: "vm",
            data: { allowAny: true },
            ncyBreadcrumb: {
                parent: "app.client",
                label: "{{vm.project.code}}"
            }
        }).state("app.projects", {
            url: "/projects?searchText&statusId&clientId&fromDate&toDate",
            templateUrl: "/app/projects/projects.html",
            controller: "projects",
            controllerAs: "vm",
            data: { allowAny: true },
            ncyBreadcrumb: {
                label: "Projects"
            }
        }).state("app.projectType", {
            url: "/projecttypes/:projectTypeId",
            templateUrl: "/app/projecttypes/projecttype.html",
            controller: "projectType",
            controllerAs: "vm",
            data: {
                roles: ["Administrator"]
            },
            ncyBreadcrumb: {
                parent: "app.projectTypes",
                label: "{{vm.projectType.name}}"
            }
        }).state("app.projectTypes", {
            url: "/projecttypes?searchText",
            templateUrl: "/app/projecttypes/projecttypes.html",
            controller: "projectTypes",
            controllerAs: "vm",
            data: {
                roles: ["Administrator"]
            },
            ncyBreadcrumb: {
                label: "Project Types"
            }
        }).state("app.rate", {
            url: "/consultants/:consultantId/rates/:rateId?s",
            templateUrl: "/app/rates/rate.html",
            controller: "rate",
            controllerAs: "vm",
            data: { allowAny: true },
            ncyBreadcrumb: {
                //todo: when this is from myrates, then the parent can't be consultant, must be myrates
                parent: "app.consultant",
                // todo: rate type?
                label: "Rates"
            }
        }).state("app.reports", {
            url: "/reports",
            templateUrl: "/app/reports/reports.html",
            controller: "reports",
            controllerAs: "vm",
            data: { allowAny: true },
            ncyBreadcrumb: {
                parent: "app.home",
                label: "Reports"
            }
        }).state("app.search", {
            url: "/search?q",
            templateUrl: "/app/search/search.html",
            controller: "search",
            controllerAs: "vm",
            data: { allowAny: true },
            ncyBreadcrumb: {
                label: "Search"
            }
        }).state("app.time", {
            url: "/clients/:clientId/projects/:projectId/milestones/:milestoneId/times/:timeId",
            templateUrl: "/app/times/time.html",
            controller: "time",
            controllerAs: "vm",
            data: { allowAny: true },
            ncyBreadcrumb: {
                parent: "app.milestone",
                label: "{{vm.time.date | date:'d MMM yyyy:'}} {{vm.time.description}}"
            }
        }).state("app.times", {
            url: "/times?searchText&fromDate&toDate&consultantId",
            templateUrl: "/app/times/times.html",
            controller: "times",
            controllerAs: "vm",
            data: { allowAny: true },
            ncyBreadcrumb: {
                label: "Times"
            }
        }).state("app.timeBudget", {
            url: "/clients/:clientId/projects/:projectId/milestones/:milestoneId/timebudgets/:timeBudgetId",
            templateUrl: "/app/timebudgets/timebudget.html",
            controller: "timeBudget",
            controllerAs: "vm",
            data: { allowAny: true },
            ncyBreadcrumb: {
                parent: "app.milestone",
                // todo: consultant is not set on isNew until saved, so won't show in breadcrumb. check isNew here?
                label: "{{vm.timeBudget.consultant.firstName + ' ' + vm.timeBudget.consultant.lastName}}: {{vm.timeBudget.description}}"
            }
        }).state("app.timeSheet", {
            url: "/timesheet",
            templateUrl: "/app/timesheet/timesheet.html",
            controller: "timeSheet",
            controllerAs: "vm",
            data: { allowAny: true },
            ncyBreadcrumb: {
                label: "Time Sheet"
            }
        }).state("app.timePlan", {
            url: "/timeplan",
            templateUrl: "/app/timeplans/timeplan.html",
            controller: "timePlan",
            controllerAs: "vm",
            data: { allowAny: true },
            ncyBreadcrumb: {
                label: "Time Plan"
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
}());
