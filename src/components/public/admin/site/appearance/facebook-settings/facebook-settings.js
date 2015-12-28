var app = angular.module("app");

app.config(function($stateProvider){
	$stateProvider
		.state("public.admin.site.appearance.facebook-settings",{
			url: "/facebook-settings",
			templateUrl: "/templates/components/public/admin/site/appearance/facebook-settings/facebook-settings.html",
			controller: "FacebookSettingsController"
		})
}); 

app.controller("FacebookSettingsController", function ($scope, $localStorage, $location, $stateParams,  Restangular,toastr) {
	var pageMetaData = Restangular.all("siteMetaData");
	$scope.settings = {};
	$scope.facebookInit = function () {
	    pageMetaData.customGETLIST('getOptions' , ['fb_share_title' , 'fb_share_description' , 'fb_share_image']).then(function (settings) {
	        if (settings) {
	            $.each(settings, function (key, data) {
	                $scope.settings[data.key] = data.value;
	            });
	        }
	    });

	};
	$scope.facebookInit();
	$scope.saveFacebook = function () {
	    pageMetaData.customPOST($scope.settings, "save").then(function () {
	        toastr.success("Settings are saved");
	    });
	};
});