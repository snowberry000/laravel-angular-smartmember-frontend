var app = angular.module("app");

app.config(function($stateProvider){
	$stateProvider
		.state("admin.site.pages.core.list",{
			url: "/list",
			templateUrl: "/templates/components/admin/site/pages/core/list/list.html",
			controller: "ListController"
		})
}); 

app.controller("ListController", function ($scope) {

});