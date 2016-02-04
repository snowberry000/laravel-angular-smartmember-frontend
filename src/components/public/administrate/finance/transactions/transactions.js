var app = angular.module( "app" );

app.config( function( $stateProvider )
{
	$stateProvider
		.state( "public.administrate.finance.transactions", {
			url: "/transactions",
			templateUrl: "/templates/components/public/administrate/finance/transactions/transactions.html",
			controller: "TransactionsController",
		} )
} );


app.controller( 'TransactionsController', function( $scope, $rootScope, $localStorage, Restangular, toastr )
{
	$scope.template_data = {
		title: 'TRANSACTIONS',
		description: 'Transactions are each sale / refund processed through this site by customers',
		singular: 'transaction',
		edit_route: '',
		api_object: 'transaction'
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

	$scope.paginate = function(search) {
		if (search && $scope.query.length<3){
			return;
		}
		if (search && $scope.query.length)
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

			Restangular.all( '' ).customGET( $scope.template_data.api_object + '?view=admin&p=' + $params.p + '&site_id=' + $params.site_id + ( $scope.query ? '&q=' + encodeURIComponent( $scope.query ) : '' ) ).then( function( data )
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

	$scope.delete = function( id )
	{

		var modalInstance = $modal.open( {
			templateUrl: 'templates/modals/deleteConfirm.html',
			controller: "modalController",
			scope: $scope,
			resolve: {
				id: function()
				{
					return id
				}
			}

		} );
		modalInstance.result.then( function()
		{
			var itemWithId = _.find( $scope.data, function( next_item )
			{
				return next_item.id === id;
			} );

			itemWithId.remove().then( function()
			{
				$scope.data = _.without( $scope.data, itemWithId );
			} );
		} )
	};
} );


