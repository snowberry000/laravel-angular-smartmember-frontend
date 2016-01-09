var app = angular.module( "app" );

app.config( function( $stateProvider )
{
	$stateProvider
		.state( "public.administrate.team.email.subscribers", {
			url: "/subscribers",
			templateUrl: "/templates/components/public/administrate/team/email/subscribers/subscribers.html",
			controller: "EmailSubscribersController"
		} )
} );

app.controller( "EmailSubscribersController", function( $scope, $rootScope ,$localStorage, Restangular, toastr, $state )
{
	$site = $rootScope.site;

	$scope.template_data = {
		title: 'SUBSCRIBERS',
		description: 'Email subscribers include - but not withstanding - your members, leads, and anyone who opts into any of the pages on your site.',
		singular: 'subscriber',
		edit_route: 'public.administrate.team.email.subscriber',
		api_object: 'emailSubscriber'
	}

	$scope.data = [];
	
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

		if( true )
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
				$scope.data = Restangular.restangularizeCollection( null, data.items, $scope.template_data.api_object );
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

			$scope.data = Restangular.restangularizeCollection( null, data.items, $scope.template_data.api_object );

			$scope.loading = false;
		}, function( error )
		{
			$scope.data = [];
		} )
	}

	$scope.deleteResource = function( id )
	{
		var itemWithId = _.find( $scope.data, function( next_item )
		{
			return next_item.id === parseInt(id);
		} );

		itemWithId.remove().then( function()
		{
			$scope.data = _.without( $scope.data, itemWithId );
		} );
	};
} );