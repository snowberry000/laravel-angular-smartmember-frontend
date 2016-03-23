var app = angular.module("app");

app.config(function($stateProvider){
	$stateProvider.state("admin.app.company-settings.team",{
		url: '/team',
		templateUrl: '/templates/components/admin/app/company-settings/team/Team.html',
		controller: 'CompanyTeamController'
	})
});

app.controller('CompanyTeamController', function($scope, $localStorage, toastr, RestangularV3){

	$scope.user = $localStorage.user;
	$scope.data = [];
	RestangularV3.all('company/team').getList().then(function(response){
		$scope.data = response;
	});

	$scope.deleteSegment = function(userID){
		swal({   
				title: "Delete",   
				text: "Are you sure you want to delete teammate?",   
				showCancelButton: true,   
				closeOnConfirm: true,   
				showLoaderOnConfirm: true, 
			}, function(inputValue){ 
				if(inputValue){
					RestangularV3.all('company/deleteTeamMate').customPUT({'user_id' :userID}).then(function(response){
						$scope.data = _.without($scope.data, _.findWhere($scope.data,{user_id: userID}));
						swal("Your Segment has been deleted successfully");
						return;
					});
				}
		});
	}

})