var app = angular.module( "app" );

app.config( function( $stateProvider )
{
	$stateProvider
		.state( "public.app.site.support-article", {
			url: "/support-article/:permalink",
			templateUrl: "/templates/components/public/app/site/support-article/support-article.html",
			controller: "PublicSupportArticleController"
		} )
} );

app.controller( 'PublicSupportArticleController', function( $scope, $rootScope, $localStorage, $state, $stateParams, $filter, Restangular, toastr )
{
	//$scope.page = $page;
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

	Restangular.one( 'articleByPermalink', $stateParams.permalink ).get({status: 'published'}).then( function( response )
	{
		$article = response;
		$scope.loading = false;
		$scope.article = $article;
		$scope.next_item = $scope.article;
        $rootScope.setSocialShareForContent( $scope.next_item );
		$scope.next_item.content_type = 'helpdesk.article';
		$scope.next_item.access = true;
		$scope.next_item.breadcrumb = true;
		$rootScope.page_title = $article.title || $rootScope.page_title;
	} );

    $scope.breadCrumbParent = function( next_item ) {
        var final_link = '';

        if( next_item.parent_id ) {
            parent = next_item.parent;

            for (; parent != undefined; parent = parent.parent) {
                final_link = ' <i class="right angle icon divider"></i> ' + '<a class="section" href="/' + parent.permalink + '">' + parent.title + '</a>' + final_link;
            }
        }

        return '<a class="section" href="/support">Support</a>' + final_link + ' <i class="right angle icon divider"></i> <div class="active section">' + next_item.title + "</div>";
    }
} );
