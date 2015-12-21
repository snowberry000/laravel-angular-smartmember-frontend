var app = angular.module("app");

app.config(function($stateProvider){
	$stateProvider
		.state("admin.site.appearance.widgets.widgets.banner",{
			templateUrl: "/templates/components/admin/site/appearance/widgets/widgets/banner/banner.html",
			controller: "WidgetBannerController"
		})
});

app.controller("WidgetBannerController", function ($scope) {

});