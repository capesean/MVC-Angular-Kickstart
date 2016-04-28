/// <reference path="../../scripts/typings/angularjs/angular.d.ts" />
(function () {
    "use strict";
    angular
        .module("app")
        .filter("yesNo", function () { return function (text) { return text ? "Yes" : "No"; }; })
        .filter("hoursMinutes", function () {
        return function (mins) {
            if (mins == 0)
                return "0 mins";
            var hours = ((mins - (mins % 60)) / 60);
            var minutes = (mins % 60);
            return (hours > 0 ? hours + " hr" + (hours === 1 ? "" : "s") : "") + (minutes > 0 ? " " + minutes + " min" + (minutes === 1 ? "" : "s") : "");
        };
    })
        .filter("decimal", function () {
        return function (val, decimalPlaces) {
            decimalPlaces = decimalPlaces || 2;
            return Math.round(val * Math.pow(10, decimalPlaces)) / Math.pow(10, decimalPlaces);
        };
    })
        .filter("decimalTime", function () {
        return function (mins, decimalPlaces) {
            if (mins === undefined)
                return "";
            decimalPlaces = decimalPlaces || 2;
            var minutes = mins % 60;
            var hours = (mins - minutes) / 60;
            return (Math.round((hours + minutes / 60) * Math.pow(10, decimalPlaces)) / Math.pow(10, decimalPlaces)) + " hrs";
            //return (hours + minutes / 60).toFixed(decimalPlaces) + " hrs";
        };
    })
        .filter("monthName", function () {
        return function (monthNumber) {
            var monthNames = ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"];
            return monthNames[monthNumber];
        };
    })
        .filter("monthNameAbbreviated", function () {
        return function (monthNumber) {
            var monthNames = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];
            return monthNames[monthNumber];
        };
    })
        .filter("yearAbbreviated", function () {
        return function (year) {
            return (year + "").substring(2, 4);
        };
    })
        .filter("toLocaleDateString", function () {
        return function (item) {
            if (item === undefined)
                return null;
            return new Date(item).toLocaleDateString("en-GB"); //todo: should be set by user/app
        };
    })
        .filter("isInternal", function () {
        return function (items, isInternal) {
            var filtered = [];
            angular.forEach(items, function (item) {
                if (isInternal === (item.project ? item.project.isInternal : item.milestone.project.isInternal)) {
                    filtered.push(item);
                }
            });
            return filtered;
        };
    })
        .filter("personDays", function () {
        return function (mins) {
            var hours = mins / 60 / 8; // todo: move this hoursPerDay into appSettings, but how to inject here though?
            return Math.round(hours * 10) / 10 + " person days";
        };
    });
})();
