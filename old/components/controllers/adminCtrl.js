app.controller('AdminController', function ($scope,Upload ,$window,$sessionStorage, $localStorage,$rootScope, $state,$user, $modal, Restangular, notify,$site,$access_levels,$support_tickets,$companies,$location) {
    $rootScope.user = $user;

     if($site && $site.meta_data){
        angular.forEach( $site.meta_data, function( value, key )
            {
                if(value && value.key)
                    $site[value.key] = parseInt(value.value);
            } 
        );
    }
    if(typeof $site['show_wizard'] == 'undefined')
        $site['show_wizard'] = 1;
    
    $scope.site = $site;
    console.log($scope.site)

    if ($user.id == $localStorage.user.id)
        $rootScope.user.access_token = $localStorage.user.access_token;
    
	$scope.access_levels = $access_levels;
    $scope.options.theme = '';
    $scope.support_ticket_count = $site.unread_support_ticket;
    $scope.companies = $companies.companies;
    $rootScope.companies = $scope.companies;
    $scope.current_company = _.find($scope.companies, {selected: 1});
    $scope.sites = _.find($companies.sites , function(k , s){
        return parseInt(s) == $scope.current_company.id;
    } )

    $rootScope.is_admin = $site.is_admin;
    $rootScope.adminLoggedIn=$site.is_admin;
    $rootScope.page_title = $site.name + " - " + "Admin";
    $rootScope.site = $scope.site;


    $scope.HideAdminMenu = function() {

        $("body").removeClass("nav_open");

    };

    $scope.HideAdminMenu();

    $scope.showNotifications = function()
    {
        var modalInstance = $modal.open( {
            templateUrl: '/templates/modals/primaryAdminNotification.html',
            controller: "modalController",
            scope: $scope
        } );
        modalInstance.result.then( function()
        {
            Restangular.all( "siteNoticeSeen" ).post( { 'site_notice_id': $scope.notificationResponse.id } );
        });
    }

    $scope.getPrimaryAdminNotifications=function()
    {
        $scope.notification={};

        Restangular.all('/siteNotice/getPrimaryAdminNotices').getList().then(function (response) {

            if( response.length < 1 )
                return;

            response = response[0];

            $scope.notificationResponse = response;

            $scope.notification.content = response.content;

            $scope.notification.title = response.title;

            $scope.showNotifications();
        });
    }
    

    $scope.isAgentOrGreater = function(){
        if( typeof $scope.current_company == 'undefined' || typeof $scope.current_company.id == 'undefined' )
            return;

        $role=_.find($user.role,function(r){
            return r.company_id == $scope.current_company.id;
        });

        if( typeof $role == 'undefined' ) {
            $role=_.find($user.role,function(r){
                return r.site_id==$site.id;
            });
        }

        if(typeof $role == 'undefined'){
            return;
        }

        $role_type=Math.min.apply(Math,$role.type.map(function(t){return t.role_type;}));

        if($role_type<=5)
            $rootScope.isAgentOrGreaterCheck='true';
        else
            $rootScope.isAgentOrGreaterCheck='false';

        $scope.isAgentOrGreaterCheck = $rootScope.isAgentOrGreaterCheck;
    }

    $scope.isAgentOrGreater();

    $scope.isAgent = function(role){
        if( typeof role == 'undefined' )
            role = $user.role;
        if(typeof role == 'undefined'){
            return false;
        }
        for (var i = role.length - 1; i >= 0; i--) {
            var agent = _.findWhere(role[i].type ,{role_type : 5});
            if( !agent )
                agent = _.findWhere(role[i].type ,{role_type : "5"});
            if(agent){
                return true;
            }
        }
        
        return false;
    }

    $scope.isAdmin = function(role){
        if( typeof role == 'undefined' )
            role = $user.role;
        if(typeof role == 'undefined'){
            return false;
        }
        for (var i = role.length - 1; i >= 0; i--) {
            var admin = _.findWhere(role[i].type ,{role_type : 4});
            if( !admin )
                admin = _.findWhere(role[i].type ,{role_type : "4"});
            if(admin){
                return true;
            }
        }
        
        return false;
    }


    $scope.isTeamMember = function(role){
        if( typeof role == 'undefined' )
            role = $user.role;
        if(typeof role == 'undefined'){
            return false;
        }
        for (var i = role.length - 1; i >= 0; i--) {
            var primaryAdmin = _.findWhere(role[i].type ,{role_type : "1"});
            if( !primaryAdmin )
                primaryAdmin = _.findWhere(role[i].type ,{role_type : 1});
            var owner = _.findWhere(role[i].type ,{role_type : "2"});
            if( !owner )
                owner = _.findWhere(role[i].type ,{role_type : 2});
            var manager = _.findWhere(role[i].type ,{role_type : "3"});
            if( !manager )
                manager = _.findWhere(role[i].type ,{role_type : 3});
            if(primaryAdmin||owner||manager){
                return true;
            }
        }
        return false;
    }

    $scope.getPrimaryAdminNotifications();

    $scope.teamRoleName = function(role){
        for (var i = role.length -1; i >= 0; i -- ) {
            if( $scope.current_company && role[i].company_id == $scope.current_company.id ) {
                var primaryOwner = _.findWhere(role[i].type, {role_type: 1}) || _.findWhere(role[i].type, {role_type: "1"});
                var owner = _.findWhere(role[i].type, {role_type: 2}) || _.findWhere(role[i].type, {role_type: "2"});
                var manager = _.findWhere(role[i].type, {role_type: 3}) || _.findWhere(role[i].type, {role_type: "3"});
            }
        }

        if( primaryOwner )
            return 'Primary Owner';
        if( owner )
            return 'Owner';
        if( manager )
            return 'Manager';

        return '';
    }

    /*$scope.isAdminOrManagerOwnerOrPrimaryAdmin = function(user){
        var primaryAdmin = _.findWhere(user.type ,{role_type : 1});
        var owner = _.findWhere(user.type ,{role_type : 2});
        var manager = _.findWhere(user.type ,{role_type : 3});
        var admin = _.findWhere(user.type ,{role_type : 4});
        if(primaryAdmin||owner||manager||admin){
            return true;
        }
        
        return false;
    }*/
    
    $scope.member_access = ['admin.account.memberships' , 'admin.account' , 'admin.account.settings' ,
                            'admin.account.profile' , 'admin.account.photo'];
    $scope.agent_access = ['admin.site.membership' , 'admin.team.helpdesk' , 'admin.team.helpdesk.agent-stats' , 
                            'admin.team.helpdesk.agent-stats.agent-stat' , 'admin.team.helpdesk.tickets' ,
                            'admin.team.helpdesk.settings' , 'admin.team.helpdesk.ticket'];
    $scope.agent_access = $scope.agent_access.concat($scope.member_access);                        
    $scope.admin_access = []; //not used for now
    $scope.team_access = []; //not used for now

    $rootScope.is_agent = $scope.isAgent($user.role);
    $rootScope.is_site_admin = $scope.isAdmin($user.role);
    $rootScope.is_team_member = $scope.isTeamMember($user.role);
    $rootScope.team_role_name = $scope.teamRoleName($user.role);

    $scope.is_team_member = $rootScope.is_team_member;
    $scope.is_agent = $rootScope.is_agent;
    $scope.is_site_admin = $rootScope.is_site_admin;
    $scope.team_role_name = $rootScope.team_role_name;

    //if not logged in
    if (!$scope.$storage.user){
        $state.go('public.app.login');
    }   
    //if it is a member and trying to access unauthorized route
    if($scope.member_access.indexOf($state.current.name) < 0 && !($rootScope.is_site_admin || $rootScope.is_team_member || $rootScope.is_agent)){
        $state.go('admin.account.memberships');
        return;
    }
    //if it is an agent and trying to access unauthorized route
    if($scope.agent_access.indexOf($state.current.name) < 0  && !($rootScope.is_site_admin || $rootScope.is_team_member)){
        $state.go('admin.account.memberships');
        return;
    }
    //if it is an admin and trying to access unauthorized route
    if($scope.agent_access.indexOf($state.current.name) < 0 && $state.current.name.split('.')[1] != 'site' && !$rootScope.is_team_member){
        $state.go('admin.account.memberships');
        return;
    }

    var access = $scope.isTeamMember($user.role);
    console.log($state.current)
    if($state.current.name.split('.')[1]=='affiliates'){
        if(!access ){
            $state.go('admin.account.memberships');
        }
    }

    /*if (!$site.is_admin){
        $state.go('public.app.lessons');
    }*/

    //$rootScope.hasAffiliateAccess = $scope.isManagerOwnerOrPrimaryAdmin($user);
    //$rootScope.hasContentAccess = $scope.isAdminOrManagerOwnerOrPrimaryAdmin($user);
    //$rootScope.hasSiteRolesAccess = $scope.isManagerOwnerOrPrimaryAdmin($user);
    //$rootScope.hasDeleteSitesAccess = $scope.isManagerOwnerOrPrimaryAdmin($user);
    //$rootScope.hasCreateSitesAccess = $scope.isManagerOwnerOrPrimaryAdmin($user);

    // Company check should be after we are sure the user is an admin.

    var new_company = _.find($scope.companies, {id : $scope.site.company_id});

    if (new_company && $scope.site.company_id && $scope.current_company && $scope.current_company.id && $scope.site.company_id != $scope.current_company.id)
    {
        $scope.current_company = new_company;
        Restangular.one('user/setCompany').customPOST({'current_company_id' : $scope.current_company.id}).then(function(response){
            Restangular.one('user' , $localStorage.user.id).get().then(function(response){
                $rootScope.user = response;
                $user = $rootScope.user;

                $rootScope.is_agent = $scope.isAgent($user.role);
                $rootScope.is_site_admin = $scope.isAdmin($user.role);
                $rootScope.is_team_member = $scope.isTeamMember($user.role);
                $rootScope.team_role_name = $scope.teamRoleName($user.role);
            });
        });
    }

	$scope.showComingSoon = function(){
        $name = 'This feature is coming soon';
        $scope.message = 'This feature will arrive shortly, so hold tight!';
        var modalInstance = $modal.open({
            templateUrl: '/templates/modals/comingSoon.html',
            controller: "modalController",
            scope: $scope,
        });
    } 

    $scope.selectCompany = function(company)
    {
        if (typeof $scope.current_company != 'undefined' && typeof $scope.current_company.id != 'undefined' && company.id == $scope.current_company.id) return;
        Restangular.one('user/setCompany').customPOST({'current_company_id' : company.id}).then(function(response){
            $window.location.href = '//my.' + $rootScope.app.rootDomain;
        });
    }

    $scope.imageUpload = function(files){

        for (var i = 0; i < files.length; i++) {
            var file = files[i];
            Upload.upload({
                url: $scope.app.apiUrl + '/utility/upload',
                file: file
            })
                .success(function (data, status, headers, config) {
                    console.log(data.file_name);
                    var editor = $.summernote.eventHandler.getModule();
                    file_location = '/uploads/'+data.file_name;
                    editor.insertImage($scope.editable, data.file_name);
                }).error(function (data, status, headers, config) {
                    console.log('error status: ' + status);
                });
        }
    }
});

