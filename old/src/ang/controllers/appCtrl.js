app.controller('AppController', function ($scope, $rootScope, $localStorage, Restangular) {
	$scope.$user = $localStorage.user;
	var options = Restangular.all("siteMetaData");
	var page = Restangular.all("site");
	$scope.options = {};
	$scope.access_level_types = [
		{id: 1, name: 'Free'},
		{id: 2, name: 'Locked'},
		{id: 3, name: 'Private'},
		{id: 4, name: 'Member'}
	];

	$scope.logout = function () {
		$localStorage.user = false;
		$rootScope.$storage = $localStorage;
	}

	$scope.isLoggedIn = function () {
		if ($localStorage.user && $localStorage.user.id) {
			return true;
		}
		return false;
	}
	$scope.init = function () {

		Restangular.one('site', 'details').get().then(function (details) {
			if (details) {
				$.each(details.meta_data, function (key, data) {
					$scope.options[data.key] = data.value;
				});
				if (details.menu_items)
					$scope.options.menu_items = details.menu_items;
				if (details.footer_menu_items)
					$scope.options.footer_menu_items = details.footer_menu_items;
				$scope.site = details;
			}
			$scope.ads = details.ad;

		});

	};
});