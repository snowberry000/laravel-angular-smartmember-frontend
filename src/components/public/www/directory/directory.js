var app = angular.module( "app" );

app.config( function( $stateProvider )
{
	$stateProvider
		.state( "public.www.directory", {
			templateUrl: "/templates/components/public/www/directory/directory.html",
			controller: "WwwDirectoryController"
		} )
} );

app.controller( "WwwDirectoryController", function( $scope, Restangular )
{
	$scope.loading_sites = false;
	$scope.loading_categories = true;
	$scope.current_category = '';

	Restangular.all( 'directory/category' ).getList().then( function( data )
	{
		if( data.length > 0 )
		{
			$scope.current_category = data[0];
		}

		console.log( 'directory_categories', data );
		$scope.directory_categories = data;

		$scope.loading_categories = false;
	} );

	$scope.$watch('current_category', function( new_value, old_value )
	{
		if( new_value != old_value )
		{
			$scope.loading_sites = true;

			//Restangular.all( 'directory?category=' + encodeURIComponent( $scope.current_category ) ).getList().then( function( data )
			Restangular.all( 'directory' ).getList().then( function( data )
			{
				console.log( 'site_listings', data );
				$scope.site_listings = data;

				$scope.loading_sites = false;
			} );
		}
	});


} );