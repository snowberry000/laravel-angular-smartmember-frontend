app.directive('resize', function ($window) {
	return function (scope, element, attr) {

		var w = angular.element($window);
		scope.$watch(function () {
			return {
				'h': w.height(),
				'w': w.width()
			};
		}, function (newValue, oldValue) {
			scope.windowHeight = newValue.h;
			scope.windowWidth = newValue.w;

			scope.IsWidescreen = function () {

				return scope.windowWidth > 1282 ? true : false;
			};

			scope.IsMobile = function() {

				return scope.windowWidth > 767 ? true : false;
			};

		}, true);

		w.bind('resize', function () {
			scope.$apply();
		});
	}
});