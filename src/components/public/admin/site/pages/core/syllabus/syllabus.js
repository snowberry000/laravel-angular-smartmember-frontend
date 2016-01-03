var app = angular.module("app");

app.config(function($stateProvider){
	$stateProvider
		.state("public.admin.site.pages.core.syllabus",{
			url: "/syllabus",
			templateUrl: "/templates/components/public/admin/site/pages/core/syllabus/syllabus.html",
			controller: "SyllabusSettingsController"
		})
}); 

app.controller("SyllabusSettingsController", function ($scope,$rootScope,$state,Restangular,toastr, smModal) {
	$scope.site = $site = $rootScope.site;

    $scope.save = function(){
        var data = {
            syllabus_format: $scope.site.syllabus_format,
            show_syllabus_toggle: $scope.site.show_syllabus_toggle,
            welcome_content: $scope.site.welcome_content
        };

        Restangular.all('site').customPUT( data, $scope.site.id)
            .then(function(response){
                toastr.success("Your syllabus changes has been saved!");
                smModal.Show('public.admin.site.pages.core.list');
            });
    }
});