var app = angular.module( "app" );

app.config( function( $stateProvider )
{
	$stateProvider
		.state( "public.app.admin.livecasts", {
			url: "/livecasts",
			templateUrl: "/templates/components/public/app/admin/livecasts/livecasts.html",
			controller: "LivecastsController"
		} )
} );

app.controller( "LivecastsController", function( $scope, $stateParams,$state,$rootScope,$timeout, $http, Restangular )
{
    if( !$rootScope.site || $rootScope.site.capabilities.indexOf( 'manage_content' ) == -1 )
        $state.go('public.app.site.home');

	$scope.template_data = {
		title: 'LIVECASTS',
		description: 'Embed live hangout & webinar code or display past recordings',
		singular: 'livecast',
		edit_route: 'public.app.admin.livecast',
		api_object: 'livecast'
	}
	$scope.site = $site = $rootScope.site;
	$scope.data = [];
	$scope.pagination = {
		current_page: 1,
		per_page: 25,
		total_count: 0
	};

	if (!Modernizr.inputtypes.date) {
      // no native support for <input type="date"> :(
      // maybe build one yourself with Dojo or jQueryUI
      $('input[type="date"]').datepicker();
      $('input[type="date"]' ).datepicker( "option", "dateFormat", 'yy-mm-dd' );
    }

	$scope.$watch( 'pagination.current_page', function( new_value, old_value )
	{
		if( new_value != old_value )
		{
			$scope.paginate();
		}
	} );

	$scope.paginate = function(search)
	{

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

	$scope.deleteResource = function( id )
	{


		var itemWithId = _.find( $scope.data, function( next_item )
		{
			return next_item.id == parseInt(id);
		} );

		itemWithId.remove().then( function()
		{
			$scope.data= _.without( $scope.data, itemWithId );
			// $timeout(function(){
			// 	$state.transitionTo( $state.current, $state.params, {
			// 	reload: true, inherit: false, location: false
			// } );
			// } , 50)
		$state.transitionTo( $state.current, $state.params, {
				reload: true, inherit: false, location: false
			} );
		} );
	};
} );