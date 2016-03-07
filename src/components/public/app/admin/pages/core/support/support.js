var app = angular.module("app");
app.config(function($stateProvider){
	$stateProvider
		.state("public.app.admin.pages.support",{
			url: "/support",
			templateUrl: "/templates/components/public/app/admin/pages/core/support/support.html",
			controller: 'specialPagesController',
			resolve: {
				$site_options: function( Restangular )
				{		
					return Restangular.all( 'siteMetaData' ).customGETLIST( "getOptions", [ 'support_title',  'support_enable'] );
				}
			}
		})
}); 
