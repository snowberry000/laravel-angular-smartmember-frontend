app.controller('MyController', function ($scope, toast,$window, $company ,$rootScope, $state, $location, $modal, Restangular,$localStorage, notify,$site,$user) {
	$scope.site = $site;
	$scope.companies = [];
	$scope.current_company = '';
    $scope.company_toggle = false;

    //$scope.companies = $company.companies;      
    console.log($scope.companies)       
    //$company = _.find($scope.companies, {selected : 1})     
    $scope.current_company = $company;  
    //console.log($scope.current_company)     
    $rootScope.current_company = $company;

    $scope.isAgent = function(role){
        for (var i = role.length - 1; i >= 0; i--) {
            var agent = _.findWhere(role[i].type ,{role_type : 5}) || _.findWhere(role[i].type ,{role_type : "5"});
            if(agent){
                return true;
            }
        };
        return false;
    }

    $scope.isAdmin = function(role){
        if( typeof role == 'undefined' )
            role = $user.role;
        for (var i = role.length - 1; i >= 0; i--) {
            var admin = _.findWhere(role[i].type ,{role_type : 4}) || _.findWhere(role[i].type ,{role_type : "4"});
            if(admin){
                return true;
            }
        }
        return false;
    }

    $scope.hasAccess=function(role)
    {
        if( typeof role == 'undefined' )
            role = $user.role;

        for (var i = role.length - 1; i >= 0; i--) {
            var Manager = _.findWhere(role[i].type ,{role_type : 3});
            if( !Manager )
                Manager = _.findWhere(role[i].type ,{role_type : "3"});
            var Owner = _.findWhere(role[i].type ,{role_type : 2});
            if( !Owner )
                Owner = _.findWhere(role[i].type ,{role_type : "2"});
            var PrimaryAdmin = _.findWhere(role[i].type ,{role_type : 1});
            if( !PrimaryAdmin )
                PrimaryAdmin = _.findWhere(role[i].type ,{role_type : "1"});
            if(Manager || Owner || PrimaryAdmin){
                return true;
            }
        }
        return false;
    }

    $scope.teamRoleName = function(role){

        //$scope.current_company = _.find($scope.companies, {selected: 1});

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

    if ($location.search().verification_hash)
    {
        $localStorage.verification_hash = $location.search().verification_hash;
    }

	if (!$localStorage.user){
		window.location.href='http://'+$rootScope.subdomain+'.'+$rootScope.app.domain+"/sign/in/";
		return;
	}
    $rootScope.team_role_name = $scope.teamRoleName($user.role);
    $scope.team_role_name = $rootScope.team_role_name;
    var access = $scope.hasAccess($user.role);
    console.log("My access is" + access)
    if($state.current.name.split('.')[1]=='smartmail'){
        console.log(access)
        if(!access ){
            $state.go('admin.team.sites');
        }
    }

	Restangular.one('user' , $localStorage.user.id).get().then(function(response){
		$rootScope.user = response;
        $user = $rootScope.user;

        if ($localStorage.verification_hash)
        {
            Restangular.one('user/linkAccount').customPOST({'verification_hash' : $localStorage.verification_hash}).then(function(response){
                if (response.status && response.status == 'OK')
                {
                    toastr.success('Accounts linked');
                }
                $state.go("admin.account.settings", {}, {reload: true});
            })

            $localStorage.verification_hash = undefined;
        }

	});

	$rootScope.is_admin = true ;//$site.is_admin;
	$rootScope.is_site_admin = $scope.isAdmin($user.role);
    $rootScope.is_agent = $scope.isAgent($user.role);
    $rootScope.is_team_member = $scope.hasAccess($user.role);
    $scope.is_team_member = $rootScope.is_team_member;
    $scope.is_agent = $rootScope.is_agent;
    $scope.is_site_admin = $rootScope.is_site_admin;
    $scope.is_admin = $rootScope.is_admin;

    if (!$scope.$storage.user){
        $state.go('public.app.login');
    }

    if($state.current.name.split('.')[1]=='team-wizard' || $state.current.name.split('.')[1]=='site-wizard'){       
          if($scope.team_role_name !='Primary Owner' ){     
              $state.go('admin.team.sites');
              return;       
          }     
      }     
      var access = $scope.hasAccess($user.role);        
      if($state.current.name.split('.')[1]=='smartmail' || $state.current.name.split('.')[1]=='integrations' || $state.current.name.split('.')[1]=='affiliates' || $state.current.name.split('.')[1]=='team-management' || $state.current.name.split('.')[1]=='team-settings'){     
          console.log(access)       
          if(!access ){     
              $state.go('admin.team.sites');
              return;       
          }     
      }     
      if($rootScope.current_company && !$rootScope.current_company.is_completed && $rootScope.is_team_member && $scope.team_role_name =='Primary Owner'){       
          $rootScope.is_not_allowed = true;     
          $state.go('admin.team.dashboard');
          return false;     
      }

	  // Companies should be fetch after the user has logged-in. 
    /*Restangular.one('company/getUsersCompanies').get().then(function(response){
        $scope.companies = response.companies;
        $company = _.find($scope.companies, {selected : 1})
        $scope.current_company = $company;
        $rootScope.current_company = $company;

        $rootScope.team_role_name = $scope.teamRoleName($user.role);
        $scope.team_role_name = $rootScope.team_role_name;
    });*/

});

