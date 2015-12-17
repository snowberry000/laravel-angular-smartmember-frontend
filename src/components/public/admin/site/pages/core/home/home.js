var app = angular.module("app");

app.config(function($stateProvider){
	$stateProvider
		.state("public.admin.site.pages.core.home",{
			url: "/home",
			templateUrl: "/templates/components/public/admin/site/pages/core/home/home.html",
			controller: 'specialPagesController',
			resolve: {
				$site_options: function( Restangular )
				{
					return Restangular.all( 'siteMetaData' ).customGETLIST( "getOptions", [ 'cap_icon', 'syllabus_text', 'search_lesson_text', 'module_text', 'course_info_text', 'lesson_text', 'begin_course_text', 'homepage_url' ] );
				}
			}
		})
}); 

app.controller("HomeController", function ($scope) {

});