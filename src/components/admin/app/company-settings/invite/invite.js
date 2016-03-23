var app = angular.module("app");

app.config(function($stateProvider){
	$stateProvider.state("admin.app.company-settings.invite",{
		url: '/invite',
		templateUrl: '/templates/components/admin/app/company-settings/invite/invite.html',
		controller: 'TeamInvitesController'
	});
})

app.controller('TeamInvitesController', function($scope, $localStorage, RestangularV3, toastr){
	$scope.user = $localStorage.user;
	$scope.emails = null;

	$scope.inviteNewTeamMembers = function() {
		$scope.invitedEmails = filterDuplicates();
		console.log($scope.invitedEmails);
		RestangularV3.all('company').customPOST({emails: $scope.invitedEmails},'invite').then(function(response){
			toastr.success('Members invited successfully');
		});
	}	

	function filterDuplicates() {
		var filteredEmails = [];
		var emails = $scope.emails.split(/[ ,\n]/);
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
})