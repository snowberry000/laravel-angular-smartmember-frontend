var app = angular.module("app");

app.config(function($stateProvider){
	$stateProvider
		.state("public.app.site.support",{
			url: "/support",
			templateUrl: "/templates/components/public/app/site/support-article/support-article.html",
			controller: "PublicSupportController"
		})
}); 

app.controller('PublicSupportController', function ($scope,$site,$rootScope, $localStorage, $state, $stateParams, $filter, Restangular, toastr ) {
    // alert('called');
    $rootScope.page_title = $rootScope.site.name+' - Support';
    $scope.next_item = {
        title: 'Support',
        display: 'article-index'
    };

    $scope.article = $scope.next_item;

    $scope.init = function(){
        Restangular.all('supportArticle?bypass_paging=true&view=admin&parent_id=0&site_id=' + $site.id ).customGET().then(function (response) {
             $scope.next_item.articles = response.items;
            $scope.article = $scope.next_item;
        });
    }

    $scope.init();

    $scope.search = function(){
        $scope.searchResults = [];
        for (var i =  0 ; i < $scope.categories.length ; i++) {
            var category = $scope.categories[i];
            for (var j = 0 ; j < category.articles.length; j++) {
                var article = category.articles[j];
                if(article.content.indexOf($scope.searchquery) > -1 || article.title.indexOf($scope.searchquery) > -1)
                    $scope.searchResults.push(article);
            };
        };
    }

    $scope.showFormat = function(format){
        $localStorage.helpdesk_format = format;
        $scope.site.helpdesk_format = format;
    }
});