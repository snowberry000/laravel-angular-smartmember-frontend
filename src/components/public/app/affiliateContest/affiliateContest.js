var app = angular.module( "app" );

app.config( function( $stateProvider )
{
	$stateProvider
		.state( "public.app.affiliateContest", {
			url: "/affiliateContest/:permalink",
			templateUrl: "/templates/components/public/app/affiliateContest/affiliateContest.html",
			controller: "AffiliateContestController"
		} )
} );

app.controller( 'AffiliateContestController', function( $scope, $rootScope, $state, $stateParams, Restangular )
{
	//console.log($affiliateContest);
	$scope.loading = true;

	if( $stateParams.permalink )
	{
		Restangular.one( 'affiliateContestByPermalink', $stateParams.permalink ).get().then( function( response )
		{
			$affiliateContest = response;
			$scope.loading = false;
			$scope.affiliateContest = $affiliateContest;
			$scope.getLeaderBoard();
			$rootScope.page_title = $affiliateContest.title ? $affiliateContest.title : null;
		} );
	}
	else
	{
		$scope.loading = false;
		$affiliateContest = $site.company_id;
		$scope.getLeaderBoard();
	}


	$scope.getLeaderBoard = function()
	{
		$scope.loading = true;

		Restangular.one( 'affiliateLeaderboard', $affiliateContest.id ).get().then( function( response )
		{
			console.log( response );
			$scope.leaderboard = response;


			$scope.loading = false;
		} );
	}

} );