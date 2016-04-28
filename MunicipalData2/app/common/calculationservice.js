/// <reference path="../../scripts/typings/angularjs/angular.d.ts" />
(function () {
    "use strict";
    angular
        .module("app")
        .factory("calculationService", calculationService);
    calculationService.$inject = [];
    function calculationService() {
        var service = {
            getDisbursementTotals: getDisbursementTotals,
            getTimeTotals: getTimeTotals,
            getLineItemTotals: getLineItemTotals,
            getTimeBudgetTotals: getTimeBudgetTotals,
            getDisbursementBudgetTotals: getDisbursementBudgetTotals
        };
        return service;
        function getDisbursementBudgetTotals(timeBudgets) {
            var result = {
                total: 0
            };
            for (var i = 0; i < timeBudgets.length; i++) {
                result.total += timeBudgets[i].amount;
            }
            return result;
        }
        function getTimeBudgetTotals(timeBudgets) {
            var result = {
                totalMinutes: 0
            };
            for (var i = 0; i < timeBudgets.length; i++) {
                result.totalMinutes += timeBudgets[i].minutes;
            }
            return result;
        }
        function getTimeTotals(times) {
            var result = {
                billableMinutes: 0,
                nonBillableMinutes: 0,
                billableAmount: 0,
                nonBillableAmount: 0
            };
            for (var i = 0; i < times.length; i++) {
                if (times[i].isBillable) {
                    result.billableMinutes += times[i].minutes;
                    result.billableAmount += times[i].minutes * times[i].rate / 60;
                }
                else {
                    result.nonBillableMinutes += times[i].minutes;
                    result.nonBillableAmount += times[i].minutes * times[i].rate / 60;
                }
            }
            return result;
        }
        function getDisbursementTotals(disbursements) {
            if (disbursements == null)
                return null;
            // in case just one item passed
            if (Object.prototype.toString.call(disbursements) !== '[object Array]')
                disbursements = [disbursements];
            var result = {
                billableExcludingVAT: 0,
                billableExemptVAT: 0,
                billableVAT: 0,
                billableTotal: 0,
                reimbursableExcludingVAT: 0,
                reimbursableExemptVAT: 0,
                reimbursableVAT: 0,
                reimbursableTotal: 0
            };
            for (var i = 0; i < disbursements.length; i++) {
                var disbursement = disbursements[i];
                // billable
                result.billableExcludingVAT += disbursement.billableExcludingVAT;
                result.billableExemptVAT += disbursement.billableExemptVAT;
                result.billableVAT += disbursement.billableVAT;
                // reimbursable
                result.reimbursableExcludingVAT += disbursement.reimbursableExcludingVAT;
                result.reimbursableExemptVAT += disbursement.reimbursableExemptVAT;
                result.reimbursableVAT += disbursement.reimbursableVAT;
            }
            result.billableTotal = result.billableExcludingVAT + result.billableExemptVAT + result.billableVAT;
            result.reimbursableTotal = result.reimbursableExcludingVAT + result.reimbursableExemptVAT + result.reimbursableVAT;
            return result;
        }
        function getLineItemTotals(lineItems) {
            var result = {
                excludingVAT: 0,
                exemptVAT: 0,
                vat: 0,
                total: 0
            };
            for (var i = 0; i < lineItems.length; i++) {
                result.excludingVAT += lineItems[i].excludingVAT;
                result.exemptVAT += lineItems[i].exemptVAT;
                result.vat += lineItems[i].vat;
            }
            result.total = result.excludingVAT + result.exemptVAT + result.vat;
            return result;
        }
    }
    ;
}());
