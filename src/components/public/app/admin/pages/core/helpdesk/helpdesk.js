var app = angular.module("app");

app.config(function($stateProvider){
	$stateProvider
		.state("public.app.admin.pages.helpdesk",{
			url: "/helpdesk",
			templateUrl: "/templates/components/public/app/admin/pages/core/helpdesk/helpdesk.html",
			controller: 'CreateTicketCorePageController',
		})
});

app.controller("CreateTicketCorePageController", function ($scope, $rootScope, smModal , $localStorage, $location , $stateParams,  Restangular, toastr, $state) {
	$scope.site_options = {};
	$site = $rootScope.site;
	var fields = [
		'create_ticket_image',
		'create_ticket_header',
		'create_ticket_sub_header',
		'create_ticket_subject_label',
		'create_ticket_subject_placeholder',
		'create_ticket_message_label',
		'create_ticket_hide_attachment',
		'create_ticket_attachment_text',
	];
	Restangular.all( "siteMetaData" ).customGETLIST( "getOptions", fields ).then(function(response){
		$.each(response , function (key, data) {
			$scope.site_options[data.key] = data.value;
		});
	})

	$scope.saveSettings = function () {
		Restangular.all("siteMetaData").customPOST($scope.site_options, "save").then(function () {
			toastr.success("Your support ticket page has been saved!");
			$state.go('public.app.admin.pages.core.list');
		});
	};
});