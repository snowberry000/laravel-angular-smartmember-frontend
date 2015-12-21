var app = angular.module("app");

app.config(function($stateProvider){
	$stateProvider
		.state("admin.site.appearance.widgets.widgets.text",{
			templateUrl: "/templates/components/admin/site/appearance/widgets/widgets/text/text.html",
			controller: "WidgetTextController"
		})
});

app.controller("WidgetTextController", function ($scope) {

});