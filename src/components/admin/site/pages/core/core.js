var app = angular.module("app");

app.config(function($stateProvider){
	$stateProvider
		.state("admin.site.pages.core",{
			url: "/core",
			templateUrl: "/templates/components/admin/site/pages/core/core.html",
			controller: "CoreController"
		})
}); 

app.controller("CoreController", function ($scope) {
	$scope.data = [
        /*
		{
			title: 'Helpdesk',
			description: 'This is the main "help" area of your site. Visitors and members alike will go here to get help ' +
			'in the form of articles and support tickets',
			image: '',
			template: 'helpdesk',
			url: '/support'
		},
        */
		{
			title: 'Download Center',
			description: 'This page will show all available downloads to visitors and members to access.',
			image: '',
			template: 'download-center',
			url: '/download-center'
		},
		{
			title: 'Home Page',
			description: 'This page is the "featured" area of your site. Each theme has a different home page featuring different aspects of your site.',
			image: '',
			template: 'home',
			url: '/'
		},
		{
			title: 'Sales Page',
			description: 'This is your sites "sales" page, providing a more effective call-to-action for your site than the Home Page does.',
			image: '',
			template: 'info',
			url: '/info#preview'
		},
		{
			title: 'JV Page',
			description: 'This page allows affiliates / joint venture (jv) partners to learn about your site and optin to join its Email List.',
			image: '',
			template: 'jv',
			url: '/jvpage'
		},
		{
			title: 'Refund Page',
			description: 'When requesting a refund, members can be directed to this page as last attempt to prevent the refund. From ' +
			'there they can submit a refund request support ticket or be presented with a Freebie to stay on board.',
			image: '',
			template: 'refund',
			url: '/refund-page'
		},
		{
			title: 'Freebie Page',
			description: 'When requesting a refund, members can choose to accept a free gift to stay onboard; this page ' +
			'is where they\'ll receive that gift.',
			image: '',
			template: 'freebie',
			url: '/free-bonus'
		},
		{
			title: 'Syllabus',
			description: 'This page lists your sites lessons and modules in an organized "education" style format.',
			image: '',
			template: 'syllabus',
			url: '/lessons'
		},
		{
			title: 'Login Page',
			description: 'This is the page your members will use to log into your site',
			image: '',
			template: 'login',
			url: '/sign/in/'
		},
		{
			title: 'Registration Page',
			description: 'This is the page your members will use to join your site',
			image: '',
			template: '',
			url: '/sign/up/'
		},
	];
});