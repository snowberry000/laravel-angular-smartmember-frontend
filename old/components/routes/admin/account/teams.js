app.config(function ($stateProvider, $httpProvider, $urlRouterProvider) {
	// uiZeroclipConfigProvider.setZcConf({
	//   swfPath: '../bower_components/zeroclipboard/dist/ZeroClipboard.swf'
	// });

	$stateProvider

		.state('admin.account.teams', {
			url: '/teams',
			templateUrl: 'templates/admin/account/teams/list.html' ,
			controller: 'AccountTeamsList'
		})
		.state('admin.account.team', {
			url: '/team/:id?',
			templateUrl: 'templates/admin/account/teams/single.html',
			controller: 'siteController',
			resolve: {
				$site: function(Restangular,$stateParams){
					if ($stateParams.id){
						return Restangular.one('site',$stateParams.id).get();
					}
					return {};
				},
				$clone_sites: function(Restangular,$stateParams){
					return Restangular.all('site').getList({cloneable : 1});
				}
			}
		})
});