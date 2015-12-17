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
					return Restangular.all( 'siteMetaData' ).customGETLIST( "getOptions", [ 'download_center_text', 'download_center_sub_text', 'downloads_text', 'access_level_status_color' ] );
				}
			}
		})
}); 

app.controller("DownloadCenterController", function ($scope) {

});