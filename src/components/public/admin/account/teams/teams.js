var app = angular.module("app");

app.config(function($stateProvider){
	$stateProvider
		.state("public.admin.account.teams",{
			url: "/teams",
			templateUrl: "/templates/components/public/admin/account/teams/teams.html",
			controller: "TeamsController"
		})
}); 

app.controller("TeamsController", function ($scope, $rootScope, $localStorage, $location ,Restangular, $window) {
	Restangular.one( 'company/getUsersCompanies' ).get().then(function(response){
		$scope.teams = response;
	})
	$user = $rootScope.user;
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