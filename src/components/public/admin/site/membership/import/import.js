var app = angular.module("app");

app.config(function($stateProvider){
	$stateProvider
		.state("public.admin.site.membership.import",{
			url: "/import",
			templateUrl: "/templates/components/public/admin/site/membership/import/import.html",
			controller: "MembersImportController"
		})
}); 

app.controller("MembersImportController", function ($scope ,$rootScope, Restangular, $state , smModal, toastr) {
	$scope.page_title = "Import Members";
	$scope.members = {};
	$site = $rootScope.site;
	$scope.resolve = function(){
		Restangular.all('accessLevel').getList({site_id : $site.id}).then(function(response){
			$scope.access_levels = response;
		})
	}

	$scope.save = function() {
	    Restangular.one("siteRole").customPOST($scope.members, 'import').then(function(response) {
	        toastr.success("Import was successful");
	        smModal.Show('public.admin.site.membership.members');
	    });
	}

	$scope.resolve();
});