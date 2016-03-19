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

	$scope.categories = [];

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

	$scope.randomCategories = function(){
		var categories_name = _.pluck($scope.directory_categories , 'title');
		var length = $scope.directory_categories.length < 4 ? $scope.directory_categories.length : 4;
		for(var i = 0; i < length ; i++){
			var random_index = Math.floor(Math.random() * categories_name.length)
			var rand = categories_name[random_index];
			console.log(rand);
			categories_name.splice(random_index , 1);
			$scope.categories.push({name : rand , sites : []});
		}

		$scope.load();
	}

	$scope.load = function(){
		var categories_name = _.pluck($scope.categories , 'name');
		Restangular.all('site/bestSelling').customGET('' , {'categories[]' : categories_name}).then(function(response) {
			if(response)
			{

				for (var i = $scope.categories.length - 1; i >= 0; i--) {
					$scope.categories[i].sites = _.pluck(response[i] , 'site');
				}
				
				$scope.sites = $scope.categories[0].sites.concat($scope.categories[1].sites.concat($scope.categories[2].sites));
				var meta = _.pluck($scope.sites , 'meta_data');
				for(var i=0 ; i< meta.length ; i++){
					angular.forEach(meta[i] , function(value , key){
						meta[i][value.key] = value.value;
					})
				}

				$scope.calculateReviewStats();
			}
		})
	}

	$http.get( 'json/directory_categories.json' ).success( function( response )
	{
		$scope.directory_categories = response.data;
		$scope.randomCategories();
	} );
} );