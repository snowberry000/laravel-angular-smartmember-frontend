var app = angular.module("app");

app.config(function($stateProvider){
	$stateProvider
		.state("public.admin.site.pages.core.download-center",{
			url: "/download-center",
			templateUrl: "/templates/components/public/admin/site/pages/core/download-center/download-center.html",
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