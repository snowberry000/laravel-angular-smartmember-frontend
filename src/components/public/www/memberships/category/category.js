var app = angular.module( "app" );

app.config( function( $stateProvider )
{
	$stateProvider
		.state( "public.www.category", {
			url: '/memberships/:slug',
			templateUrl: "/templates/components/public/www/memberships/category/category.html",
			controller: "WwwMembershipsCategoryController"
		} )
} );

app.controller( "WwwMembershipsCategoryController", function( $scope, $http , $stateParams , Restangular , $location)
{
	$scope.all_sites = [];
	$scope.all_the_things = ['thing'];
	$scope.pagination = {
		current_page: 1,
		per_page: 25,
		disable: false,
		total_count: 0
	};

	if($location.search().type == 'all-memberships'){
		$scope.type = 'all-memberships';
	}else{
		$scope.type = 'featured';
	}

	// $scope.calculateReviewStats =function() {

	// 	_.each($scope.all_sites, function(site){
	// 		$scope.site_reviews = site.site.reviews;
	// 		$scope.avg_rating = 0;

	// 		_.each($scope.site_reviews, function(review){

	// 			$scope.avg_rating = parseInt($scope.avg_rating) + parseInt(review.rating);
	// 		});

	// 		$scope.avg_rating /= $scope.site_reviews.length;

	// 		site.avg_rating = $scope.avg_rating;
	// 	});

	// }

	$scope.loadFeatured = function(){
		Restangular.all('site').customGET('directory' , {featured : true , 'sub_categories[]' : _.pluck($scope.current_category.sub_categories , 'title')}).then(function(response){
			$scope.all_sites = response.plain();
		})
	}

	$scope.load = function(){
		if(!$scope.all_sites || $scope.all_sites.length == 0)
			$scope.loading = true;
		$scope.pagination.disable=true;
		var params = { p: $scope.pagination.current_page , category : $scope.current_category.title};

		Restangular.all('site').customGET('directory' , params).then(function(response){
			$scope.pagination.current_page++;
			$scope.loading = false;
			$scope.pagination.total_count = response.total_count;
			$scope.dataFetch = response.items;
			if($scope.dataFetch && $scope.dataFetch.length > 0)
			{
				$scope.pagination.disable = false;
			}

			var meta = _.pluck($scope.dataFetch , 'meta_data');
			for(var i=0 ; i< meta.length ; i++){
				angular.forEach(meta[i] , function(value , key){
					meta[i][value.key] = value.value;
				})
			}
			$scope.all_sites = $scope.all_sites.concat($scope.dataFetch);
			//$scope.calculateReviewStats();
		})
	}

	$scope.filterSite = function(sub_category){
		// return sub_category;
		return _.filter($scope.all_sites , function(site){
			if(site)
				return site.sub_category == sub_category.title
		})
	}

	$scope.reload = function(category , type){
		window.location.href = '/memberships/'+category.slug+'?type='+type;
	}

	$http.get( 'json/directory_categories.json' ).success( function( response )
	{
		$scope.directory_categories = response.data;

		$scope.current_category = _.findWhere($scope.directory_categories , {slug : $stateParams.slug})

		if($scope.type == 'all-memberships')
			$scope.load();
		if($scope.type == 'featured')
			$scope.loadFeatured();
		
	} );
} );