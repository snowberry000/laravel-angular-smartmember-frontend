var app = angular.module( "app" );

app.config( function( $stateProvider )
{
	$stateProvider
		.state( "public.app.forum.category.add", {
			url: "/add/:id?",
			templateUrl: "/templates/components/public/app/forum/category/add/add.html",
			controller: "AddController"
		} )
} );

app.controller( "AddController", function( $scope, Restangular, $stateParams,$rootScope )
{

	if( $stateParams.id )
	{
		Restangular.one( 'forumCategory', $stateParams.id ).get().then( function( response )
		{
			$scope.category = response;
			$rootScope.page_title = $scope.category ? $scope.category.title : 'Add Forum Category';
		} )
	}

	$scope.updateIcon = function( $icon )
	{
		// $scope.editing_item.icon=$icon;
		//console.log( $icon );
		$scope.category.icon = $icon;
	}

	$scope.save = function()
	{
		$scope.category.site_id = $scope.site.id;

		Restangular.service( 'forumCategory' )
			.post( $scope.category )
			.then( function( response )
			{
				location.reload();
				//$scope.categories.push( response );
				//$scope.category = {};
			} );
	}

} );