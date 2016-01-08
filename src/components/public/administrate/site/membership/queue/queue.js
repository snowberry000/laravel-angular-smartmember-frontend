var app = angular.module( "app" );

app.config( function( $stateProvider )
{
	$stateProvider
		.state( "public.administrate.site.membership.queue", {
			url: "/queue",
			templateUrl: "/templates/components/public/administrate/site/membership/queue/queue.html",
			controller: "ImportQueueController"
		} )
} );

app.controller( "ImportQueueController", function( $scope,smModal,$rootScope, $localStorage, $location, $state, Restangular, toastr )
{
	$site = $rootScope.site;

	$scope.template_data = {
		title: 'Import History',
		description: 'Members are imported 60 seconds, 4000 at a time.',
		singular: 'import job',
		edit_route: '',
		api_object: 'importJob'
	}

	$scope.loading = false;
	$scope.items = [];
	$scope.pagination = {
		current_page: 1,
		per_page: 25,
		total_count: 0
	};

	$scope.$watch( 'pagination.current_page', function( new_value, old_value )
	{
		if( new_value != old_value )
		{
			$scope.paginate();
		}
	} );

	$scope.paginate = function()
	{
		$scope.loading = true;

		var $params = { p: $scope.pagination.current_page, site_id: $rootScope.site.id };

		Restangular.all( '' ).customGET( $scope.template_data.api_object + '?view=admin&p=' + $params.p + '&site_id=' + $params.site_id ).then( function( data )
		{
			$scope.loading = false;
			$scope.pagination.total_count = data.total_count;
			$scope.items = Restangular.restangularizeCollection( null, data.items, $scope.template_data.api_object );
		} );
	}

	$scope.paginate();

	$scope.deleteJob = function( job )
	{
		Restangular.service( "emailJob/deleteJob" ).post( { id: job } ).then( function( response )
		{
			toastr.success( "Job canceled." );

			angular.forEach( $scope.items[ $scope.pagination.current_page ], function( value, key )
			{
				if( value.id == job )
				{
					$scope.items[ $scope.pagination.current_page ] = _.without( $scope.items[ $scope.pagination.current_page ], value );
				}
			} );

		} );
	}

} );