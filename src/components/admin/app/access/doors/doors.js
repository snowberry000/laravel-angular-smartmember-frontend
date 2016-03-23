var app = angular.module( "app" );

app.config( function( $stateProvider )
{
	$stateProvider
		.state( "admin.app.access.doors", {
			url: "/doors/:segment?",
			templateUrl: "/templates/components/admin/app/access/doors/doors.html",
			controller: "DoorsAccessController"
		} )
} );

app.controller( "DoorsAccessController", function( $scope,$location, RestangularV3, $rootScope, $stateParams, $state, smMembers, $http,$timeout )
{
	if( !$stateParams.segment ){
		$stateParams.segment = 'all';
	}

	$scope.loading = false;
	$scope.doors = [];

	var search_parameters = {
	}
	
	$scope.pagination = {
		current_page: 1,
		per_page: 25,
		total_count: 0
	};

	if( $stateParams.segment=='closed' )
	{
		$scope.page_title = 'All closed doors';
	}
	else if( $stateParams.segment=='open' )
	{
		$scope.page_title = 'All open doors';
	}
	else if( $stateParams.segment=='locked' )
	{
		$scope.page_title = 'All locked doors';
	}
	else
	{
		$scope.page_title = 'All doors';
	}

	$scope.$watch( 'pagination.current_page', function( new_value, old_value )
	{
		if( new_value != old_value )
		{
			$scope.paginate();
		}
	} );

	
	$scope.paginate = function(){
		$scope.loading =true;
		search_parameters.p = $scope.pagination.current_page;
		if( $stateParams.segment=='open' )
		{
			search_parameters.type = 'open';
		}
		else if( $stateParams.segment=='closed' )
		{
			search_parameters.type = 'closed';
		}
		else if( $stateParams.segment=='locked' )
		{
			search_parameters.type = 'locked';
		}

		RestangularV3.all( '' ).customGET( 'door' ,search_parameters).then( function( data ){
			$scope.loading = false;
			$scope.doors = data.items;
			$scope.pagination.total_count = data.total_count;
		})
	}

	$scope.paginate();

	// RestangularV3.all('door').getList().then(function(response){
	// 	$scope.doors = response;
	// 	$scope.openDoors = _.filter($scope.doors, function(door){ return door.type == 'open'; });
	// 	$scope.closedDoors = _.filter($scope.doors, function(door){ return door.type == 'closed'; });
	// 	$scope.lockedDoors = _.filter($scope.doors, function(door){ return door.type == 'locked'; });
	// 	$rootScope.counts = {'open':$scope.openDoors.length , 'closed':$scope.closedDoors.length,'locked':$scope.lockedDoors.length};
	// 	if($stateParams.segment == 'all' )
	// 	{
	// 		$rootScope.doorTab = {current_tab : "All",current_count:$rootScope.counts.open + $rootScope.counts.closed + $rootScope.counts.locked};
	// 	}
	// 	else if($stateParams.segment == 'open' )
	// 	{
	// 		$rootScope.doorTab = {current_tab : "All Open",current_count:$rootScope.counts.open};
	// 		$scope.doors = $scope.openDoors;
	// 	}
	// 	else if($stateParams.segment == 'closed' )
	// 	{
	// 		$rootScope.doorTab = {current_tab : "All Closed",current_count:$rootScope.counts.closed};
	// 		$scope.doors = $scope.closedDoors;
	// 	}
	// 	else if($stateParams.segment == 'locked' )
	// 	{
	// 		$rootScope.doorTab = {current_tab : "All Locked",current_count:$rootScope.counts.locked};
	// 		$scope.doors = $scope.lockedDoors;
	// 	}
	// });



	$scope.CreateNewDoor = function()
	{
		// Create a new message, then redirect to edit it
		$state.go( 'admin.app.access.edit-door');
	}

	
});