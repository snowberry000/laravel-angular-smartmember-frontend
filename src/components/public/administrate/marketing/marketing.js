var app = angular.module("app");

app.config(function($stateProvider){
	$stateProvider
		.state("public.administrate.marketing",{
			url: "/marketing",
			templateUrl: "/templates/components/public/administrate/marketing/marketing.html",
			controller: "MarketingController"
		})
}); 

app.controller("MarketingController", function ($scope) {

});