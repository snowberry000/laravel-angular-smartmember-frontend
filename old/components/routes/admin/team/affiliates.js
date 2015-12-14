app.config(function ($stateProvider, $httpProvider, $urlRouterProvider) {
	// uiZeroclipConfigProvider.setZcConf({
	//   swfPath: '../bower_components/zeroclipboard/dist/ZeroClipboard.swf'
	// });

	$stateProvider

		.state('admin.team.jv', {
			url: '/jv',
			templateUrl: 'templates/admin/team/jv/index.html',
			controller : 'AffiliatesParentController'

		})
		.state('admin.team.jv.stats', {
			url: '/stats',
			templateUrl: 'templates/admin/team/jv/stats.html',
			controller : 'AffiliatesSummaryController',
			resolve: {
				$summary: function(Restangular , $site){
					return Restangular.all('affiliate').customGET('summary');
				},
				loadPlugin: function ($ocLazyLoad) {
					return $ocLazyLoad.load([
						{
							name: 'chart.js'
						}
					]);
				}
			}
		})
		.state('admin.team.jv.teams', {
			url: '/teams',
			templateUrl: 'templates/admin/team/jv/teams.html',
			controller: 'AffiliateTeamsController'
		})
		.state('admin.team.jv.team', {
				url: '/team/:id?',
				templateUrl: 'templates/admin/team/jv/team.html',
				controller: 'AffiliateTeamController',
				resolve: {
					affiliates: function(Restangular, $site) {
						return Restangular.all('').customGET('affiliate?bypass_paging=true');
					},
					affiliate_team: function(Restangular,$stateParams, $site) {
						if ( $stateParams.id ) {
							return Restangular.one('affiliateTeam',$stateParams.id ).get();
						}
						return {company_id: $site.company_id};
					}
				}
			})
		.state('admin.team.jv.fetcher', {
			url: '/fetcher',
			templateUrl: 'templates/admin/team/jv/fetcher.html',
			controller: 'JVZooController',
			resolve: {
				company_hash: function(Restangular){
					return Restangular.one('company/getCurrentCompanyHash').get();
				},
			}
		})

		.state('admin.team.jv.affiliates', {
				url: '/affiliates',
				templateUrl: 'templates/admin/team/jv/affiliates.html',
				controller: 'AffiliatesController'
		})
		.state('admin.team.jv.affiliate', {
			url: '/affiliate/:id?',
			templateUrl: 'templates/admin/team/jv/affiliate.html',
			controller: 'AffiliateController',
			resolve: {
				affiliate: function(Restangular, $stateParams, $site) {
					if ( $stateParams.id ) {
						return Restangular.one('affiliate', $stateParams.id).get();
					}
					return {company_id: $site.company_id};
				},
				$site: function($site) {
					return $site;
				}

			}
		})
		.state('admin.team.jv.contest', {
			url: '/contest/:id?',
			templateUrl: 'templates/admin/team/jv/contest.html',
			controller: 'AffiliateContestController',
			resolve: {
				contest : function(Restangular, $stateParams, $site) {
					if ( $stateParams.id ) {
						return Restangular.one('affiliateContest', $stateParams.id).get();
					}
					return {company_id: $site.company_id};
				}
			}
		})
		.state('admin.team.jv.contests', {
				url: '/contests',
				templateUrl: 'templates/admin/team/jv/contests.html',
				controller: 'AffiliateContestsController'
			})
		.state('admin.team.jv.leaderboard', {
			url: '/leaderboard/:id?',
			templateUrl: 'templates/admin/team/jv/leaderboard.html',
			controller: 'AffiliateLeaderboardController',
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