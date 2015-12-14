app.controller('signController', function ($rootScope,$scope, toastr ,ipCookie, $localStorage,$stateParams, $location, Restangular, $state, $http) {


    $rootScope.page_title = "Smartmember";
    $rootScope.is_admin = true;
    if($location.search().message)
    {
        $rootScope.redirectedFromLoginMessage=true;
    }

    $scope.options.theme = '';

    $scope.site_options = {};

    Restangular.one('site','details').get().then(function(response){
        $logoItem=_.find(response.meta_data, function(item){ return item.key == 'site_logo'; });
        if($logoItem)
            $scope.site_logo=$logoItem.value;
        else
            $scope.site_logo = "http://imbmediab.s3.amazonaws.com/wp-content/uploads/2015/06/Smart-Member-Gray-Icon-Text-01.png";

        $scope.site = response;
        $rootScope.site = response;

        angular.forEach(response.meta_data,function(value){
            $scope.site_options[ value.key ] = value.value;
        });
    });

    //$scope.site_logo = "http://imbmediab.s3.amazonaws.com/wp-content/uploads/2015/06/Smart-Member-Gray-Icon-Text-01.png";
    $scope.action = 0;
    $scope.login_type = "facebook";
    $scope.user = {};   
    $scope.hash = '';
    $scope.current_url = $rootScope.app.domain.indexOf( 'smartmember' ) != -1 ? $rootScope.app.subdomain + '.'+ $rootScope.app.domain : $rootScope.app.domain;
    if ($stateParams.hash) {
        $localStorage.hash = $stateParams.hash;
    }
    if ($location.search().cbreceipt)
    {
        $localStorage.cbreceipt = $location.search().cbreceipt;
    }

    if ($location.search().message)
    {
        toastr.success($location.search().message);
    }

    if ($location.search().error_message)
    {
        if ($location.search().error_message == "Email address already taken")
        {
            $scope.account_exist = true;
        }
        if ($location.search().error_message == "exist from registration")
        {
            $scope.register_exist=true;
        }

    }

    if ($location.search().reset && $location.search().reset == 1)
    {
        $scope.reset_sent = 1;
    }

    $scope.login = function () {
        var user = $scope.user;
        if ($localStorage.hash){
            user.hash = $localStorage.hash;
        }
        if ($localStorage.cbreceipt)
        {
            user.cbreceipt = $localStorage.cbreceipt;
        }

        Restangular.all('auth').customPOST(user, "login").then(function (response) {
            $scope.postAuth(response);
            if($location.search().message)
            {
                $rootScope.redirectedFromLoginMessage=false;
                window.location.href=$localStorage.accessed_url;
            }
        });
    };

    $scope.postAuth = function(response) {
        $scope.$storage.user = response;

        $http.defaults.headers.common['Authorization'] = "Basic " + response.access_token;
        ipCookie('user', JSON.stringify(response), {'domain' : $scope.app.domain, 'path' : '/'});

        if ($localStorage.hash) {
            $localStorage.hash = false;
        }
        if ($localStorage.cbreceipt)
        {
            $localStorage.cbreceipt = false;
        }
        $rootScope.first_login_view = true;
        if (response.is_site){
            Restangular.one( 'user', $localStorage.user.id ).get().then(function(response){
                if($scope.isAgentOrGreater(response)){
                    $state.go('admin.site.dashboard');
                    return;
                }else{
                    $state.go('public.app.lessons');
                    return;
                }
            })
        }else {
            Restangular.one('company/getUsersCompanies').get().then(function (response) {
                var selected_team = _.find(response.companies, {selected: 1});
                if (!selected_team)
                    $state.go('admin.account.memberships');
                else
                    $state.go('admin.team.dashboard');
            })
        }
    }

    $scope.isAgentOrGreater = function($user){
        $role=_.find($user.role,function(r){
            return r.site_id == $scope.site.id;
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
            return true;
        else
            return false;
    }
});