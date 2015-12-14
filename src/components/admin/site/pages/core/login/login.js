var app = angular.module("app");

app.config(function($stateProvider){
	$stateProvider
		.state("admin.site.pages.core.login",{
			url: "/login",
			templateUrl: "/templates/components/admin/site/pages/core/login/login.html",
			controller: "LoginController",
            resolve: {
                $site_options: function( Restangular )
                {
                    return Restangular.all( 'siteMetaData' ).customGETLIST( "getOptions", [ 'create_account_url', 'login_page_text' ] );
                }
            }
		})
}); 

app.controller("LoginController", function ($scope, $rootScope, $localStorage, $location, $site , $site_options , $stateParams, $modal, Restangular, toastr, $state) {
	$scope.site_options = {};

    $scope.site=$site;

    $.each($site_options, function (key, data) {
        $scope.site_options[data.key] = data.value;
    });

    $scope.site_options.isOpen = false;

    $scope.save = function () {
        delete $scope.site_options.url;
        delete $scope.site_options.open;
        Restangular.all('siteMetaData').customPOST($scope.site_options, "save").then(function () {
            toastr.success("Options are saved");
            $scope.site_options.isOpen = false;
            $localStorage.homepage_url = $scope.site_options.homepage_url;
            $state.go('admin.site.pages.core.list');
        });
    }

    $scope.selectUrl = function(item , selected_url , show_next){

        var api_resources = ['lesson' , 'customPage' , 'post' , 'download' , 'livecast' , 'supportArticle', 'bridgePage'];
        if(!selected_url)
            return;
        if(api_resources.indexOf(selected_url)<0)
        {
            item.url = selected_url;
            $scope.site_options['create_account_url'] = selected_url;
            $scope.show_next = show_next;
            $scope.site_options.isOpen = false;
        }
        else if(selected_url == 'download'){
            console.log(item.site_id)
            Restangular.all('download').customGET('',{site_id: $site.id}).then(function(response){
                var downloads = response;
                downloads.items.forEach(function(entity){
                    entity.url = entity.permalink;
                })
                $scope.show_next = true;
                $scope.loaded_items = downloads;

            })
        }
        else
        {
            Restangular.all(selected_url).customGET('',{site_id: $site.id}).then(function(response){
                if(response.route == 'customPage')
                    response.route = 'page';
                if(response.route == 'supportArticle')
                    response.route = 'support-article';
                response.items.forEach(function(entity){
                    entity.url = entity.permalink;
                })
                $scope.show_next = true;
                $scope.loaded_items = response;

            })
        }
    }
});