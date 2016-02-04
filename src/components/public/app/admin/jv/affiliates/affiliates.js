var app = angular.module( "app" );

app.config( function( $stateProvider )
{
	$stateProvider
		.state( "public.app.admin.jv.affiliates", {
			url: "/affiliates",
			templateUrl: "/templates/components/public/app/admin/jv/affiliates/affiliates.html",
			controller: "AffiliatesController"
		} )
} );

app.controller( "AffiliatesController", function( $scope, $rootScope, $localStorage, Restangular )
{
	$site = $rootScope.site;
	$scope.order_by = "created_at";

	$scope.template_data = {
		title: 'AFFILIATES',
		description: 'These are your "external promoters" - the people selling your Product(s).',
		singular: 'affiliate',
		edit_route: 'public.app.admin.jv.affiliate',
		api_object: 'affiliate'
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

	$scope.sort_by_changed = function(){
		$scope.search(true);
	}

	$scope.paginate = function(search)
	{	console.log('paginate');
		
		var continueSearch = true;
		if (search && ($scope.query.length<3 ))
		{
			continueSearch = false;
			console.log('query length = '+$scope.query.length);
		}

		if( continueSearch==true || $scope.query.length==0)
		{
			$scope.pagination.current_page = 1;
			$scope.loading = true;

			var $params = { p: $scope.pagination.current_page };

			if( $scope.query )
			{
				$params.q = encodeURIComponent( $scope.query );
			}

			Restangular.all( '' ).customGET( $scope.template_data.api_object + '?order_by=' + $scope.order_by + '&view=admin&p=' + $params.p + ( $scope.query ? '&q=' + encodeURIComponent( $scope.query ) : '' ) ).then( function( data )
			{
				$scope.loading = false;
				$scope.pagination.total_count = data.total_count;
				$scope.data = Restangular.restangularizeCollection( null, data.items, $scope.template_data.api_object );
			} );
			console.log('query processed');
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
			total_count: 0,
		};
		var $params = { p: $scope.pagination.current_page };

		if( $scope.query )
		{
			$params.q = encodeURIComponent( $scope.query );
		}

		Restangular.all( '' ).customGET( $scope.template_data.api_object + '?order_by=' + $scope.order_by + '&view=admin&p=' + $params.p + ( $scope.query ? '&q=' + encodeURIComponent( $scope.query ) : '' ) ).then( function( data )
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