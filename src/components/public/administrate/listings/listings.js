var app = angular.module("app");

app.config(function($stateProvider){
	$stateProvider
		.state("public.administrate.listings",{
			url: "/listings",
			templateUrl: "/templates/components/public/administrate/listings/listings.html",
			controller: "ListingsController"
		})
}); 

app.controller("ListingsController", function ($scope,Restangular,$rootScope,$http) {
	$scope.template_data = {
		title: 'Manage Directory Listings',
		description: '',
		singular: 'directory',
		edit_route: 'public.administrate.listing',
		api_object: 'directory'
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

	$scope.approve = function(listing){
		$http.get($rootScope.app.apiUrl + '/directory/approve/' + listing.site_id)
			.success(function(response){
				listing.approved = true;
				listing.pending_updates = false;
				listing.title = listing.pending_title;
				console.log(response);
			})
	}

	$scope.deleteResource = function(id){
		location.reload();
	}

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

			Restangular.all( '' ).customGET( $scope.template_data.api_object + '?p=' + $params.p + ( $scope.query ? '&q=' + $scope.query : '' ) ).then( function( data )
			{
				$scope.loading = false;

				if( !data )
				{
					$scope.data = [];
				}
				else
				{
					$scope.pagination.total_count = data.total_count;
					$scope.data = Restangular.restangularizeCollection( null, data, $scope.template_data.api_object );;
				}
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

		Restangular.all( '' ).customGET( $scope.template_data.api_object + '?p=' + $params.p + ( $scope.query ? '&q=' + $scope.query : '' ) ).then( function( data )
		{
			if( !data )
			{
				$scope.data = [];
			}
			else
			{
				$scope.pagination.total_count = data.total_count;
				$scope.data[ $scope.pagination.current_page ] = Restangular.restangularizeCollection( null, data.items, $scope.template_data.api_object );
			}

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
			return next_item.id == parseInt(id);
		} );

		itemWithId.remove().then( function()
		{
			$scope.data = _.without( $scope.data, itemWithId );
			$state.transitionTo($state.current, $stateParams, { 
          reload: true, inherit: false, location: false
        });
		} );
	};
});