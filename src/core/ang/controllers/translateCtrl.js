app.controller('translateCtrl', function ($scope,$translate) {

	$scope.changeLanguage = function (langKey) {
		$translate.use(langKey);
	};
});