app.config(function ($stateProvider, $httpProvider, $urlRouterProvider) {
	// uiZeroclipConfigProvider.setZcConf({
	//   swfPath: '../bower_components/zeroclipboard/dist/ZeroClipboard.swf'
	// });

	$stateProvider

		.state('admin.team.sites', {
			url: '/sites',
			templateUrl: 'templates/admin/team/sites/list.html' ,
			controller: 'DirectoryController'
		})
		.state('admin.team.site', {
			url: '/site/:id?',
			templateUrl: 'templates/admin/team/sites/single.html',
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