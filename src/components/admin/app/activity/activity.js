var app = angular.module( "app" );

app.config( function( $stateProvider )
{
	$stateProvider
		.state( "admin.app.activity", {
			url: "/activity",
			templateUrl: "/templates/components/admin/app/activity/activity.html",
			controller: "ActivityController"
		} )
} );

app.controller( "ActivityController", function( $scope, RestangularV3,Restangular,$rootScope )
{
	$scope.loading = false;
	$scope.query = '';
	$scope.data = [];
	$scope.pagination = {
		current_page: 1,
		per_page: 25,
		total_count: 0
	};
	$rootScope.page_title = "Activity";

	$scope.meta_show_storage = []; // this is stupid but my knowledge of angular scopes clearly isn't capable of doign it in the template

	$scope.$watch( 'pagination.current_page', function( new_value, old_value )
	{
		if( new_value != old_value )
		{
			$scope.paginate();
		}
	} );

	$scope.paginate = function( search )
	{
		if( search )
		{
			$scope.pagination.current_page = 1;
		}

		$scope.loading = true;

		var $params = { p: $scope.pagination.current_page };

		if( $scope.query )
		{
			$params.q = encodeURIComponent( $scope.query );
		}

		RestangularV3.all( '' ).customGET( 'event' + '?p=' + $params.p + ( $scope.query ? '&q=' + encodeURIComponent( $scope.query ) : '' ) ).then( function( data )
		{
			$scope.loading = false;
			$scope.pagination.total_count = data.total_count;
			$scope.data = Restangular.restangularizeCollection( null, data.items, 'event' );
		} );
	}

	$scope.paginate();

} );