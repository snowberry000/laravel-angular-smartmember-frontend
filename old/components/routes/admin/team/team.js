app.config(function ($stateProvider, $httpProvider, $urlRouterProvider) {
    // uiZeroclipConfigProvider.setZcConf({
    //   swfPath: '../bower_components/zeroclipboard/dist/ZeroClipboard.swf'
    // });

    $stateProvider
        .state('admin.team', {
            url: '/team',
            templateUrl: 'templates/admin/team/index.html',
            controller : 'TeamManagementParentController'
        })
        .state('admin.team.members', {
            url: '/members',
            templateUrl: 'templates/admin/team/members/list.html',
            controller: 'TeamMembersController'
        })
        .state('admin.team.invite', {
            url: '/invite',
            templateUrl: 'templates/admin/team/members/invite.html',
            controller: 'InviteMembersController'
        })
        .state('admin.team.settings', {
            url: '/settings',
            templateUrl: 'templates/admin/team/settings.html',
            controller : 'TeamSettingsController',
            resolve : {
                $company : function(Restangular , $stateParams){
                    return Restangular.one('company/getUsersCompanies').get();
                }
            }
        })
        .state('admin.team.profile', {
            url: '/profile',
            templateUrl: 'templates/admin/team/profile.html',
            controller : 'TeamBioController',
            resolve : {
                $company : function(Restangular , $stateParams){
                    return Restangular.one('company/getUsersCompanies').get();
                }
            }
        })
        .state('admin.team.dashboard', {
            url: '/dashboard',
            templateUrl: 'templates/admin/team/dashboard.html'
        })
        .state('admin.team.wizards', {
            url: '/wizard',
            templateUrl: 'templates/admin/team/wizards.html',
            controller : 'teamWizardsController',
            resolve: {
                $wizards: function( TeamWizards ){
                    return TeamWizards.GetAll();
                },
                $wizards_server : function( Restangular , $company){
                    return Restangular.all('wizard').customGET('',{is_completed : 1 , company_id : $company.id})
                },
                $company : function(Restangular , $stateParams){
                    return Restangular.one('company/getUsersCompanies').get();
                }
            }
        })
        .state('admin.team.wizard', {
            url: '/wizard/:id',
            templateUrl: 'templates/admin/team/wizard/wizard.html',
            controller : 'teamWizardController',
            resolve: {
                $nodes : function(Nodes){
                    return Nodes.GetAll();
                },
                $wizard: function( TeamWizards , $stateParams){
                    return TeamWizards.GetCurrent($stateParams.id);
                },
                $company : function(Restangular , $stateParams){
                    return Restangular.one('company/getUsersCompanies').get();
                },
                $wizard_server : function( Restangular , $stateParams , $company){
                    return Restangular.all('wizard').customGET('',{slug :$stateParams.id , company_id : $company.id})
                }
            }
        })
});