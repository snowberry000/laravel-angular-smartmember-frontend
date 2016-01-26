var app = angular.module("app");

app.config(function($stateProvider){
	$stateProvider
		.state("public.app.admin.content",{
			url: "/content",
			template: "<ui-view></ui-view>",
			controller: "SiteStatsController",
			resolve : {
			    summary : function (Restangular) {
				    return 
			    },
                // loadPlugin: function ($ocLazyLoad) {
                //     return $ocLazyLoad.load([
                //         {
                //             name: 'angular-flot',
                //             files: ['bower/angular-flot/angular-flot.js']
                //         }
                //     ]);
                // }
		    }
		})
}); 