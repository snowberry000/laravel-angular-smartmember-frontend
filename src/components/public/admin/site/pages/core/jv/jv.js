var app = angular.module("app");

app.config(function($stateProvider){
	$stateProvider
		.state("public.admin.site.pages.core.jv",{
			url: "/jv",
			templateUrl: "/templates/components/public/admin/site/pages/core/jv/jv.html",
			controller: "adminJVPageController"
		})
}); 

app.controller("JvController", function ($scope) {

});