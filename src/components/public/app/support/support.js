var app = angular.module("app");

app.config(function($stateProvider){
	$stateProvider
		.state("public.app.support",{
			url: "/support",
			templateUrl: "/templates/components/public/app/support/support.html",
			controller: "PublicSupportController"
		})
}); 

app.controller('PublicSupportController', function ($scope,$rootScope, $localStorage, $state, $stateParams, $site, $filter, Restangular, toastr ) {
    $rootScope.page_title = 'Support';
    $scope.init = function(){
        Restangular.all('supportCategory').getList({public_view:true}).then(function(response){
            $scope.categories = response;

        })
    }


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
        $localStorage.syllabus_format = format;
        $scope.site.syllabus_format = format;
    }
});