app.controller('AgentDashboardController', function ($scope, $localStorage,$rootScope,$agents, $state, $user, $modal, Restangular, notify,$site,$unassigned_tickets , $my_open_tickets , $sites) {
    
    $scope.agents=$agents;
    $scope.user = $user;
    $scope.my_open_tickets = $my_open_tickets.tickets;
    $scope.sites = $sites.sites;
    $scope.total_my_open_tickets = $my_open_tickets.count;
    $scope.unassigned_tickets = $unassigned_tickets.tickets;
    $scope.total_unassigned_tickets = $unassigned_tickets.count;
    $scope.total_tickets = $scope.total_unassigned_tickets + $scope.total_my_open_tickets;
    $scope.$parent.total_tickets = $scope.total_tickets;

    $scope.ticket = {company_id : $sites.company_id , site_id : $sites.sites ? $sites.sites : []};

    $scope.ticket.sites = $sites.sites;

    $scope.selection = {ticketSelected : false , selectedTickets :[]};

    $scope.parseResponse=function($support_tickets)
    {
        $scope.unassigned_tickets=[];
        $scope.my_assigned_tickets=[];

        for(var i=0;i<$support_tickets.length;i++) {

            if($support_tickets[i].agent_id == 0 )
                $scope.unassigned_tickets.push($support_tickets[i]);
            else if( $support_tickets[i].agent_id == $user.id )
                $scope.my_assigned_tickets.push($support_tickets[i]);

        }
    }

    $scope.isAgent = function(agents){
        var agent = _.findWhere(agents ,{user_id : $user.id});
        if(agent){
            return true;
        }
        return false;
    }


   // $scope.parseResponse($support_tickets);
    $scope.currentTickets = 1;
    $scope.agents = $agents;
    $rootScope.is_agent = true;
    if(!$scope.isAgent($agents)){
        $rootScope.is_agent = false;
        $state.go('admin.account.memberships');
    }

    $scope.loadMore = function(){
        $scope.disable = true;
        Restangular.all('').customGET('supportTicket?p='+(++$scope.currentTickets)).then(function (response) {
            $support_tickets = $support_tickets.concat(response);
            //$scope.parseResponse($support_tickets);
            if(response.length>0)
                $scope.disable = false;
        });
    }

    console.log($scope.agents);

    $scope.openModal = function(){
        var modalInstance = $modal.open({
            templateUrl: '/templates/modals/ticket_modal.html',
            controller: "modalController",
            scope: $scope
        });
        modalInstance.result.then(function () {
            if($scope.ticket.user_email)
            {
                $scope.ticket.user_id = $scope.ticket.user_email.id;
                $scope.ticket.user_email = $scope.ticket.user_email.email;
            }
            var ticket = angular.copy($scope.ticket);
            delete ticket.sites;
            Restangular.all('supportTicket').post(ticket).then(function (response) {
                response.user = $scope.ticket.user_name;
                response.status = 'Open';
                if(response.agent_id==0)
                    $scope.unassigned_tickets.push(response);
                else if(response.agent_id==$user.id)
                    $scope.my_open_tickets.push(response);
                $scope.ticket = {company_id : $scope.ticket.company_id , site_id : $scope.ticket.site_id , sites : $scope.ticket.sites};
            });
        })
    }

    $scope.$watch('selection.selectedTickets' , function(selectedTickets){
        if(selectedTickets.length==0){
            $scope.selection.ticketSelected = false;
        }
    })

    $scope.selectionChange = function(ticket){
        var exists = $scope.selection.selectedTickets.indexOf(ticket.id) >= 0;
        if(exists){
            $scope.selection.selectedTickets = _.without($scope.selection.selectedTickets , ticket.id);
        }else{
            $scope.selection.selectedTickets.push(ticket.id);
            $scope.selection.ticketSelected = true;
        }
    }

    $scope.updateMultiple = function(property , value){
        var data = {property : property , value : value}
        data.tickets = $scope.selection.selectedTickets;
        Restangular.all('supportTicket').customPUT(data , 'bulk' ).then(function(response){
            if(response.success){
                $scope.my_open_tickets = _.reject($scope.my_open_tickets , function(item){ return $scope.selection.selectedTickets.indexOf(item.id)>=0 });
                $scope.all_selected = false;
            }
        })
    }

    $scope.selectAll = function(){
        $scope.all_selected = !$scope.all_selected;
        for (var i = $scope.my_open_tickets.length - 1; i >= 0; i--) {
            $scope.my_open_tickets[i].selected = $scope.all_selected;
        };
        if($scope.all_selected)
            $scope.selection = {ticketSelected : true , selectedTickets:_.pluck($scope.my_open_tickets , 'id')}
        else
            $scope.selection = {ticketSelected : false , selectedTickets :[]};
    }

    $scope.search_users = function(search){
        if(!search)
            return;
        Restangular.all('role').getList({site_id : $scope.ticket.site_id , q : search , count :10 }).then(function(response){
            if(response.length==0){
                //$scope.searched_users = [{email : search , fisrt_name : 'New User'}]
                $scope.searched_users = _.pluck(response , 'user');
            }else
                $scope.searched_users = _.pluck(response , 'user');
        })
    }

    $scope.siteUrl = function(ticket) {
        var site = _.findWhere($scope.sites, {id: parseInt( ticket.site_id )}) || _.findWhere($scope.sites, {id: ticket.site_id + ''});

        if( typeof site != 'undefined' )
            return site.subdomain + '.smartmember.com';
        else
            return '';
    }

    $scope.customSort = function(ticket){
        if(ticket.last_replied_at)
            return ticket.last_replied_at
        return ticket.created_at;
    }

});

app.controller('SingleAgentDashboardController', function ($scope, $localStorage,$rootScope,$agents, $agent_id,$state, $user, $modal, Restangular, notify,$site,$support_tickets) {
    $scope.agent= _.find($agents, function(agent){ return agent.id == $agent_id; });
    $scope.jobtitle="";
    for(var i=0;i<$scope.agent.type.length;i++)
    {
        if($scope.agent.type[i].role_type==1)
        {
            $scope.jobtitle="Owner";
            break;
        }
        else if($scope.agent.type[i].role_type==2)
        {
            $scope.jobtitle="Admin";
        }
        else if($scope.agent.type[i].role_type==4)
        {
            if($scope.jobtitle!="Admin")
                $scope.jobtitle="Agent";
        }
    }

    $scope.solvedCount=0;
    for(var i=0;i<$support_tickets.length;i++)
    {
        if($support_tickets[i].status.toLowerCase()=="solved")
        {
            $scope.solvedCount++;
        }
    }

 });