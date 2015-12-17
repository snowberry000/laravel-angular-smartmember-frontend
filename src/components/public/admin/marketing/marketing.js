var app = angular.module("app");

app.config(function($stateProvider){
	$stateProvider
		.state("public.admin.marketing",{
			url: "/marketing",
			templateUrl: "/templates/components/public/admin/marketing/marketing.html",
			controller: "MarketingController"
		})
}); 

app.controller("MarketingController", function ($scope) {

});