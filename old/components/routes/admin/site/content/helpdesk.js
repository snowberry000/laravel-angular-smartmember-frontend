app.config(function ($stateProvider, $httpProvider, $urlRouterProvider,$locationProvider) {
    //$urlRouterProvider.otherwise("/");
    $locationProvider.html5Mode({
        enabled: true,
        requireBase: true
    });

    $stateProvider

	    .state('admin.site.content.helpdesk',{
		    url:'/helpdesk',
		    templateUrl: 'templates/admin/site/content/helpdesk/index.html'
	    })

	    .state('admin.site.content.helpdesk.articles', {
		    url: '/articles',
		    templateUrl: 'templates/admin/site/content/helpdesk/articles.html',
		    controller: 'adminSupportController'
	    })
	    .state('admin.site.content.helpdesk.article', {
		    url: '/article/:id?',
		    templateUrl: 'templates/admin/site/content/helpdesk/article.html',
		    controller: 'adminSupportArticleController',
		    resolve: {
			    $article: function(Restangular, $site , $stateParams , $location) {
				    if($stateParams.id)
					    return Restangular.one('supportArticle' , $stateParams.id).get();
				    else if($location.search().clone){
					    return Restangular.one('supportArticle', $location.search().clone).get();
				    }
				    else
					    return {company_id : $site.company_id}
			    }
		    }
	    })
	    .state('admin.site.content.helpdesk.categories', {
		    url: '/categories',
		    templateUrl: 'templates/admin/site/content/helpdesk/categories.html',
		    controller: 'adminSupportCategoriesController'
	    })
	    .state('admin.site.content.helpdesk.category', {
		    url: '/category/:id?',
		    templateUrl: 'templates/admin/site/content/helpdesk/category.html',
		    controller: 'adminSupportCategoryController',
		    resolve: {
			    $category: function(Restangular, $site , $stateParams) {
				    if($stateParams.id)
					    return Restangular.one('supportCategory' , $stateParams.id).get();
				    else
					    return {company_id : $site.company_id}
			    }
		    }
	    })
	    .state('admin.site.content.helpdesk.organizer', {
		    url: '/organizer',
		    templateUrl: 'templates/admin/site/content/helpdesk/organizer.html',
		    controller: 'adminSupportCreatorController'
	    })

});
