var app = angular.module("app");

app.config(function($stateProvider){
	$stateProvider
		.state("public.admin.site.pages.core.jv",{
			url: "/jv",
			templateUrl: "/templates/components/public/admin/site/pages/core/jv/jv.html",
			controller: "JVPageController",
			resolve: {
				emailLists: function( Restangular, $site )
				{
					return Restangular.all( 'emailList/sendMailLists' ).getList();
				}
			}
		})
}); 

app.controller("JvController", function ($scope) {

});