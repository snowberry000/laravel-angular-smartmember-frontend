var app = angular.module("app");

app.config(function($stateProvider){
	$stateProvider
		.state("public.app.admin.pages.blog",{
			url: "/blog",
			templateUrl: "/templates/components/public/app/admin/pages/core/blog/blog.html",
			controller: "BlogCorePageSettingsController"
		})
}); 

app.controller("BlogCorePageSettingsController", function ($scope,$rootScope,$state,Restangular,toastr, smModal) {
	$scope.site = $site = $rootScope.site;

    $scope.save = function(){
        var data = {
            blog_format: $scope.site.blog_format,
        };

        Restangular.all('site').customPUT( data, $scope.site.id)
            .then(function(response){
                toastr.success("Your blog changes has been saved!");
                $state.go('public.app.admin.pages.core.list');
            });
    }
});