var app = angular.module("app");

app.config(function($stateProvider) {
	$stateProvider.state("admin.app.settings.segments",{
		url: '/segments',
		templateUrl: '/templates/components/admin/app/settings/segments/segments.html',
		controller: 'SettingsSegmentController'
	})
});

app.controller('SettingsSegmentController', function($scope) {

	// alert('asdjkas');
})