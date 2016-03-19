var app = angular.module( "app" );

app.config( function( $stateProvider )
{
	$stateProvider
		.state( "public.www.memberships", {
			url: '/memberships',
			templateUrl: "/templates/components/public/www/memberships/memberships.html",
			controller: "WwwMembershipsController"
		} )
} );

app.controller( "WwwMembershipsController", function( $scope, $http, Restangular )
{
	$scope.all_the_things = [ 'thing',
		'thing2',
		'thing3',
		'thing4' ];

	$http.get( 'json/directory_categories.json' ).success( function( response )
	{
		$scope.directory_categories = response.data;
		console.log($scope.directory_categories);
	} );

	$scope.sites = null;


	$scope.calculateReviewStats =function() {
		_.each($scope.sites, function(site){
			$scope.site_reviews = site.reviews;
			$scope.avg_rating = 0;

			_.each($scope.site_reviews, function(review){

				$scope.avg_rating = parseInt($scope.avg_rating) + parseInt(review.rating);
			});
			
			$scope.avg_rating /= $scope.site_reviews.length;

			site.avg_rating = $scope.avg_rating;
		});
		
	}

	Restangular.all('sites/bestSelling').customGET('').then(function(response) {
		if(response)
		{
			$scope.development = response.development;
			$scope.mobile_apps = response.mobile_apps;
			$scope.finance = response.finance;
			$scope.entrepreneurship = response.entrepreneurship;
			$scope.sites = $scope.development.concat($scope.mobile_apps.concat($scope.finance.concat($scope.entrepreneurship)));
			var meta = _.pluck($scope.sites , 'meta');
			for(var i=0 ; i< meta.length ; i++){
				angular.forEach(meta[i] , function(value , key){
					meta[i][value.key] = value.value;
				})
			}

			$scope.calculateReviewStats();
		}
	})
} );