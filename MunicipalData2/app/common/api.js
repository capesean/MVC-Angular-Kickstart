/// <reference path="../../scripts/typings/angularjs/angular.d.ts" />
// todo: consider restangular or breeze?
(function () {
    "use strict";
    angular
        .module("app")
        .factory("calendarResource", calendarResource)
        .factory("clientResource", clientResource)
        .factory("clientTypeResource", clientTypeResource)
        .factory("consultantResource", consultantResource)
        .factory("consultantMonthResource", consultantMonthResource)
        .factory("disbursementResource", disbursementResource)
        .factory("disbursementBatchResource", disbursementBatchResource)
        .factory("disbursementBudgetResource", disbursementBudgetResource)
        .factory("expenditureTypeResource", expenditureTypeResource)
        .factory("invoiceResource", invoiceResource)
        .factory("lineItemResource", lineItemResource)
        .factory("milestoneResource", milestoneResource)
        .factory("milestoneSummariesResource", milestoneSummariesResource)
        .factory("pastelAccountResource", pastelAccountResource)
        .factory("pastelCreditorResource", pastelCreditorResource)
        .factory("pinnedItemResource", pinnedItemResource)
        .factory("practiceAreaResource", practiceAreaResource)
        .factory("projectResource", projectResource)
        .factory("projectSummariesResource", projectSummariesResource)
        .factory("projectTeamResource", projectTeamResource)
        .factory("projectTypeResource", projectTypeResource)
        .factory("rateResource", rateResource)
        .factory("roleResource", roleResource)
        .factory("settingsResource", settingsResource)
        .factory("timeResource", timeResource)
        .factory("timeBudgetResource", timeBudgetResource)
        .factory("timePlanResource", timePlanResource)
        .factory("timeSheetResource", timeSheetResource)
        .factory("userResource", userResource)
        .factory("api", api);
    //#region calendar resource
    calendarResource.$inject = ["$resource", "appSettings"];
    function calendarResource($resource, appSettings) {
        return $resource(appSettings.apiServiceBaseUri + appSettings.apiPrefix + "calendar/:date");
    }
    //#endregion
    //#region client resource
    clientResource.$inject = ["$resource", "appSettings"];
    function clientResource($resource, appSettings) {
        return $resource(appSettings.apiServiceBaseUri + appSettings.apiPrefix + "clients/:clientId", { clientId: "@clientId" }, {
            list: {
                method: "GET",
                url: appSettings.apiServiceBaseUri + appSettings.apiPrefix + "clients/list",
                isArray: true
            }
        });
    }
    //#endregion
    //#region client type resource
    clientTypeResource.$inject = ["$resource", "appSettings"];
    function clientTypeResource($resource, appSettings) {
        return $resource(appSettings.apiServiceBaseUri + appSettings.apiPrefix + "clienttypes/:clientTypeId", { clientTypeId: "@clientTypeId" });
    }
    //#endregion
    //#region consultant resource
    consultantResource.$inject = ["$resource", "appSettings"];
    function consultantResource($resource, appSettings) {
        return $resource(appSettings.apiServiceBaseUri + appSettings.apiPrefix + "consultants/:consultantId", { consultantId: "@consultantId" });
    }
    //#endregion
    //#region consultant resource
    consultantMonthResource.$inject = ["$resource", "appSettings"];
    function consultantMonthResource($resource, appSettings) {
        return $resource(appSettings.apiServiceBaseUri + appSettings.apiPrefix + "consultantmonths/:consultantId/:year/:month", {
            consultantId: "@consultantId",
            year: "@year",
            month: "@month"
        }, {
            byConsultant: {
                method: "GET",
                url: appSettings.apiServiceBaseUri + appSettings.apiPrefix + "consultantmonths/byconsultant/:consultantId/:year",
                isArray: true
            },
            byMonth: {
                method: "GET",
                url: appSettings.apiServiceBaseUri + appSettings.apiPrefix + "consultantmonths/bymonth/:year/:month",
                isArray: true
            }
        });
    }
    //#endregion
    //#region disbursement resource
    disbursementResource.$inject = ["$resource", "appSettings"];
    function disbursementResource($resource, appSettings) {
        return $resource(appSettings.apiServiceBaseUri + appSettings.apiPrefix + "disbursements/:disbursementId", { disbursementId: "@disbursementId" }, {
            approve: {
                method: "POST",
                url: appSettings.apiServiceBaseUri + appSettings.apiPrefix + "disbursements/approve"
            }
        });
    }
    //#endregion
    //#region disbursement batch resource
    disbursementBatchResource.$inject = ["$resource", "appSettings"];
    function disbursementBatchResource($resource, appSettings) {
        return $resource(appSettings.apiServiceBaseUri + appSettings.apiPrefix + "disbursementbatches/:disbursementBatchId", { disbursementBatchId: "@disbursementBatchId" });
    }
    //#endregion
    //#region disbursement budget resource
    disbursementBudgetResource.$inject = ["$resource", "appSettings"];
    function disbursementBudgetResource($resource, appSettings) {
        return $resource(appSettings.apiServiceBaseUri + appSettings.apiPrefix + "disbursementbudgets/:disbursementBudgetId", { disbursementBudgetId: "@disbursementBudgetId" });
    }
    //#endregion
    //#region expenditure type resource
    expenditureTypeResource.$inject = ["$resource", "appSettings"];
    function expenditureTypeResource($resource, appSettings) {
        return $resource(appSettings.apiServiceBaseUri + appSettings.apiPrefix + "expendituretypes/:expenditureTypeId", { expenditureTypeId: "@expenditureTypeId" });
    }
    //#endregion
    //#region invoice resource
    invoiceResource.$inject = ["$resource", "appSettings"];
    function invoiceResource($resource, appSettings) {
        return $resource(appSettings.apiServiceBaseUri + appSettings.apiPrefix + "invoices/:invoiceId", { invoiceId: "@invoiceId" }, {
            detachTimes: {
                method: "POST",
                url: appSettings.apiServiceBaseUri + appSettings.apiPrefix + "invoices/:invoiceId/detachTimes"
            },
            attachTimes: {
                method: "POST",
                url: appSettings.apiServiceBaseUri + appSettings.apiPrefix + "invoices/:invoiceId/attachTimes"
            },
            detachDisbursements: {
                method: "POST",
                url: appSettings.apiServiceBaseUri + appSettings.apiPrefix + "invoices/:invoiceId/detachDisbursements"
            },
            attachDisbursements: {
                method: "POST",
                url: appSettings.apiServiceBaseUri + appSettings.apiPrefix + "invoices/:invoiceId/attachDisbursements"
            },
            reorderLineItems: {
                method: "POST",
                url: appSettings.apiServiceBaseUri + appSettings.apiPrefix + "invoices/:invoiceId/reorderlineitems"
            },
            finalize: {
                method: "POST",
                url: appSettings.apiServiceBaseUri + appSettings.apiPrefix + "invoices/:invoiceId/finalize"
            }
        });
    }
    //#endregion
    //#region lineItem resource
    lineItemResource.$inject = ["$resource", "appSettings"];
    function lineItemResource($resource, appSettings) {
        return $resource(appSettings.apiServiceBaseUri + appSettings.apiPrefix + "lineItems/:lineItemId", {
            lineItemId: "@lineItemId"
        });
    }
    //#endregion
    //#region milestone resource
    milestoneResource.$inject = ["$resource", "appSettings"];
    function milestoneResource($resource, appSettings) {
        return $resource(appSettings.apiServiceBaseUri + appSettings.apiPrefix + "milestones/:milestoneId", { milestoneId: "@milestoneId" }, {
            getBalance: {
                url: appSettings.apiServiceBaseUri + appSettings.apiPrefix + "milestones/:milestoneId/balance"
            }
        });
    }
    //#endregion
    //#region milestone summaries resource
    milestoneSummariesResource.$inject = ["$resource", "appSettings"];
    function milestoneSummariesResource($resource, appSettings) {
        return $resource(appSettings.apiServiceBaseUri + appSettings.apiPrefix + "milestonesummaries/:milestoneId", { milestoneId: "@milestoneId" }, {
            timeByMonth: {
                method: "GET",
                url: appSettings.apiServiceBaseUri + appSettings.apiPrefix + "milestonesummaries/timebymonth",
                isArray: true
            }
        });
    }
    //#endregion
    //#region expenditure type resource
    pinnedItemResource.$inject = ["$resource", "appSettings"];
    function pinnedItemResource($resource, appSettings) {
        return $resource(appSettings.apiServiceBaseUri + appSettings.apiPrefix + "pinneditems/:pinnedItemId");
    }
    //#endregion
    //#region pastel account resource
    pastelAccountResource.$inject = ["$resource", "appSettings"];
    function pastelAccountResource($resource, appSettings) {
        return $resource(appSettings.apiServiceBaseUri + appSettings.apiPrefix + "pastelaccounts/:pastelAccountId", { pastelAccountId: "@pastelAccountId" });
    }
    //#endregion
    //#region pastel creditor resource
    pastelCreditorResource.$inject = ["$resource", "appSettings"];
    function pastelCreditorResource($resource, appSettings) {
        return $resource(appSettings.apiServiceBaseUri + appSettings.apiPrefix + "pastelcreditors/:pastelCreditorId", { pastelCreditorId: "@pastelCreditorId" });
    }
    //#endregion
    //#region practiceArea resource
    practiceAreaResource.$inject = ["$resource", "appSettings"];
    function practiceAreaResource($resource, appSettings) {
        return $resource(appSettings.apiServiceBaseUri + appSettings.apiPrefix + "practiceareas/:practiceAreaId", { practiceAreaId: "@practiceAreaId" });
    }
    //#endregion
    //#region project resource
    projectResource.$inject = ["$resource", "appSettings"];
    function projectResource($resource, appSettings) {
        return $resource(appSettings.apiServiceBaseUri + appSettings.apiPrefix + "projects/:projectId", { projectId: "@projectId" }, {
            list: {
                method: "GET",
                url: appSettings.apiServiceBaseUri + appSettings.apiPrefix + "projects/list",
                isArray: true
            },
            reorderMilestones: {
                method: "POST",
                url: appSettings.apiServiceBaseUri + appSettings.apiPrefix + "projects/:projectId/reordermilestones"
            }
        });
    }
    ;
    //#endregion
    //#region project summaries resource
    projectSummariesResource.$inject = ["$resource", "appSettings"];
    function projectSummariesResource($resource, appSettings) {
        return $resource(appSettings.apiServiceBaseUri + appSettings.apiPrefix + "projectsummaries/:projectId");
    }
    //#endregion
    //#region project team resource
    projectTeamResource.$inject = ["$resource", "appSettings"];
    function projectTeamResource($resource, appSettings) {
        return $resource(appSettings.apiServiceBaseUri + appSettings.apiPrefix + "projectteams/:projectId/:consultantId", {
            projectId: "@projectId",
            consultantId: "@consultantId"
        }, {
            deleteTeam: {
                method: "DELETE",
                url: appSettings.apiServiceBaseUri + appSettings.apiPrefix + "projectteams/:projectId"
            }
        });
    }
    ;
    //#endregion
    //#region projectType resource
    projectTypeResource.$inject = ["$resource", "appSettings"];
    function projectTypeResource($resource, appSettings) {
        return $resource(appSettings.apiServiceBaseUri + appSettings.apiPrefix + "projecttypes/:projectTypeId", { projectTypeId: "@projectTypeId" });
    }
    //#endregion
    //#region rate resource
    rateResource.$inject = ["$resource", "appSettings"];
    function rateResource($resource, appSettings) {
        return $resource(appSettings.apiServiceBaseUri + appSettings.apiPrefix + "rates/:rateId", { rateId: "@rateId" }, {
            getApplicableRate: {
                method: "GET",
                url: appSettings.apiServiceBaseUri + appSettings.apiPrefix + "rates/projectId/:projectId"
            }
        });
    }
    //#endregion
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
    //#region time resource
    timeResource.$inject = ["$resource", "appSettings"];
    function timeResource($resource, appSettings) {
        return $resource(appSettings.apiServiceBaseUri + appSettings.apiPrefix + "times/:timeId", { timeId: "@timeId" });
    }
    //#endregion
    //#region time budget resource
    timeBudgetResource.$inject = ["$resource", "appSettings"];
    function timeBudgetResource($resource, appSettings) {
        return $resource(appSettings.apiServiceBaseUri + appSettings.apiPrefix + "timebudgets/:timeBudgetId", {
            timeBudgetId: "@timeBudgetId"
        });
    }
    //#endregion
    //#region time plan resource
    timePlanResource.$inject = ["$resource", "appSettings"];
    function timePlanResource($resource, appSettings) {
        return $resource(appSettings.apiServiceBaseUri + appSettings.apiPrefix + "timeplans/:consultantId/:milestoneId/:year/:month", {
            consultantId: "@consultantId",
            milestoneId: "@milestoneId",
            year: "@year",
            month: "@month"
        }, {
            getTimePlans: {
                method: "GET",
                url: appSettings.apiServiceBaseUri + appSettings.apiPrefix + "timeplans/fetch/:consultantId",
                isArray: true
            },
            getTimePlanMilestones: {
                method: "GET",
                url: appSettings.apiServiceBaseUri + appSettings.apiPrefix + "timeplans/milestones/:consultantId/:year/:month/:numberOfMonths",
                isArray: true
            }
        });
    }
    //#endregion
    //#region time sheet resource
    timeSheetResource.$inject = ["$resource", "appSettings"];
    function timeSheetResource($resource, appSettings) {
        return $resource(appSettings.apiServiceBaseUri + appSettings.apiPrefix + "timesheets/", {
            year: "@year",
            month: "@month",
            day: "@day"
        }, {
            getMilestones: {
                method: "GET",
                url: appSettings.apiServiceBaseUri + appSettings.apiPrefix + "timesheets/milestones/:year/:month/:day",
                isArray: true
            }
        });
    }
    //#endregion
    //#region user resource
    userResource.$inject = ["$resource", "appSettings"];
    function userResource($resource, appSettings) {
        return $resource(appSettings.apiServiceBaseUri + appSettings.apiPrefix + "users/:id", { id: "@id" }, {
            profile: {
                method: "GET",
                url: appSettings.apiServiceBaseUri + appSettings.apiPrefix + "users/:id/profile"
            }
        });
    }
    //#endregion
    //#region api
    api.$inject = ["$resource", "appSettings"];
    function api($resource, appSettings) {
        var projectSummary = $resource(appSettings.apiServiceBaseUri + appSettings.apiPrefix + "projects/:projectId/summary", { projectId: "@projectId" });
        var service = {
            // project summary
            getProjectSummary: getProjectSummary
        };
        return service;
        //#region projectSummary
        function getProjectSummary(projectId) {
            return projectSummary.get({ projectId: projectId });
        }
        //#endregion
    }
    ;
    //#endregion
}());
