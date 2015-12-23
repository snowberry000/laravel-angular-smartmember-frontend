var app = angular.module( "app" );

app.config( function( $stateProvider )
{
	$stateProvider
		.state( "public.admin.site.appearance.widgets", {
			url: "/widgets",
			templateUrl: "/templates/components/public/admin/site/appearance/widgets/widgets.html",
			controller: "WidgetsController"
		} )
} );

app.controller( "WidgetsController", function( $scope, $rootScope, $state, $http, Restangular, toastr, $ocLazyLoad, $timeout )
{

	$site = $rootScope.site;
	$ads = null;
    $scope.sidebar_id = 1;

	$scope.init = function()
	{
		Restangular.all( 'widget' ).getList( { site_id: $site.id, sidebar_id: $scope.sidebar_id } ).then( function( response )
		{
			$scope.widgets = response;
		} );
	}


	$scope.divide = function( $allAds )
	{
		$.each( $allAds, function( key, value )
		{
			if( value.display )
			{
				$scope.displayAds.push( value );
			}
		} );
	}

	$scope.init();
} );