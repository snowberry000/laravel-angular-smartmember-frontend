var app = angular.module( "app" );

app.config( function( $stateProvider )
{
	$stateProvider
		.state( "public.www.search", {
			url: '/search/:slug',
			templateUrl: "/templates/components/public/www/search/search.html",
			controller: "WwwSearchController"
		} )
} );

app.controller( "WwwSearchController", function( $scope, $http , $stateParams , Restangular)
{
	$scope.all_the_things = [ 'thing',
		'thing2',
		'thing3',
		'thing4',
		'thing5',
		'thing6',
		'thing7',
		'thing8',
		'thing9',
		'thing0',
		'thing10',
		'thing11',
		'thing12' ]

	$scope.pagination = {
		current_page: 1,
		per_page: 25,
		disable: false,
		total_count: 0,
		sort_by : 'total_members'
	};
	$scope.ratings = [];
	$scope.search_term = $stateParams.slug;
	$scope.matched_sites = [];
	var query = {};
	$scope.calculateReviewStats =function() {
		_.each($scope.matched_sites, function(site){
			$scope.site_reviews = site.reviews;
			$scope.avg_rating = 0;

			_.each($scope.site_reviews, function(review){

				$scope.avg_rating = parseInt($scope.avg_rating) + parseInt(review.rating);
			});
			
			$scope.avg_rating /= $scope.site_reviews.length;

			site.avg_rating = $scope.avg_rating;
		});

		// console.log($scope.sites);
		
	}

	$scope.paid = function(){
		$scope.send_paid_query = $scope.is_free^$scope.is_paid;
		
		if($scope.send_paid_query){
			query.is_paid = $scope.is_paid ? true : false;
		}else{
			delete query.is_paid;
		}

		$scope.loadMore(true , query);
	}

	$scope.addRating = function(rating){
		var index = $scope.ratings.indexOf(rating);
		if(index >= 0){
			$scope.ratings.splice(index , 1);
		}else{
			$scope.ratings.push(rating);
		}
		query['rating[]'] = $scope.ratings;
		$scope.loadMore(true , query);
	}

	$scope.loadMore = function(reload){
		if(!$scope.matched_sites || $scope.matched_sites.length==0)
			$scope.loading = true;
		$scope.pagination.disable=true;

		var params = query;
		
		params.p = $scope.pagination.current_page;
		if(reload){
			params.p = 1;
			$scope.matched_sites = [];
			$scope.pagination.current_page = 1;
		}
		params.q = $scope.search_term;
		params.sort_by = $scope.pagination.sort_by;

		Restangular.all('site').customGET('search',params).then(function(response){
			if(!reload)
				$scope.pagination.current_page++;
			$scope.loading = false;
			$scope.pagination.total_count = response.total_count;
			$scope.dataFetch = _.pluck(response.items , 'site');
			if($scope.dataFetch && $scope.dataFetch.length > 0)
			{
				$scope.pagination.disable = false;
			}
			$scope.matched_sites = $scope.matched_sites.concat($scope.dataFetch);
			$scope.calculateReviewStats();
		})

	}

	$scope.loadMore();

} );