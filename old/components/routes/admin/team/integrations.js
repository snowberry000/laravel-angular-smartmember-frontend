app.config(function ($stateProvider, $httpProvider, $urlRouterProvider) {
	// uiZeroclipConfigProvider.setZcConf({
	//   swfPath: '../bower_components/zeroclipboard/dist/ZeroClipboard.swf'
	// });

	$stateProvider

		.state('admin.team.integrations',{
			url:'/integrations',
			templateUrl: 'templates/admin/team/integrations/index.html'
		})
		.state('admin.team.integrations.available', {
			url: '/available',
			templateUrl: 'templates/admin/team/integrations/available.html',
			controller: 'IntegrationsController'
		})
		.state('admin.team.integrations.list', {
			url: '/list',
			templateUrl: 'templates/admin/team/integrations/list.html',
			controller: 'IntegrationsController',
		})
		.state('admin.team.integrations.connections', {
			url: '/connections',
			templateUrl: 'templates/admin/team/integrations/connections.html',
			controller: 'IntegrationsController'
		})
		.state('admin.team.integration', {
			url: '/integration/:integration',
			templateUrl: 'templates/admin/team/integrations/single.html',
			controller: 'IntegrationsController'
		})
		.state('admin.team.integration.choose', {
			url: '/choose',
			templateUrl: 'templates/admin/team/integrations/choose.html',
			controller: 'IntegrationsController'
		})
		.state('admin.team.integration.configure',{
			url:'/configure/:id?',
			params: {
				site_id: null,
				team: null
			},
			templateUrl: function($stateParams) {
				return 'templates/admin/team/integrations/' + $stateParams.integration + '.html'
			},
			controller: 'IntegrationsController'
		})
		.state('admin.team.integrations.facebook_group',{
			url:'/facebook_group/:add_group?',
			templateUrl: 'templates/admin/team/integrations/facebook_group.html',
			controller: 'FacebookGroupController'
		})
});