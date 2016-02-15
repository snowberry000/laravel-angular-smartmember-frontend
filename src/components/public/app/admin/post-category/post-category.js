var app = angular.module( "app" );

app.config( function( $stateProvider )
{
	$stateProvider
		.state( "public.app.admin.post-category", {
			url: "/post-category/:id?",
			templateUrl: "/templates/components/public/app/admin/post-category/post-category.html",
			controller: "AdminPostCategoryController"
        } )
} );

app.controller( "AdminPostCategoryController", function( $scope, smModal , $rootScope, $localStorage, $state, $stateParams,  Restangular, $filter, toastr )
{
    if( !$rootScope.site || $rootScope.site.capabilities.indexOf( 'manage_content' ) == -1 )
        $state.go('public.app.site.home');

	$scope.init=function(){
		if( !$category.id )
		{
			$category.site_id = $rootScope.site.id;
		}
		$scope.category = $category;
	}
	
	$site = $rootScope.site;
	$category=null;

	if( $stateParams.id )
	{
	    Restangular.one( 'category', $stateParams.id ).get().then(function(response){
	    	$category=response;
	    	$scope.init();
	    });
	}
	else
	{
		$category = { site_id: $site.id };
		$scope.init();
	}
	    

	
	
	

	$scope.range = function( min, max, step )
	{
		step = step || 1;
		var input = [];
		for( var i = min; i <= max; i += step ) input.push( i );
		return input;
	};

	$scope.save = function()
	{
		if($scope.category.permalink)
		{
			if( $scope.category.id )
			{
				$scope.category.put().then(function(response){
					$state.go('public.app.admin.post-categories');
					toastr.success( "Category has been updated!" );
				})
				if($stateParams.close){
					close( $scope.category );
					return;
				}
			}
			else
			{
				Restangular.all( 'category' ).post( $scope.category ).then( function( module )
				{
					$scope.category = module;
					if($stateParams.close){
						close(module);
						return;
					}
					toastr.success( "Category has been saved" );
					$state.go('public.app.admin.post-categories');
				} );
			}
		}
		else
			toastr.error("Permalink must be specified.");
			
	}

    $scope.setCategoryPermalink = function( $event )
    {
        if( !$scope.category.permalink && $scope.category.title )
        {
            $scope.category.permalink = $filter( 'urlify' )( $scope.category.title ).toLowerCase();
        }
    }

    $scope.onBlurCategorySlug = function( $event )
    {
        if( $scope.category.permalink )
        {
            $scope.category.permalink = $filter( 'urlify' )( $scope.category.permalink );
        }
    }
} );