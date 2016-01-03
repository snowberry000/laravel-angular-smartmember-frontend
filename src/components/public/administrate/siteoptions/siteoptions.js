var app = angular.module("app");

app.config(function($stateProvider){
	$stateProvider
		.state("public.administrate.siteoptions",{
			url: "/siteoptions",
			templateUrl: "/templates/components/public/administrate/siteoptions/siteoptions.html",
			controller: "SiteoptionsController",
			resolve: {
				$site_options: function( Restangular )
				{
					return Restangular.all( 'siteMetaData' ).customGETLIST( "getOptions", [ 'site_logo', 'access_deny_image', 'logo_url' ] );
				}

			}
		})
}); 

app.controller("SiteoptionsController", function ($scope, $rootScope, $localStorage, $location, $site , $site_options , $stateParams,  Restangular, toastr) {
	$scope.site_options = {};

	$.each($site_options, function (key, data) {
	    $scope.site_options[data.key] = data.value;
	});

	$scope.site_options.isOpen = false;
	$rootScope.not_homepage_setting = false;

	$scope.save = function () {
	    delete $scope.site_options.url;
	    delete $scope.site_options.open;
	    Restangular.all('siteMetaData').customPOST($scope.site_options, "save").then(function () {
	        toastr.success("Options are saved!");
	        $scope.site_options.isOpen = false;
	        $localStorage.homepage_url = $scope.site_options.homepage_url;
	    });
	}
});