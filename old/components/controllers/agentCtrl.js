app.controller('AgentController', function ($scope, $window,$sessionStorage, $localStorage,$rootScope, $state,$user, $modal, Restangular, notify,$site,$access_levels,$companies,$location) {
    $scope.site = $site;
    $rootScope.user = $user;

    if ($user.id == $localStorage.user.id)
        $rootScope.user.access_token = $localStorage.user.access_token;
    
    $scope.access_levels = $access_levels;
    $scope.options.theme = '';
    $scope.support_ticket_count = $site.unread_support_ticket;
    $scope.companies = $companies.companies;
    $scope.current_company = _.find($scope.companies, {selected: 1});


    $rootScope.is_admin = $site.is_admin;
    $rootScope.adminLoggedIn=$site.is_admin;
    $rootScope.page_title = $site.name + " - " + "Admin";
    $scope.isAgent = function(role){
        if( typeof role == 'undefined' )
            role = $user.role;

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

    $scope.teamRoleName = function(role){
        for (var i = role.length -1; i >= 0; i -- ) {
            if( role[i].company_id == $scope.current_company.id ) {
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

    var access = $scope.isTeamMember($user.role);
    console.log($state.current)
    if($state.current.name.split('.')[1]=='affiliates'){
        if(!access ){
            $state.go('admin.account.memberships');
        }
    }

    if (!$scope.$storage.user){
        $state.go('public.app.login');
    }   

    if (!$site.is_admin){
        $state.go('public.app.lessons');
    }

    $rootScope.is_agent = $scope.isAgent($user.role);
    $rootScope.is_site_admin = $scope.isAdmin($user.role);
    $rootScope.is_team_member = $scope.isTeamMember($user.role);
    $rootScope.team_role_name = $scope.teamRoleName($user.role);

    //$rootScope.hasAffiliateAccess = $scope.isManagerOwnerOrPrimaryAdmin($user);
    //$rootScope.hasContentAccess = $scope.isAdminOrManagerOwnerOrPrimaryAdmin($user);
    //$rootScope.hasSiteRolesAccess = $scope.isManagerOwnerOrPrimaryAdmin($user);
    //$rootScope.hasDeleteSitesAccess = $scope.isManagerOwnerOrPrimaryAdmin($user);
    //$rootScope.hasCreateSitesAccess = $scope.isManagerOwnerOrPrimaryAdmin($user);

    // Company check should be after we are sure the user is an admin. 
    if ($scope.site.company_id && $scope.current_company && $scope.site.company_id != $scope.current_company.id)
    {
        $scope.current_company = _.find($scope.companies, {id : $scope.site.company_id});
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
     
});
