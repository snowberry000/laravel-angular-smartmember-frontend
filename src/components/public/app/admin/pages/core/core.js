var app = angular.module( "app" );

app.config( function( $stateProvider )
{
	$stateProvider
		.state( "public.app.admin.pages.core", {
			url: "/core",
			templateUrl: "/templates/components/public/app/admin/pages/core/core.html",
			controller: "CoreController"
		} )
} );

app.controller( "CoreController", function( $scope, $state,$rootScope )
{
	$scope.pageClicked = function ( $current){
		$rootScope.currentPageName= $current;
	}

	$scope.data = [
		{
			title: 'Front Page',
			description: 'This is the main page of your site, located on the front of it (ex. .com/) when no other page is view.',
			image: '',
			icon: 'home',
			template: 'home',
			url: '/'
		},
		{
			title: 'Syllabus',
			description: 'This page lists your site\'s lessons and modules in an organized "education" style format.',
			image: '',
			icon: 'student',
			template: 'syllabus',
			url: '/lessons'
		},
		{
			title: 'Sales Page',
			description: 'This is your sites "sales" page, providing a more effective call-to-action for your site than the Home Page does.',
			image: '',
			icon: 'announcement',
			template: 'info',
			url: '/info#preview'
		},
		{
			title: 'Checkout Page',
			description: 'This is your sites "checkout" page, allowing your products to be purchased',
			image: '',
			icon: 'shop',
			template: 'checkout',
			url: '/checkout/{product id}'
		},
		{
			title: 'Thank You Page',
			description: 'This is your sites "Thank you" page, showing after your customers buy your products',
			image: '',
			icon: 'smile',
			template: 'thankyou',
			url: '/thank-you'
		},
		{
			title: 'Download Center',
			description: 'This page will show all available downloads to visitors and members to access.',
			image: '',
			icon: 'download',
			template: 'download-center',
			url: '/download-center'
		},
		{
			title: 'JV Page',
			description: 'This page allows affiliates / joint venture (jv) partners to learn about your site and optin to join its Email List.',
			image: '',
			icon: 'users',
			template: 'jv',
			url: '/jvpage'
		},
		{
			title: 'Refund Page',
			description: 'When requesting a refund, members can be directed to this page as last attempt to prevent the refund. From ' +
			'there they can submit a refund request support ticket or be presented with a Freebie to stay on board.',
			image: '',
			icon: 'frown',
			template: 'refund',
			url: '/refund-page'
		},
		{
			title: 'Freebie Page',
			description: 'When requesting a refund, members can choose to accept a free gift to stay onboard; this page ' +
			'is where they\'ll receive that gift.',
			image: '',
			icon: 'gift',
			template: 'freebie',
			url: '/free-bonus'
		},
		{
			title: 'Support',
			description: 'This is the support center where users can view your help articles.',
			image: '',
			icon: 'life ring',
			template: 'support',
			url: '/support'
		},
		{
			title: 'Blog Page',
			description: 'This page lists your blog posts',
			image: '',
			icon: 'edit',
			template: 'blog',
			url: '/blog'
		},
		{
			title: 'Login Form',
			description: 'This is the form your members will use to log into your site',
			image: '',
			icon: 'unlock alternate',
			template: 'login',
			url: '/sign/in/'
		},
		{
			title: 'Registration Form',
			description: 'This is the form your members will use to join your site',
			image: '',
			icon: 'add user',
			template: 'registration',
			url: '/sign/up/'
		}
	];


	$scope.cancel = function()
	{
		$state.go('public.app.admin.pages.core.list');
	}

} );