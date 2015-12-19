var app = angular.module("app");

app.config(function($stateProvider){
	$stateProvider
		.state("public.sign",{
			url: "/sign",
			templateUrl: "/templates/components/public/sign/sign.html"
		})
});

