app.config(function ($stateProvider, $httpProvider, $urlRouterProvider) {
	// uiZeroclipConfigProvider.setZcConf({
	//   swfPath: '../bower_components/zeroclipboard/dist/ZeroClipboard.swf'
	// });

	$stateProvider

		.state('admin.team.email',{
			url:'/email',
			templateUrl: 'templates/admin/team/email/email.html',
			controller : 'SmartMailParentController'
		})
		.state('admin.team.email.emails', {
			url: '/emails',
			templateUrl: 'templates/admin/team/email/emails.html',
			controller: 'SmartMailsController',
			resolve: {
				emails: function(Restangular , $site){
					return Restangular.all('email').getList();
				}
			}
		})
		.state('admin.team.email.segments', {
			url: '/segments',
			templateUrl: 'templates/admin/team/smartmail/segments.html',
			controller: 'SmartMailSegmentation'
		})
		.state('admin.team.email.sendmail', {
			url: '/sendmail/:id?',
			params: {
				queueEmailData: null,
				job : false,
			},
			templateUrl: 'templates/admin/other/smartmail/send-mail.html',
			controller: 'SmartMailSendMailController',
			resolve: {
				emailLists: function(Restangular , $site){
					return Restangular.all('emailList/sendMailLists').getList();
				},
				sites : function(Restangular){
					return Restangular.one('supportTicket').customGET('sites');
				},
				emails: function(Restangular , $site){
					return Restangular.all('email').getList();
				},
				accessLevels: function(Restangular , $site){
					return Restangular.all('accessLevel/sendMailAccessLevels').getList();
				},
				superAdmin: function( Restangular ) {
					return Restangular.one('user').customGET('isSuperAdmin');
				}
			}
		})
		.state('admin.team.email.create', {
			url: '/create/:id?',
			templateUrl: 'templates/admin/team/email/create.html',
			controller: 'SmartMailController',
			resolve: {
				email: function(Restangular, $stateParams, $site) {
					if ( $stateParams.id ) {
						return Restangular.one('email', $stateParams.id).get();
					}
					return {company_id: $site.company_id};
				},
				emailSettings: function(Restangular, $site) {
					return Restangular.all('emailSetting').customGET('settings');
				},
                loadPlugin: function ($ocLazyLoad) {
                    return $ocLazyLoad.load([
                        {
                            name: 'ui.sortable'
                        }
                    ]);
                }
				/*emailLists: function(Restangular , $site){
					return Restangular.all('emailList/sendMailLists').getList();
				}
				/*
				sites : function(Restangular){
					return Restangular.one('supportTicket').customGET('sites');
				},
				accessLevels: function(Restangular , $site){
					return Restangular.all('accessLevel/sendMailAccessLevels').getList();
				},
				superAdmin: function( Restangular ) {
					return Restangular.one('user').customGET('isSuperAdmin');
				},
				sendgridIntegrations: function(Restangular , $site){
					return Restangular.all('integration/getSendgridIntegrations').getList();
				},*/
			}
		})
		.state('admin.team.email.lists', {
			url: '/lists',
			templateUrl: 'templates/admin/team/email/lists.html',
			controller: 'SmartMailListsController',
			resolve: {
				emailLists: function(Restangular , $site){
					return Restangular.all('emailList').getList();
				},
				$site: function(Restangular,$site){
					return $site;
				}
			}
		})
		.state('admin.team.email.list', {
			url: '/list/:id?',
			templateUrl: 'templates/admin/team/email/list.html',
			controller: 'SmartMailListController',
			resolve: {
				emailList: function(Restangular, $stateParams, $site){
					if ($stateParams.id){
						return Restangular.one('emailList', $stateParams.id).get();
					}
					return {company_id: $site.company_id};
				}
			}
		})
		.state('admin.team.email.subscribers', {
			url: '/subscribers',
			templateUrl: 'templates/admin/team/email/subscribers.html',
			controller: 'SmartMailSubscribersController'
		})
		.state('admin.team.email.subscriber', {
			url: '/subscriber/:id?',
			templateUrl: 'templates/admin/team/email/subscriber.html',
			controller: 'SmartMailSubscriberController',
			resolve: {
				emailSubscriber: function(Restangular, $stateParams, $site){
					if ($stateParams.id){
						return Restangular.one('emailSubscriber', $stateParams.id).get();
					}
					return {company_id: $site.company_id};
				},
				emailLists: function(Restangular , $site){
					return Restangular.all('emailList').getList({list_type: 'user'});
				},
				$site: function($site){
					return $site;
				}

			}
		})
		.state('admin.team.email.export', {
			url: '/export',
			templateUrl: 'templates/admin/team/email/export.html',
			controller: 'SmartMailDownloadSubscribersController',
			resolve: {
				emailLists: function(Restangular , $site){
					return Restangular.all('emailList/sendMailLists').getList();
				},
				$site: function($site){
					return $site;
				},
				sites : function(Restangular){
					return Restangular.one('supportTicket').customGET('sites');
				},
				emails: function(Restangular , $site){
					return Restangular.all('email').getList();
				},
				accessLevels: function(Restangular , $site){
					return Restangular.all('accessLevel/sendMailAccessLevels').getList();
				},
				superAdmin: function( Restangular ) {
					return Restangular.one('user').customGET('isSuperAdmin');
				}

			}
		})
		.state('admin.team.email.import', {
			url: '/import/:id?',
			templateUrl: 'templates/admin/team/email/subscriber.html',
			controller: 'SmartMailImportSubscriberController',
			resolve: {
				emailListId: function(Restangular, $stateParams, $site){
					return Restangular.one('emailList',$stateParams.id).get({list_type: 'user'});
				},
				emailLists: function(Restangular , $site){
					return Restangular.all('emailList').getList({list_type: 'user'});
				},
				$site: function($site){
					return $site;
				}

			}
		})
		.state('admin.team.email.autoresponders', {
			url: '/autoresponders',
			templateUrl: 'templates/admin/team/email/autoresponders.html',
			controller: 'SmartMailAutoRespondersController'
		})
		.state('admin.team.email.autoresponder', {
			url: '/autoresponder/:id',
			templateUrl: 'templates/admin/team/email/autoresponder.html',
			controller: 'SmartMailAutoResponderController',
			resolve: {
				autoResponder: function(Restangular, $stateParams, $site){
					if ($stateParams.id){
						return Restangular.one('emailAutoResponder', $stateParams.id).get();
					}
					return {company_id: $site.company_id};
				},
				$site: function($site){
					return $site;
				},
				emails: function(Restangular, $site) {
					return Restangular.all('email').getList();
				},
				emailLists : function(Restangular, $site) {
					return Restangular.all('emailList').getList();
				}
			}
		})
		.state('admin.team.email.settings', {
			url: '/settings',
			templateUrl: 'templates/admin/team/email/settings.html',
			controller: 'SmartMailSettingsController',
			resolve: {
				emailSettings: function(Restangular, $site) {
					return Restangular.all('emailSetting').customGET('settings');
				},
				loadPlugin: function ($ocLazyLoad) {
					return $ocLazyLoad.load([
						{
							name: 'summernote'
						}
					]);
				}
			}
		})
		.state('admin.team.email.queue', {
			url: '/queue',
			templateUrl: 'templates/admin/team/email/queue.html',
			controller: 'SmartMailQueueController'
		})
		.state('admin.team.email.forms', {
			url: '/forms',
			templateUrl: 'templates/admin/team/email/forms.html',
			controller: 'SmartMailFormController',
			resolve: {
				emailLists : function(Restangular, $site) {
					return Restangular.all('emailList').getList();
				},
				$sites : function(Restangular){
					return Restangular.one('supportTicket').customGET('sites');
				},
				loadPlugin: function ($ocLazyLoad) {
					return $ocLazyLoad.load([
						{
							name: 'ui.codemirror'
						}
					]);
				}

			}
		})
});