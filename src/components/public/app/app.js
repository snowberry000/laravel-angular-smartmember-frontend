var app = angular.module("app");

app.config(function($stateProvider){
	$stateProvider
		.state("public.app",{
			templateUrl: 'templates/components/public/app/app.html',
			controller: "AppController"
		})
}); 

app.controller("AppController", function ($scope ,$site,$user, $rootScope, $localStorage,$location, Restangular, toastr, $window,$timeout) {

    $rootScope.page_title = $site.name;
    
    $rootScope.is_admin = false;
    $scope.site = $site;

    $scope.is_member = $site.is_member;
    $scope.facebook_group = _.findWhere($scope.site.integration,{type: 'facebook_group'});
    $scope.facebook_access_group = $scope.site.fb_group_access_levels;

    

    $scope.init = function () {
        var details = $site;
         if (details) {
             $.each(details.meta_data, function (key, data) {
                 $scope.options[data.key] = data.value;
             });
             if (details.menu_items)
                 $scope.options.menu_items = details.menu_items;
             if (details.footer_menu_items)
                 $scope.options.footer_menu_items = details.footer_menu_items;
             $scope.site = details;
         }
         $scope.ads = details.ad;
         $scope.options.theme_selection = false;
         $scope.options.themes = global_themes;
         $scope.options.theme_options = global_theme_options;

         $rootScope.loaded = true;
         $scope.loaded = true;
         $scope.options.original_theme = $scope.options.theme;
         
        if ($scope.options.original_theme == 'united')
        {
            $scope.fix_menu_style = '.' + $scope.options.original_theme + ' .navbar-nav.main-menu a {color: #fff !important;text-decoration: none;}';
        }

        if (false && $localStorage.theme)
        {
            $scope.options.theme = $localStorage.theme;
            $scope.options.theme_selection = true;
        }

        //var $theme_url = '//my.' + ($rootScope.app.domain.indexOf('smartmember') < 0 ? 'smartmember.com' : $rootScope.app.domain)  + '/themes/' + $scope.options.theme + '/index.css';

        //if ($('link[href="' + $theme_url + '"]' ).length == 0)
        //{
           //$('head').append('<link rel="stylesheet" href="' + $theme_url + '"/>');
        //}

        $timeout(function () { // You might need this timeout to be sure its run after DOM render.
            $scope.bannerView(0);
        }, 1, false);
    };


    $scope.addMember = function() {
        Restangular.all('site/addMember').customPOST().then(function () {
            toastr.success("You have become a member of this site");
            $scope.is_member = true;
        });
    }

    $scope.bannerClick = function(ads) {

        target= ads.open_in_new_tab ? '_blank' : '_self';
        Restangular.one('trackClicks', ads.id).customPOST({}).then(function() {
            
        });
        
    }

    $scope.bannerView = function($id) {
        if ($scope.ads) {
            var ad_id = $scope.ads[0];
            Restangular.one('trackViews', ad_id.id).customPOST({});
        }
    }

    $scope.isAdmin = function(role){
        if( !role )
            return false
        for (var i = role.length - 1; i >= 0; i--) {
            if( role[i].site_id == $site.id || role[i].site_id == $site.id + '' ) {
                var admin = _.findWhere(role[i].type, {role_type: 4}) || _.findWhere(role[i].type, {role_type: "4"});
                if( !admin )
                    admin = _.findWhere(role[i].type, {role_type: 3}) || _.findWhere(role[i].type, {role_type: "3"});
                if( !admin )
                    admin = _.findWhere(role[i].type, {role_type: 2}) || _.findWhere(role[i].type, {role_type: "2"});
                if( !admin )
                    admin = _.findWhere(role[i].type, {role_type: 1}) || _.findWhere(role[i].type, {role_type: "1"});
                if (admin) {
                    return true;
                }
            }
        }
        return false;
    }

    $scope.hasAccess=function(role)
    {
        if( !role )
            return false

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

    $rootScope.is_site_admin= $scope.isAdmin($user.role);
    $rootScope.is_team_member = $scope.hasAccess($user.role);
});