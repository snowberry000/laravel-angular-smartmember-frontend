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
	$scope.members.email_welcome = $scope.members.email_ac = 1;
	$scope.resolve = function(){
		Restangular.all('accessLevel').getList({site_id : $site.id}).then(function(response){
			$scope.access_levels = response;
		});
		Restangular.all('importJob/active').customGET().then(function(response) {
			$scope.active_count = response;
		})
	}

	$scope.save = function() {
		$scope.members.emails = filterDuplicates().join('\n');
		// console.log($scope.members.emails);
	    Restangular.one("siteRole").customPOST($scope.members, 'import').then(function(response) {
	        toastr.success("Import was successful");
	        $state.go('public.app.admin.members.queue');
	    });
	}

	$scope.resolve();

	function filterDuplicates() {
		var filteredEmails = [];
		var emails = $scope.members.emails.split('\n');
		for(var i=0; i<emails.length; i++)
		{	
			emails[i] = emails[i].trim();
			if(filteredEmails.indexOf(emails[i]) == -1)
			{
				filteredEmails.push(emails[i]);
			}
		}
		return filteredEmails;
	}
});