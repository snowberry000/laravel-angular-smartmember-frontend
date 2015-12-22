var app = angular.module("app");

app.config(function($stateProvider){
	$stateProvider
		.state("admin.site.pages.core.syllabus",{
			url: "/syllabus",
			templateUrl: "/templates/components/admin/site/pages/core/syllabus/syllabus.html",
			controller: "SyllabusPageController"
		})
}); 

app.controller("SyllabusPageController", function ($scope,$rootScope,$state,$site,Restangular,toastr) {
	$scope.site = $site;

    $scope.save = function(){
        var data = {
            syllabus_format: $scope.site.syllabus_format,
            show_syllabus_toggle: $scope.site.show_syllabus_toggle,
            welcome_content: $scope.site.welcome_content
        };
        Restangular.all('site').customPUT( data, $scope.site.id)
            .then(function(response){
                $state.go("admin.site.pages.core.list");
                toastr.success("Your syllabus changes has been saved!");
            });
    }
});