var app = angular.module("app");

app.config(function($stateProvider){
	$stateProvider
		.state("public.administrate.team.invite",{
			url: "/invite",
			templateUrl: "/templates/components/public/administrate/team/invite/invite.html",
			controller: "TeamInviteController"
		})
}); 

app.controller("TeamInviteController", function ($scope,smModal,toastr, $state, $localStorage, $rootScope, $location, Restangular, notify ) {
	$scope.team_members = {};
	$user=$rootScope.user;
	$scope.save = function() {
	    Restangular.one("teamRole").customPOST($scope.team_members, 'import').then(function(response) {
            // notify({
            //         message:"Import was successful",
            //         classes: 'alert-success',
            //         templateUrl : 'templates/modals/notifyTemplate.html'
            //     });
            toastr.success("Import was successful!");
	        smModal.Show('public.administrate.team.members');
	    });
	}
	$scope.$watch('current_company' , function(current_company){
		if(current_company){
			$scope.role = $scope.getRole($user.role , current_company.id)
			//console.log($scope.role)
		}
	})
	$scope.getRole = function(role , company_id){
	    for (var i = role.length - 1; i >= 0; i--) {
	        if(role[i].company_id == company_id){
	        	return role[i].type[0].role_type;
	        }
	    };
	    return 3;
	}
});