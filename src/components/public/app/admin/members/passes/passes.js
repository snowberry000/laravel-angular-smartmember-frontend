var app = angular.module( "app" );

app.config( function( $stateProvider )
{
	$stateProvider
		.state( "public.app.admin.members.passes", {
			url: "/passes",
			templateUrl: "/templates/components/public/app/admin/members/passes/passes.html",
			controller: "PassesController"
		} )
} );

app.controller( "PassesController", function( $scope, $q,$localStorage, $rootScope, Restangular, toastr )
{
	$scope.template_data = {
		title: 'PASSES',
		description: 'Grant members access to your site\'s protected content.',
		singular: 'pass',
		edit_route: 'public.app.admin.members.pass',
		api_object: 'siteRole/passes'
	}
	$scope.site = $site = $rootScope.site;
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


	$scope.paginate = function(search)
	{
		if (search && ($scope.query.length<3 && $scope.query.length!=0)) {
			return;
		}
		
		if (search)
		{
			$scope.pagination.current_page = 1;
		}

		if( true )
		{

			$scope.loading = true;

			var $params = { p: $scope.pagination.current_page, site_id: $site.id };

			if( $scope.query )
			{
				$params.q = encodeURIComponent( $scope.query );
			}

			Restangular.all( '' ).customGET( $scope.template_data.api_object + '?p=' + $params.p + '&site_id=' + $params.site_id + ( $scope.query ? '&q=' + encodeURIComponent( $scope.query ) : '' ) ).then( function( data )
			{
				
				$scope.loading = false;
				$scope.pagination.total_count = data.total_count;
				$scope.data = data.items;//Restangular.restangularizeCollection( null, data.items, $scope.template_data.api_object );
			} );
		}
	}

	$scope.paginate();

	$scope.search = function()
	{
		$scope.loading = true;
		$scope.data = [];
		$scope.pagination = {
		current_page: 1,
		per_page: 25,
		total_count: 0
	};
		var $params = { site_id: $site.id, p: $scope.pagination.current_page };

		if( $scope.query )
		{
			$params.q = encodeURIComponent( $scope.query );
		}

		Restangular.all( '' ).customGET( $scope.template_data.api_object + '?p=' + $params.p + '&site_id=' + $params.site_id + ( $scope.query ? '&q=' + encodeURIComponent( $scope.query ) : '' ) ).then( function( data )
		{
			$scope.pagination.total_count = data.total_count;

			$scope.data[ $scope.pagination.current_page ] = Restangular.restangularizeCollection( null, data.items, $scope.template_data.api_object );

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
		Restangular.all('siteRole').customPUT({access_level_id : null} , id).then(function(response){
			toastr.success("Access pass deleted!");
			$scope.data = _.without( $scope.data, itemWithId );
		})
	};
} );