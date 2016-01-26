var app = angular.module("app");

app.config(function($stateProvider){
	$stateProvider
		.state("public.app.admin.members.import",{
			url: "/import",
			templateUrl: "/templates/components/public/app/admin/members/import/import.html",
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
		});
		Restangular.all('importJob/active').customGET().then(function(response) {
			$scope.active_count = response;
		})
	}

	$scope.save = function() {
	    Restangular.one("siteRole").customPOST($scope.members, 'import').then(function(response) {
	        toastr.success("Import was successful");
	        $state.go('public.app.admin.members.queue');
	    });
	}

	$scope.resolve();
});