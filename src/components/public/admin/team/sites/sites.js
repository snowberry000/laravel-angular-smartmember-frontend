var app = angular.module("app");

app.config(function($stateProvider){
	$stateProvider
		.state("public.admin.team.sites",{
			url: "/sites",
			templateUrl: "/templates/components/public/admin/team/sites/sites.html",
			controller: "SitesController"
		})
}); 

app.controller("SitesController", function ($scope, $rootScope, $localStorage, toastr , $location, $user ,Restangular, $state,  notify) {
	$scope.adminSites=[];
	$scope.memberSites=[];
	$scope.loading=true;
	if (!$scope.$storage.user){
	    $state.go('public.sign.in');
	    return;
	}
	
	$scope.currentPage = 1;
	$scope.adminPagination = {current_page: 1};
	$scope.adminPagination.total_count = 1;

	$scope.can_create_sites = ($scope.site != 'undefined' && typeof $scope.site.can_create_sites != 'undefined' ? $scope.site.can_create_sites : false);

	$scope.isAgent = function(member , site){
	    for(var i=0;i<member.length;i++){
	        var agent = _.findWhere(member[i].type ,{role_type : 5});
	        if(agent && site.id==member[i].site_id){
	            return true;
	        }
	    }
	    return false;
	}

	$scope.isAdmin = function(member , site){
	    var role = _.findWhere(member ,{site_id : site.id});
	    if( typeof role != 'undefined' ) {
	        var max_role = 9999;
	        for (var i = 0; i < role.type.length; i++) {
	            if (role.type[i].role_type < max_role)
	                max_role = role.type[i].role_type;
	        }

	        if (max_role < 5) return true;
	    }
	    return false;

	}

	$scope.isTeamMember = function(member , site){
	    for(var i=0;i<member.length;i++){
	        var primary_owner = _.findWhere(member[i].type ,{role_type : 1});
	        var owner = _.findWhere(member[i].type ,{role_type : 2});
	        var manager = _.findWhere(member[i].type ,{role_type : 3});

	        if((primary_owner || owner || manager) && (!site || site.id==member[i].site_id)){
	            return true;
	        }
	    }
	    return false;
	}

	$scope.isTeamPrimaryOwner = function (member, site) {
	    for(var i=0;i<member.length;i++) {
	        var primary_owner = _.findWhere(member[i].type ,{role_type : 1}) || _.findWhere(member[i].type ,{role_type : "1"});
	        if (primary_owner && (!site || site.id == member[i].site_id))
	            return true;
	    }

	    return false;
	}


	$scope.setRoleName = function(site){
	    var member = $user.role;
	    if(site.is_team_member){
	        for(var i=0;i<member.length;i++){
	            var primary_owner = _.findWhere(member[i].type ,{role_type : 1});
	            var owner = _.findWhere(member[i].type ,{role_type : 2});
	            var manager = _.findWhere(member[i].type ,{role_type : 3});

	            if(primary_owner && (!site || site.id==member[i].site_id)){
	                return "Primary Owner";
	            }
	            if(owner && (!site || site.id==member[i].site_id)){
	                return "Owner";
	            }
	            if(manager && (!site || site.id==member[i].site_id)){
	                return "Manager";
	            }
	        }
	    }else if(site.is_site_admin){
	        return "Admin";
	    }
	}


	$rootScope.is_team_member = $scope.isTeamMember($user.role);
	$rootScope.is_team_primaryOwner = $scope.isTeamPrimaryOwner($user.role);

	Restangular.all('site').customGET('members').then(function(response) {
	        $sites = response;
	        $scope.loading=false;
	        $scope.adminPagination.total_count=$sites.public.admin.count;
	        $sites.admin=$sites.public.admin.sites;
	        $sites.member=$sites.member.sites;
	        


	        angular.forEach($sites.admin, function(site, key) {
	            site.data = {};
	            angular.forEach(site.meta_data, function(data, key) {
	                site.data[data.key] = data.value;
	            });
	            site.is_site_admin = $scope.isAdmin($user.role , site);
	            site.is_team_member = $scope.isTeamMember($user.role , site);
	            site.is_agent = $scope.isAgent($user.role , site);
	            site.role_name = $scope.setRoleName(site);
	        });

	        angular.forEach($sites.member, function(site, key) {
	            site.data = {};

	            angular.forEach(site.meta_data, function(data, key) {
	                site.data[data.key] = data.value;
	            });

	            site.is_agent = $scope.isAgent($user.role , site);
	            site.is_site_admin = $scope.isAdmin($user.role, site);
	            
	        });

	        $scope.sites = $sites;
	        $scope.sites_loaded = true;
	        $scope.adminSites[$scope.adminPagination.current_page]=$sites.admin;
	        $scope.memberSites[$scope.adminPagination.current_page]=$sites.member;
	        var isMemberTraining = _.find($sites.member, {'subdomain' : 'training'});
	        var isAdminTraining = _.find($sites.admin, {'subdomain' : 'training'});
	        $scope.can_see_sites = isMemberTraining || isAdminTraining || (($sites.admin)&&($sites.public.admin.length > 0));
	        $scope.can_add_sites = isMemberTraining || isAdminTraining;   
	        $scope.is_customer = isMemberTraining || isAdminTraining;

	        //  || $sites.public.admin.length > 0
	        if (($scope.is_customer) && $state.current.name != 'public.admin.account.memberships' )
	        {
	            $state.go("public.admin.team.sites");
	        } else if( $state.current.name != 'public.admin.team.sites' ) {
	            $state.go("public.admin.account.memberships")
	        }
	        $rootScope.can_add_sites = $scope.can_add_sites;

	        $scope.sites = $sites;
	});
	
	$scope.domain = $location.host().split(".").splice(-2, 1).pop();
	$scope.isCollapsed = false;
	$scope.env = $scope.app.env;
	$scope.can_add_sites = false; //can_add_sites;

	$scope.deleteSite = function (site) {
	    var modalInstance = $modal.open({
	        templateUrl: '/templates/modals/deleteConfirm.html',
	        controller: "modalController",
	        scope: $scope,
	        resolve: {
	            id: function () {
	                return site.id
	            }
	        }

	    });
	    modalInstance.result.then(function () {
	    
	        Restangular.one('site',site.id).remove().then(function () {
	        
	            $scope.sites.admin = _.without($scope.sites.admin, site);
	            $scope.adminSites[$scope.adminPagination.current_page] = _.without($scope.adminSites[$scope.adminPagination.current_page], site);
	        	toastr.success("Site deleted successfully!");
	        });
	    })
	};

	$scope.loadMore = function(){
	    // $scope.disable = true;
	    Restangular.all('site').customGET('members?p='+($scope.adminPagination.current_page) + ( $scope.query ? '&q=' + encodeURIComponent( $scope.query ) : '' ) ).then(function (response) {
	        $sites = response;
	        $scope.adminPagination.total_count=$sites.public.admin.count;
	        $sites.admin=$sites.public.admin.sites;
	        $sites.member=$sites.member.sites;
	        // if(response.public.admin.length>0 || response.member.length>0)
	        //     $scope.disable = false;
	        
	        angular.forEach($sites.admin, function(site, key) {
	            site.data = {};
	            angular.forEach(site.meta_data, function(data, key) {
	                site.data[data.key] = data.value;
	            });
	        });

	        angular.forEach($sites.member, function(site, key) {
	            site.data = {};

	            angular.forEach(site.meta_data, function(data, key) {
	                site.data[data.key] = data.value;
	            });

	            site.is_agent = $scope.isAgent($user.role);
	            
	        });
	        $scope.sites.admin = $scope.sites.public.admin.concat($sites.admin);
	        console.log($scope.sites.public.admin.length)
	        $scope.sites.member = $scope.sites.member.concat($sites.member);
	        $scope.adminSites[$scope.adminPagination.current_page]=$sites.admin;
	        $scope.memberSites[$scope.adminPagination.current_page]=$sites.member;
	    });
	}

	$scope.search = function(){

	    $scope.loading = true;
	    $scope.adminSites=[];
	    $scope.memberSites=[];
	    $scope.currentPage = 1;
	    $scope.adminPagination = {current_page: 1};
	    $scope.adminPagination.total_count = 1;

	    Restangular.all('site').customGET('members?p='+($scope.adminPagination.current_page) + ( $scope.query ? '&q=' + encodeURIComponent( $scope.query ) : '' ) ).then(function (response) {
	        $scope.loading = false;
	        $sites = response;
	        $scope.adminPagination.total_count=$sites.public.admin.count;
	        $sites.admin=$sites.public.admin.sites;
	        $sites.member=$sites.member.sites;
	        // if(response.public.admin.length>0 || response.member.length>0)
	        //     $scope.disable = false;

	        angular.forEach($sites.admin, function(site, key) {
	            site.data = {};
	            angular.forEach(site.meta_data, function(data, key) {
	                site.data[data.key] = data.value;
	            });
	        });

	        angular.forEach($sites.member, function(site, key) {
	            site.data = {};

	            angular.forEach(site.meta_data, function(data, key) {
	                site.data[data.key] = data.value;
	            });

	            site.is_agent = $scope.isAgent($user.role);

	        });
	        $scope.sites.admin = $scope.sites.public.admin.concat($sites.admin);
	        console.log($scope.sites.public.admin.length)
	        $scope.sites.member = $scope.sites.member.concat($sites.member);
	        $scope.adminSites[$scope.adminPagination.current_page]=$sites.admin;
	        $scope.memberSites[$scope.adminPagination.current_page]=$sites.member;
	    });
	}
});