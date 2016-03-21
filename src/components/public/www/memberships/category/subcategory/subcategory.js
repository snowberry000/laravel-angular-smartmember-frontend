var app = angular.module("app");

app.config(function($stateProvider){
	$stateProvider
		.state("public.www.subcategory",{
			url: "/memberships/:category/:subcategory",
			templateUrl: "/templates/components/public/www/memberships/category/subcategory/subcategory.html",
			controller: "SubcategoryController"
		})
}); 

app.controller("SubcategoryController", function ($scope , $http , Restangular , $stateParams) {
	$scope.all_sites = [];

	$scope.pagination = {
		current_page: 1,
		per_page: 25,
		disable: false,
		total_count: 0
	};

	$scope.calculateReviewStats =function() {

		_.each($scope.all_sites, function(site){
			$scope.site_reviews = site.site.reviews;
			$scope.avg_rating = 0;

			_.each($scope.site_reviews, function(review){

				$scope.avg_rating = parseInt($scope.avg_rating) + parseInt(review.rating);
			});

			$scope.avg_rating /= $scope.site_reviews.length;

			site.avg_rating = $scope.avg_rating;
		});

	}

	$scope.load = function(){
		if(!$scope.all_sites || $scope.all_sites.length == 0)
			$scope.loading = true;
		$scope.pagination.disable=true;
		var params = { p: $scope.pagination.current_page , sub_category : $scope.sub_category.title };

		Restangular.all('site').customGET('directory' , params).then(function(response){

			$scope.pagination.current_page++;
			$scope.loading = false;
			$scope.pagination.total_count = response.total_count;
			$scope.dataFetch = response.items;

			var meta = _.pluck($scope.dataFetch , 'meta_data');
			for(var i=0 ; i< meta.length ; i++){
				angular.forEach(meta[i] , function(value , key){
					meta[i][value.key] = value.value;
				})
			}
			if($scope.dataFetch && $scope.dataFetch.length > 0)
			{
				$scope.pagination.disable = false;
			}
			$scope.all_sites = $scope.all_sites.concat($scope.dataFetch);

			$scope.calculateReviewStats();
		})
	}

	$scope.filterSite = function(sub_category){
		return _.filter($scope.all_sites , function(site){if(site && site.directory) return site.directory.sub_category == sub_category.title})
	}

	$http.get( 'json/directory_categories.json' ).success( function( response )
	{
		$scope.directory_categories = response.data;

		$scope.current_category = _.findWhere($scope.directory_categories , {slug : $stateParams.category})

		$scope.sub_categories = $scope.current_category.sub_categories;

		$scope.sub_category = _.findWhere($scope.sub_categories , {slug : $stateParams.subcategory})

		$scope.load();
	} );
});