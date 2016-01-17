var app = angular.module( "app" );

app.config( function( $stateProvider )
{
	$stateProvider
		.state( "public.administrate.site.membership.products", {
			url: "/products",
			templateUrl: "/templates/components/public/administrate/site/membership/products/products.html",
			controller: "ProductsController"
		} )
} );

app.controller( "ProductsController", function( $scope, $localStorage, smModal, $rootScope, Restangular, toastr )
{
	$scope.site = $site = $rootScope.site;
	if( _.findWhere( $scope.site.configured_app, { type: 'stripe' } ) )
	{
		$scope.stripe_integrated = true;
	}

	if( _.findWhere( $scope.site.configured_app, { type: 'paypal' } ) )
	{
		$scope.paypal_integrated = true;
	}

	$scope.template_data = {
		title: 'PRODUCTS',
		description: 'Access Levels are how you protect your course content & downloads - as well as offer customers a specific item to purchase such as a bronze, silver, or gold membership level.',
		singular: 'product',
		edit_route: 'public.administrate.site.membership.product',
		api_object: 'accessLevel'
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

			var $params = { p: $scope.pagination.current_page, site_id: $site.id };

			if( $scope.query )
			{
				$params.q = encodeURIComponent( $scope.query );
			}
			Restangular.all( '' ).customGET( $scope.template_data.api_object + '?view=admin&p=' + $params.p + '&site_id=' + $params.site_id + ( $scope.query ? '&q=' + $scope.query : '' ) ).then( function( data )
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

		Restangular.all( '' ).customGET( $scope.template_data.api_object + '?view=admin&p=' + $params.p + '&site_id=' + $params.site_id + ( $scope.query ? '&q=' + $scope.query : '' ) ).then( function( data )
		{
			$scope.pagination.total_count = data.total_count;

			$scope.data[ $scope.pagination.current_page ] = Restangular.restangularizeCollection( null, data.items, $scope.template_data.api_object );

			$scope.loading = false;
		}, function( error )
		{
			$scope.data = [];
		} )
	}

	$scope.deleteResource = function(id){
		var itemWithId = _.find( $scope.data, function( next_item )
		{
			return next_item.id === parseInt(id);
		} );

		itemWithId.remove().then( function()
		{
			$scope.data = _.without( $scope.data, itemWithId );
			$rootScope.access_levels = _.reject($rootScope.access_levels , function(item){
				return item.id == parseInt(id);
			});
			toastr.success("Access level deleted!");
		} );
		
	}

	$scope.delete = function( id )
	{
		smModal.Show('public.app.site.delete' , {route : 'accessLevel' , id : id} , null , $scope.afterDelete);
	};

	$scope.promptRefreshHash = function( access_level ) {
		swal( {
			title: "Are you sure you want to refresh the hash?",
			text: 'Resetting this hash will make the previous instant access URL for ' + access_level.name,
			type: "warning",
			showCancelButton: true,
			confirmButtonColor: "#DD6B55",
			confirmButtonText: "Yes, refresh it!",
			closeOnConfirm: true
		}, function()
		{
			$scope.refreshHash( access_level );
		} );
	}

	$scope.refreshHash = function( $access )
	{
		Restangular.service( "accessLevel/refreshHash" ).post( $access ).then( function( response )
		{
			for( var i = 0; i < $scope.data.length; i++ )
			{
				if( $scope.data[ i ].id == response.id )
				{
					$scope.data[i].hash = response.hash;
				}
			}
			toastr.success( "Product level hash updated!" );
		} );
	}

	$scope.copied = function()
	{
		toastr.success( "Link copied!" );
	}

	$scope.init = function()
	{
		var clipboard = new Clipboard( '.copy-button', {
			text: function(trigger) {
				return trigger.getAttribute('data-text');
			}
		} );
	}
} );