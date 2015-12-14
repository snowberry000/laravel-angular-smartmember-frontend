app.config(function ($stateProvider, $httpProvider, $urlRouterProvider) {
    // uiZeroclipConfigProvider.setZcConf({
    //   swfPath: '../bower_components/zeroclipboard/dist/ZeroClipboard.swf'
    // });

    $stateProvider
        .state('admin.team.helpdesk', {
            url: '/helpdesk',
            templateUrl: 'templates/admin/team/helpdesk/index.html',
            controller : 'HelpdeskParentController'
        })

        .state('admin.team.helpdesk.agent-stats', {
            url: '/agent-stats',
            templateUrl: 'templates/admin/team/helpdesk/agent-stats.html',
            controller: 'AgentDashboardController',
            resolve: {
                $support_tickets: function(Restangular) {
                    return Restangular.all('').customGET('supportTicket?p=1');
                },
                $agents : function(Restangular , $site) {
                    return Restangular.all('role').customGET('agents');
                }
            }
        })
        .state('admin.team.helpdesk.agent-stats.agent-stat', {
            url: '/:id?',
            templateUrl: 'templates/admin/team/helpdesk/agent-stat.html',
            controller: 'SingleAgentDashboardController',
            resolve: {
                $agent_id : function($stateParams) {
                    return $stateParams.id;
                }
            }
        })

        .state('admin.team.helpdesk.tickets', {
            url: '/tickets',
            templateUrl: 'templates/admin/team/helpdesk/tickets.html'
        })

        .state('admin.team.helpdesk.tickets.open', {
            url: '/open',
            templateUrl: 'templates/admin/team/helpdesk/tickets-open.html',
            controller : 'openTicketsController'
        })
        .state('admin.team.helpdesk.tickets.pending', {
            url: '/pending',
            templateUrl: 'templates/admin/team/helpdesk/tickets-pending.html',
            controller : 'pendingTicketsController'
        })
        .state('admin.team.helpdesk.tickets.solved', {
            url: '/solved',
            templateUrl: 'templates/admin/team/helpdesk/tickets-solved.html',
            controller : 'solvedTicketsController'
        })
        .state('admin.team.helpdesk.tickets.spam', {
            url: '/spam',
            templateUrl: 'templates/admin/team/helpdesk/tickets-spam.html',
            controller : 'spamTicketsController'
        })













        .state('admin.team.helpdesk.settings', {
            url: '/settings',
            templateUrl: 'templates/admin/team/helpdesk/settings.html'
        })

        .state('admin.team.helpdesk.ticket', {
            url: '/ticket/:id?',
            templateUrl: 'templates/admin/team/helpdesk/ticket.html',
            controller: 'adminSupportTicketEditController',
            resolve: {
                $ticket: function(Restangular , $stateParams){
                    if ($stateParams.id)
                        return Restangular.one('supportTicket' , $stateParams.id).get();
                }
            }
        })

        .state('admin.team.helpdesk.creator', {
            url: '/create',
            templateUrl: 'templates/admin/team/helpdesk/ticketCreate.html',
            controller: 'adminSupportTicketCreateController',
            resolve: {
                loadPlugin: function ($ocLazyLoad) {
                    return $ocLazyLoad.load([
                        {
                            name: 'ngSanitize'
                        },
                        {
                            name: 'ui.select'
                        }
                    ]);
                }
            }
        })

});