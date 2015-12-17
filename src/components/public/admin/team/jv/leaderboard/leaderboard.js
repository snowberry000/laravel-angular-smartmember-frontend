var app = angular.module("app");

app.config(function($stateProvider){
	$stateProvider
		.state("public.admin.team.jv.leaderboard",{
			url: "/leaderboard/:id?",
			templateUrl: "/templates/components/public/admin/team/jv/leaderboard/leaderboard.html",
			controller: "LeaderboardController",
			resolve: {
				leaderboard : function(Restangular, $stateParams, $site) {
					if ( $stateParams.id ) {
						return Restangular.one('affiliateLeaderboard', $stateParams.id).get();
					}
					return {company_id: $site.company_id};
				}
			}
		})
}); 

app.controller("LeaderboardController", function ($scope, $localStorage, Restangular, toastr, $state, leaderboard) {
	$scope.leaderboard = leaderboard;
});