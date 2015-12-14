var app = angular.module("app");

app.config(function($stateProvider){
	$stateProvider
		.state("admin.marketing",{
			url: "/marketing",
			templateUrl: "/templates/components/admin/marketing/marketing.html",
			controller: "MarketingController"
		})
}); 

app.controller("MarketingController", function ($scope) {

});