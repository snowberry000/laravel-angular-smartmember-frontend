var app = angular.module("app");

app.config(function($stateProvider) {
	$stateProvider.state("admin.app.settings",{
		redirectTo: 'admin.app.settings.account',
		url: '/settings',
		templateUrl: '/templates/components/admin/app/settings/settings.html',
		controller: 'SettingsController'
	})
});

app.controller('SettingsController', function($rootScope, $scope, $localStorage, RestangularV3, toastr, smModal) {

	
	$rootScope.page_title = "My Settings";
})
