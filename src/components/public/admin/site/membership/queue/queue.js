var app = angular.module( "app" );

app.config( function( $stateProvider )
{
	$stateProvider
		.state( "public.admin.site.membership.queue", {
			url: "/queue",
			templateUrl: "/templates/components/public/admin/site/membership/queue/queue.html",
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

	$scope.data = [];
	$scope.pagination = { current_page: 1 };
	$scope.pagination.total_count = 1;

	$scope.paginate = function()
	{

		if( typeof $scope.data[ $scope.pagination.current_page ] != 'object' )
		{

			$scope.loading = true;

			var $params = { p: $scope.pagination.current_page };

			if( $scope.query )
			{
				$params.q = encodeURIComponent( $scope.query );
			}

			Restangular.all( '' ).customGET( $scope.template_data.api_object + '?view=admin&p=' + $params.p + ( $scope.query ? '&q=' + encodeURIComponent( $scope.query ) : '' ) ).then( function( data )
			{
				$scope.loading = false;
				$scope.pagination.total_count = data.total_count;
				$scope.data[ $scope.pagination.current_page ] = Restangular.restangularizeCollection( null, data.items, $scope.template_data.api_object );
			} );
		}
	}

	$scope.paginate();

	$scope.search = function()
	{
		$scope.loading = true;
		$scope.data = [];
		$scope.pagination = { current_page: 1 };
		var $params = { p: $scope.pagination.current_page };

		if( $scope.query )
		{
			$params.q = encodeURIComponent( $scope.query );
		}

		Restangular.all( '' ).customGET( $scope.template_data.api_object + '?p=' + $params.p + ( $scope.query ? '&q=' + encodeURIComponent( $scope.query ) : '' ) ).then( function( data )
		{
			$scope.pagination.total_count = data.total_count;

			$scope.data[ $scope.pagination.current_page ] = Restangular.restangularizeCollection( null, data.items, $scope.template_data.api_object );

			$scope.loading = false;
		}, function( error )
		{
			$scope.data = [];
		} )
	}

	$scope.deleteJob = function( job )
	{
		Restangular.service( "emailJob/deleteJob" ).post( { id: job } ).then( function( response )
		{
			toastr.success( "Job canceled." );

			angular.forEach( $scope.data[ $scope.pagination.current_page ], function( value, key )
			{
				if( value.id == job )
				{
					$scope.data[ $scope.pagination.current_page ] = _.without( $scope.data[ $scope.pagination.current_page ], value );
				}
			} );

		} );
	}

} );