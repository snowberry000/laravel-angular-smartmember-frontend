var app = angular.module("app");

app.config(function($stateProvider){
	$stateProvider
		.state("public.app.affiliateContest",{
			url: "/affiliateContest",
			templateUrl: "/templates/components/public/app/affiliateContest/affiliateContest.html",
			controller: "AffiliateContestController"
		})
}); 

app.controller('AffiliateContestController', function ($scope, $state, $stateParams, Restangular) {
    //console.log($affiliateContest);
    $scope.loading=true;
    if($stateParams.permalink)
        Restangular.one('affiliateContestByPermalink' , $stateParams.permalink).get().then(function(response){
            $affiliateContest=response;
            $scope.loading=false;
            $scope.affiliateContest=$affiliateContest;
            $scope.getLeaderBoard();
        });
    else
    {
        $scope.loading=false;
        $affiliateContest = $site.company_id;
        $scope.getLeaderBoard();
    }
        

    $scope.getLeaderBoard = function()
    {
        Restangular.one('affiliateLeaderboard', $affiliateContest.id).get().then(function(response){
            console.log(response);
            $scope.leaderboard=response;
        });
    }
    
});