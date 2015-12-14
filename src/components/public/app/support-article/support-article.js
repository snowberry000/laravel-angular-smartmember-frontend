var app = angular.module("app");

app.config(function($stateProvider){
	$stateProvider
		.state("public.app.support-article",{
			url: "/support-article/:permalink",
			templateUrl: "/templates/components/public/app/support-article/support-article.html",
			controller: "PublicSupportArticleController"
		})
}); 

app.controller('PublicSupportArticleController', function ($scope, $rootScope , $localStorage, $state, $stateParams,$filter, Restangular, toastr ) {
    //$scope.page = $page;
    $scope.loading=true;

    
    Restangular.one('articleByPermalink', $stateParams.permalink).get().then(function(response){
        $article=response;
        $scope.loading=false;
        $scope.article = $article;
        $scope.next_item = $scope.article;
        $rootScope.page_title = $article.title || $rootScope.page_title;
    });
});
