var app = angular.module("app");

app.config(function($stateProvider){
	$stateProvider.state("admin.app.company-settings",{
		redirectTo: 'admin.app.company-settings.team',
		url: '/company-settings',
		templateUrl: '/templates/components/admin/app/company-settings/company-settings.html',
		controller: 'CompanySettingsController'
	});
})

app.controller("CompanySettingsController", function($rootScope, $scope, $localStorage, toastr){

	$scope.user = $localStorage.user;
	$rootScope.page_title = "Company Settings";
	// console.log($scope.user);
})