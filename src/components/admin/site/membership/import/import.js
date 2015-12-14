var app = angular.module("app");

app.config(function($stateProvider){
	$stateProvider
		.state("admin.site.membership.import",{
			url: "/import",
			templateUrl: "/templates/components/admin/site/membership/import/import.html",
			controller: "ImportController"
		})
}); 

app.controller("ImportController", function ($scope) {
	$scope.page_title = "Import Members";
	$scope.members = {};

	$scope.save = function() {
	    Restangular.one("role").customPOST($scope.members, 'import').then(function(response) {
	        toastr.success("Import was successful");
	        $state.go('admin.site.membership.members');
	    });
	}
});