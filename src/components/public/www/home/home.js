var app = angular.module( "app" );

app.config( function( $stateProvider )
{
	$stateProvider
		.state( "public.www.home", {
			templateUrl: "/templates/components/public/www/home/home.html",
			controller: "WwwHomeController"
		} )
} );

app.controller( "WwwHomeController", function( $scope, Restangular )
{
	// $scope.loading_sites = false;
	// $scope.loading_categories = true;
	// $scope.current_category = '';

	// Restangular.all( 'directory/category' ).getList().then( function( data )
	// {
	// 	if( data.length > 0 )
	// 	{
	// 		$scope.current_category = data[0];
	// 	}

	// 	console.log( 'directory_categories', data );
	// 	$scope.directory_categories = data;

	// 	$scope.loading_categories = false;
	// } );

	// $scope.$watch('current_category', function( new_value, old_value )
	// {
	// 	if( new_value != old_value )
	// 	{
	// 		$scope.loading_sites = true;

	// 		//Restangular.all( 'directory?category=' + encodeURIComponent( $scope.current_category ) ).getList().then( function( data )
	// 		Restangular.all( 'directory' ).getList().then( function( data )
	// 		{
	// 			console.log( 'site_listings', data );
	// 			$scope.site_listings = data;

	// 			$scope.loading_sites = false;
	// 		} );
	// 	}
	// });

	$scope.sites = null;
	$scope.stats = null;

	$scope.calculateReviewStats =function() {
		_.each($scope.sites, function(site){
			if(site.site.reviews.length>0) {
				$scope.site_reviews = site.site.reviews;
				$scope.avg_rating = 0;

				_.each($scope.site_reviews, function(review){

					$scope.avg_rating = parseInt($scope.avg_rating) + parseInt(review.rating);
				});
				
				$scope.avg_rating /= $scope.site_reviews.length;

				site.avg_rating = $scope.avg_rating;
			}
		});

		// console.log($scope.sites);
		
	}

	Restangular.all('directory').get('all').then(function(response){
		if(response) {
			$scope.sites = response.sites;
			$scope.stats = response.statistics;

			if($scope.stats.members_count>500)
			{	
				
				$scope.stats.members_count = ($scope.stats.members_count/1000).toFixed(1);
		
				var temp = $scope.stats.members_count - parseInt($scope.stats.members_count);
				temp = temp.toFixed(1)*10;
				if(temp>5) {
					$scope.stats.members_count = parseInt($scope.stats.members_count)+""+5;
					$scope.stats.members_count = $scope.stats.members_count*100;
				} else {
					$scope.stats.members_count = parseInt($scope.stats.members_count)*1000;
				}
			}
			if($scope.stats.sites_count>100)
			{	
				$scope.stats.sites_count = parseInt($scope.stats.sites_count/100)*100;
			}
			$scope.stats.content_count = 20424;
			if($scope.stats.content_count>100)
			{	
				$scope.stats.content_count = parseInt($scope.stats.content_count/100)*100;
			}


			$scope.calculateReviewStats();
		}
	});


} );