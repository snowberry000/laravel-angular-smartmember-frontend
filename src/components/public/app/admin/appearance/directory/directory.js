var app = angular.module( "app" );

app.config( function( $stateProvider )
{
	$stateProvider
		.state( "public.app.admin.appearance.directory", {
			url: "/directory",
			templateUrl: "/templates/components/public/app/admin/appearance/directory/directory.html",
			controller: "DirectoryListingController"
		} )
} );

app.controller( "DirectoryListingController", function( $scope,$rootScope,$http, $state, $localStorage,  Restangular, toastr, $filter )
{
	$site=$rootScope.site;
	$scope.selected_category = {};

	$scope.price_interval = ["one_time","daily","weekly","monthly","annually"];

	$scope.changeCategory = function(category){
		$scope.selected_category = _.findWhere($scope.directory_categories , {title : category});
	}
	$scope.isFree = function(){
		$scope.listing.pending_pricing = null;
		$scope.listing.pricing = null;
	}

	$scope.resolve=function(){
		Restangular.one( 'directory', 'siteListing' ).get().then(function(response){
			$listing=response;
			if( $listing )
		    {
		        $listing.expired_at = moment( $listing.expired_at ).toDate();
		    }
		    else
		    {
		        $listing = {};
		    }
		    $scope.listing = $listing;
		    if($scope.listing.category){
		    	$scope.selected_category = _.findWhere($scope.directory_categories , {title : $scope.listing.category});
		    	console.log($scope.selected_category)
		    }
			$scope.hide_lessons = $listing.hide_lessons;
			$scope.hide_downloads = $listing.hide_downloads;
			$scope.hide_members = $listing.hide_members;
			$scope.hide_revenue = $listing.hide_revenue;
			$scope.listing.is_visible = $listing.is_visible || 'no';

		});
	}
	
	$http.get( 'json/directory_categories.json' ).success( function( response )
	{
		$scope.directory_categories = response.data;
		console.log($scope.directory_categories);
	} );


	$scope.onBlurTitle = function( $event )
	{
        if( !$scope.listing.permalink )
        {
            $scope.listing.permalink = $filter( 'urlify' )( $scope.listing.pending_title );
        }
    }
    $scope.onBlurSlug = function( $event )
	{
		if( !$scope.listing.permalink )
        {
            $scope.listing.permalink = $filter( 'urlify' )( $scope.listing.pending_title );
        }
        else
        {
            (!$scope.listing.permalink)
        }
        $scope.listing.permalink = $filter( 'urlify' )( $scope.listing.permalink );
	}


	$scope.save = function()
	{
		//$listing.hide_lessons = $scope.hide_lessons;
		//$listing.hide_downloads = $scope.hide_downloads;
		//$listing.hide_members = $scope.hide_members;
		//$listing.hide_revenue = $scope.hide_revenue;
		Restangular.service( "directory" ).post( $scope.listing ).then( function( response )
		{
			$scope.listing = response;
			toastr.success( "Your directory listings has been received." );
		} );
	}

	$scope.removeImage = function()
	{
		$scope.listing.pending_image = '';
	}
	$scope.resolve();

	$scope.updatePricing = function() {
		if($scope.listing.is_paid==0) {
			$scope.listing.min_price = null;
			$scope.listing.min_price_interval = null;
			$scope.listing.max_price = null;
			$scope.listing.max_price_interval = null;		
		}
	}
} );