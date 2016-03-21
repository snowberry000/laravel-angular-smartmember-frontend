var app = angular.module( "app" );

app.config( function( $stateProvider )
{
	$stateProvider
		.state( "public.www.membership", {
			url: "/membership/:permalink",
			templateUrl: "/templates/components/public/www/memberships/membership/membership.html",
			controller: "PublicWWWMembershipController"
		} )
} );

app.controller( "PublicWWWMembershipController", function( $scope, Restangular, $http, $stateParams , $localStorage , $rootScope , $location , toastr , smModal)
{
	$scope.loading = true;
	$scope.static_menu = true;

	$scope.interactive = true;
	$scope.review =  {};
	$scope.user = $localStorage.user;
	$scope.can_review = true;
	$scope.is_logged_in = !$localStorage.user ? false : true;

	//Restangular.one( 'directoryByPermalink', $stateParams.permalink ).get().then( function( response )
	//{
	//	$scope.site_listing = response;

	//} );
	$scope.updated = false;
	$scope.detail_rating = [];

	$scope.getMetaData = function($meta_data, $key){
		$meta = _.findWhere($meta_data,{'key':$key});
		if($meta)
			return $meta.value;
		else
			return "";
	}


	$scope.calculateReviewStats =function() {
		$scope.avg_rating = 0;
		$scope.star_rating = [0 , 0 , 0 , 0 , 0];

		_.each($scope.site_reviews, function(review){

			$scope.avg_rating = parseInt($scope.avg_rating) + parseInt(review.rating);
			$scope.star_rating[review.rating-1] ++;
		});

		$scope.avg_rating /= $scope.site_reviews.length;

		for(var i = 0; i < $scope.star_rating.length; i++) {

			$scope.star_rating[i]  = ($scope.star_rating[i]/$scope.site_reviews.length) * 100;
			$scope.star_rating[i] = $scope.star_rating[i].toFixed(2);
			var temp_review = _.findWhere($scope.detail_rating, {'rating': i+1});
			if(temp_review)
			{
				temp_review.count = $scope.star_rating[i];
			}
			else {
				$scope.detail_rating.push({rating : i + 1 , count : $scope.star_rating[i]});
			}
		}
		if($scope.updated)
		{
			updateDirectoryRating();
		}

	}

	$scope.calculateSitesAvgReview =function() {

		_.each($scope.other_sites, function(site){
			$scope.review = site.reviews;
			$scope.avg = 0;

			_.each($scope.review, function(review){

				$scope.avg = parseInt($scope.avg) + parseInt(review.rating);
			});

			$scope.avg /= $scope.review.length;

			site.avg_rating = $scope.avg;
		});
	}

	$scope.site_listing = {};

	$scope.init = function() {
		Restangular.all('site').customGET('getBySubdomain',{subdomain : $stateParams.permalink}).then(function(response){
			if(response)
			{
				$scope.site_listing = response;
				$scope.other_sites = response.other_sites;
				$scope.site_reviews = response.reviews;

				angular.forEach($scope.site_listing.meta_data , function(value , key){
					$scope.site_listing.meta_data[value.key] = value.value;
				})

				if($scope.user) {
					var review = _.findWhere($scope.site_reviews, {user_id: $scope.user.id});
					if(review ) {
						$scope.can_review = false;
					}
				} else {
					$scope.can_review = false;
				}

				$scope.calculateReviewStats();
				$scope.calculateSitesAvgReview();
			}

			$scope.loading = false;

		});
	}
	$scope.init();




	$http.get( 'json/directory_categories.json' ).success( function( response )
	{
		$scope.directory_categories = response.data;
	} );

	$scope.JoinSite = function( site_id )
	{
		if(!$scope.is_logged_in){
			// Redirection to sign up
			var subPart = $location.host().split(".");
			 window.location = $location.protocol()+'://'+$scope.site_listing.subdomain+'.smartmember.'+subPart[subPart.length-1]+'/sign/up/';

		}
		else if( $scope.is_logged_in )
		{
			$scope.addMember(site_id);

		}else{

			toastr.success( "Oops! Something went wrong. Please try again." );
		}
		
	}

	$scope.redirectToSite = function(site){
		window.location.href = $rootScope.app.appUrl;
	}

	$scope.addMember = function(site_id){
		Restangular.all( 'site/addMember' ).customPOST({site_id : site_id},'').then( function(response)
		{
			toastr.success( "You have become a member of this site" );
			$scope.is_member = true;
			$rootScope.sites.push(response);
		});
	}

	$scope.saveReview = function() {

		$scope.review.site_id = $scope.site_listing.id;
		$scope.review.user_id = $localStorage.user.id;


		if(!$scope.review.rating) {
			toastr.error("Review not saved, your review is incomplete");
		}
		else
		{
			$scope.updated = true;
			Restangular.all('review').customPOST($scope.review).then(function(response){
				if(response)
				{
					$scope.review = {};
					$scope.can_review = false;
					toastr.success("Your review has been saved");
					$scope.init();
					
				}
			})
		}
	}

	function updateDirectoryRating() {
		Restangular.all('directory/updateRating').customPUT({id: $scope.site_listing.id, rating: $scope.avg_rating}).then(function(response){

			$scope.updated = false;
		});
	}

} );