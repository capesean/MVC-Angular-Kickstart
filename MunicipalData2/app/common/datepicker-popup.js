//// ensure that datepickers display correctly formatted date in initial state
//angular.module("app").directive("datepickerPopup", function () {
//	return {
//		restrict: "EAC",
//		require: "ngModel",
//		link: function (scope, element, attr, controller) {
//			controller.$formatters.shift();
//		}
//	}
//});

//angular.module("app").directive("myDate", function (dateFilter) {
//	return {
//		restrict: "EAC",
//		require: "?ngModel",
//		link: function (scope, element, attrs, ngModel) {
//			ngModel.$parsers.push(function (viewValue) {
//				return dateFilter(viewValue, "yyyy");
//			});
//		}
//	}
//}	);