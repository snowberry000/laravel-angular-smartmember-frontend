app.controller('AccountTeamsList', function ($scope, $rootScope, $companies, $localStorage, $location, $user ,Restangular, $window, $modal, notify) {

	$scope.teams = $companies;

	$scope.ChangeTeam = function(company)
	{
		Restangular.one('user/setCompany').customPOST({'current_company_id' : company.id}).then(function(response){

			var pieces = $rootScope.app.domain.split('.');

			$window.location.href = '//' + (pieces[0] == 'smartmember' ? 'my.' : '') + $rootScope.app.rootDomain + '/admin/team/dashboard';

		});

		if (typeof $scope.current_company != 'undefined' && typeof $scope.current_company.id != 'undefined' && company.id == $scope.current_company.id) return;
		Restangular.one('user/setCompany').customPOST({'current_company_id' : company.id}).then(function(response){

			var pieces = $rootScope.app.domain.split('.');

			$window.location.href = '//' + (pieces[0] == 'smartmember' ? 'my.' : '') + $rootScope.app.rootDomain + '/admin/team/dashboard';

		});
	}

});
