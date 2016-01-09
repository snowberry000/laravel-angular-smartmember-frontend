var app = angular.module("app");

app.config(function($stateProvider){
	$stateProvider
		.state("public.sign.reset",{
			templateUrl: "/templates/components/public/sign/reset/reset.html",
            controller : 'ResetController'
		})
});