var app = angular.module("app");

app.config(function($stateProvider){
	$stateProvider
		.state("public.app.admin.helpdesk.articles",{
			url: "/articles",
			templateUrl: "/templates/components/public/app/admin/helpdesk/articles/articles.html",
			controller: "ArticlesController"
		})
}); 

app.controller("ArticlesController", function ($scope,$rootScope, $localStorage, $state, $stateParams,$timeout, $filter, Restangular, toastr) {
	$site=$rootScope.site;
    
    $scope.template_data = {
        title: 'HELPDESK_ARTICLES',
        description: 'Create a knowledgebase for your members to help answer their most frequently asked questions.',
        singular: 'helpdesk article',
        edit_route: 'public.app.admin.helpdesk.article',
        api_object: 'supportArticle'
    }

    $scope.data = [];
    $scope.pagination = {
        current_page: 1,
        per_page: 25,
        total_count: 0
    };

    $scope.$watch( 'pagination.current_page', function( new_value, old_value )
    {
        if( new_value != old_value )
        {
            $scope.paginate();
        }
    } );

    $scope.paginate = function(search){

        if (search)
        {
            $scope.pagination.current_page = 1;
        }

        if( true ) {

            $scope.loading = true;

            var $params = {p: $scope.pagination.current_page, site_id: $rootScope.site.id};

            if ($scope.query) {
                $params.q = encodeURIComponent( $scope.query );
            }

            Restangular.all('').customGET( $scope.template_data.api_object + '?view=admin&parent_id=0&p=' + $params.p + '&site_id=' + $params.site_id + ( $scope.query ? '&q=' + encodeURIComponent( $scope.query ) : '' )).then(function (data) {
                $scope.loading = false;
                $scope.pagination.total_count = data.total_count;
                $scope.data = Restangular.restangularizeCollection( null, data.items, $scope.template_data.api_object );

                angular.forEach( $scope.data, function( value, key ) {
                    $scope.addChildren( value, value );
                } );

                $scope.flattenArticlesCollection();
            });
        }
    }

    $scope.addChildren = function( main_article, article, tier ) {
        if( !tier )
            tier = 1;

        if( !main_article.children )
            main_article.children = [];

        if( article.articles )
        {
            angular.forEach( article.articles, function( value, key ) {
                value.tier = tier;

                main_article.children.push( value );

                $scope.addChildren( main_article, value, tier + 1 );
            } );
        }
    }

    $scope.flattenArticlesCollection = function() {
        var new_array = [];

        angular.forEach( $scope.data, function( value, key ) {
            new_array.push( value );

            if( value.children )
            {
                angular.forEach( value.children, function( value2, key2 ) {
                    new_array.push( value2 );
                } );
            }
        } );

        $scope.data = Restangular.restangularizeCollection( null, new_array, $scope.template_data.api_object );
    }

    $scope.getNumber = function(num) {
        return new Array(num);
    }

    $scope.paginate();

    $scope.search = function()
    {
        $scope.loading = true;
        $scope.data = [];
        $scope.pagination = {
        current_page: 1,
        per_page: 25,
        total_count: 0
    };

        var $params = { site_id :$rootScope.site.id , p : $scope.pagination.current_page};

        if ($scope.query){
            $params.q = encodeURIComponent( $scope.query );
        }

        Restangular.all('').customGET( $scope.template_data.api_object + '?view=admin&p=' + $params.p + '&site_id=' + $params.site_id + ( $scope.query ? '&q=' + encodeURIComponent( $scope.query ) : '' ) ).then(function(data){
            $scope.pagination.total_count = data.total_count;

            $scope.data[ $scope.pagination.current_page ] = Restangular.restangularizeCollection( null, data.items, $scope.template_data.api_object );

            $scope.loading = false;
        } , function(error){
            $scope.data = [];
        })
    }

    $scope.deleteResource = function (id) {

        var itemWithId = _.find($scope.data, function (next_item) {
            return next_item.id === parseInt(id);
        });

        itemWithId.remove().then(function () {
            $scope.data = _.without($scope.data, itemWithId);
// $timeout(function(){
//                 $state.transitionTo( $state.current, $state.params, {
//                 reload: true, inherit: false, location: false
//             } );
//             } , 50)
        $state.transitionTo( $state.current, $state.params, {
                reload: true, inherit: false, location: false
            } );
        });
    };
});