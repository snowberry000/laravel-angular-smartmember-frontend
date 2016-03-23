var app = angular.module("app");

app.config(function($stateProvider){
	$stateProvider
		.state("admin.sign.reset",{
			templateUrl: "/templates/components/admin/sign/reset/reset.html",
            controller : 'ResetController'
		})
});