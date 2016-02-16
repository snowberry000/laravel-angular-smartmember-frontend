var app = angular.module("app");

app.config(function($stateProvider){
	$stateProvider
		.state("public.app.admin.members.import",{
			url: "/import",
			templateUrl: "/templates/components/public/app/admin/members/import/import.html",
			controller: "MembersImportController"
		})
}); 

app.controller("MembersImportController", function ($scope ,$rootScope, Restangular, $state , smModal, toastr, $q) {
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
		
		if($scope.members.emails && $scope.members.emails!='')	// if email area is not empty
		{
			var present = false;
			var emails = filterDuplicates();
			var filteredEmails = [];
			var memberEmails = [];

			//console.log(emails);

			var result = Restangular.all( '' ).customGET( 'user').then(function(data) {	// get added members list
				for(var i=0; i< data.items.length; i++)
				{
					memberEmails.push(data.items[i].email);
				}
				for(var j=0; j< emails.length; j++) 
				{
					if(_.where(memberEmails, emails[j]).length==0)
					{
						filteredEmails.push(emails[j]);
					}	
					else
					{
						present = true;
					}		
				}
			});

			$q.all([result]).then(function() {
				//console.log('filterd emails'+filteredEmails);
				if(filteredEmails.length>0)		// if all emails are already present
				{	
					$scope.members.emails = filteredEmails.join('\n');
					Restangular.one("siteRole").customPOST($scope.members, 'import').then(function(response) {
						if(present==false)
			        	{
			        		toastr.success("Import was successful");
			    		} else {
			    			toastr.success("Import was successful but some members already exist");
			    		}
				        $state.go('public.app.admin.members.queue');
				    });
				}
				else
				{
					toastr.error("Import fail! member(s) already exist");
					$state.go('public.app.admin.members.list');
				}
			})
			//$scope.members.emails = filteredEmails.join('\n');
			
		    //Restangular.one("siteRole").customPOST($scope.members, 'import').then(function(response) {
		        //toastr.success("Import was successful");
		        //$state.go('public.app.admin.members.queue');
		    //});
		}
	}

	$scope.resolve();

	function filterDuplicates() {
		var filteredEmails = [];
		var emails = $scope.members.emails.split('\n');
		for(var i=0; i<emails.length; i++)
		{	
			emails[i] = emails[i].trim();
			if(_.where(filteredEmails, emails[i]).length==0)
			{
				filteredEmails.push(emails[i]);
			}
		}
		return filteredEmails;
	}
});