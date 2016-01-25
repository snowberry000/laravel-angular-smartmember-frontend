var app = angular.module("app");

app.config(function($stateProvider){
	$stateProvider
		.state("public.app.admin.pages.download-center",{
			url: "/download-center",
			templateUrl: "/templates/components/public/app/admin/pages/core/download-center/download-center.html",
			controller: 'specialPagesController',
			resolve: {
				$site_options: function( Restangular )
				{
					
				}
			}
		})
}); 

app.controller("DownloadCenterController", function ($scope) {

});