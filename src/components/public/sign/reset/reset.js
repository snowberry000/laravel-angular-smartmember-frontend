var app = angular.module("app");

app.config(function($stateProvider){
	$stateProvider
		.state("public.sign.reset",{
            url: '/reset',
			templateUrl: "/templates/components/public/sign/reset/reset.html",
            controller : 'ResetController'
		})
});