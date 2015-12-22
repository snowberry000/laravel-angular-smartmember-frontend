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

app.controller( "WidgetsController", function( $scope, $rootScope, $state, $http, Restangular, toastr, $ocLazyLoad )
{

	$site = $rootScope.site;
	$ads = null;

    $scope.dragControlListeners = {
        accept: function (sourceItemHandleScope, destSortableScope){
            return true;
        },
        itemMoved: function ($event) {console.log("moved");},//Do what you want},
        orderChanged: function($event) {console.log("orderchange");},//Do what you want},

        dragEnd: function ($event) {
            $(window).off();
        },
        connectWith: ".connectList"
    };

    $scope.available_widgets = [
        {
            slug: 'text',
            template: '/templates/components/public/admin/site/appearance/widgets/widgets/text/text.html'
        },
        {
            slug: 'banner',
            template: '/templates/components/public/admin/site/appearance/widgets/widgets/banner/banner.html'
        }
    ];

	$scope.init = function()
	{
		Restangular.all( 'siteAds' ).getList( { site_id: $site.id } ).then( function( response )
		{
			$ads = response;
			$scope.displayAds = [];
			$scope.hiddenAds = [];
			$scope.divide( $ads );

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