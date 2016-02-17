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

    var support_title = 'Support';
    if( $rootScope.site && $rootScope.site.meta_data ) {
        angular.forEach( $rootScope.site.meta_data, function( value ) {
            if( value.key == 'support_title' && value.value.trim() != '' )
                support_title = value.value.trim();
        } );
    }

    $rootScope.page_title = $rootScope.site.name + ' - ' + support_title;

    $scope.next_item = {
        title: support_title,
        display: 'article-index'
    };

    $scope.article = $scope.next_item;

    $scope.loading = true;
    $scope.searching = false;

    $scope.search = function( query ) {
        $scope.query = query;
        if( !query )
        {
            $scope.searching = false;
        }
        else
        {
            $scope.searching = true;
            $scope.loading = true;

            Restangular.all('supportArticle?bypass_paging=true&status=published&view=admin&site_id=' + $rootScope.site.id + '&q=' + encodeURIComponent( query ) ).customGET().then(function (response) {
                $scope.search_results = response.items;
                $scope.loading = false;
            });
        }
    }

    $scope.init = function(){
        Restangular.all('supportArticle?bypass_paging=true&status=published&view=admin&parent_id=0&site_id=' + $site.id ).customGET().then(function (response) {
             $scope.next_item.articles = response.items;
            $scope.article = $scope.next_item;
            $scope.loading = false;
        });
    }

    $scope.init();

    $scope.showFormat = function(format){
        $localStorage.helpdesk_format = format;
        $scope.site.helpdesk_format = format;
    }
});