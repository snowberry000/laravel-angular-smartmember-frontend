var app = angular.module("app");

app.config(function($stateProvider){
	$stateProvider
		.state("public.sign.unsubscribed",{
			url: "/unsubscribed",
			templateUrl: "/templates/components/public/sign/unsubscribed/unsubscribed.html",
			controller: "UnsubscribedController"
		})
}); 

app.controller('UnsubscribedController', function ($location,notify,$scope, $rootScope, $localStorage, Restangular) {
	$rootScope.is_admin=true;
});