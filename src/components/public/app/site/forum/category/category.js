var app = angular.module( "app" );

app.config( function( $stateProvider )
{
	$stateProvider
		.state( "public.app.site.forum.category", {
			url: "/forum/:permalink",
			templateUrl: "/templates/components/public/app/site/forum/category/category.html",
			controller: "Forum-categoryController"
		} )
} );


app.controller( "Forum-categoryController", function( $scope, $rootScope, $state, $stateParams, Restangular , $localStorage )
{
	$scope.loading = true;

	Restangular.one( 'forumCategory', 'permalink' )
		.get( { permalink: $stateParams.permalink } )
		.then( function( response )
		{
			$scope.category = response;
			$rootScope.page_title = $rootScope.site.name+' - '+ $scope.category.title ;
			$rootScope.page_title = $scope.category.title ? $scope.category.title : 'Category';
			$rootScope.category = response;

			$scope.loading = false;
		} );

    $scope.deleteResource = function( id )
    {

        var itemWithId = _.findWhere( $scope.category.topics, { id: parseInt( id ) } ) || _.findWhere( $scope.category.topics, { id: id + '' } );

        if( itemWithId ) {
            itemWithId = Restangular.restangularizeElement( null, itemWithId, 'forumTopic' );

            itemWithId.remove().then(function () {
                $scope.category.topics = _.without($scope.category.topics, itemWithId);
            });
        }
    };

    $scope.showNoAccessLogin = function() {
		if (!$localStorage.user || !$localStorage.user.access_token)
		{
			$state.go('public.sign.in');
		}
	}
} );