var app = angular.module("app");

app.config(function($stateProvider){
	$stateProvider
		.state("public.administrate.site.content.helpdesk.articles",{
			url: "/articles",
			templateUrl: "/templates/components/public/administrate/site/content/helpdesk/articles/articles.html",
			controller: "ArticlesController"
		})
}); 

app.controller("ArticlesController", function ($scope,$rootScope, $localStorage, $state, $stateParams, $filter, Restangular, toastr) {
	$site=$rootScope.site;
    
    $scope.template_data = {
        title: 'HELPDESK_ARTICLES',
        description: 'Create a knowledgebase for your members to help answer their most frequently asked questions.',
        singular: 'helpdesk article',
        edit_route: 'public.administrate.site.content.helpdesk.article',
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

            Restangular.all('').customGET( $scope.template_data.api_object + '?view=admin&p=' + $params.p + '&site_id=' + $params.site_id + ( $scope.query ? '&q=' + encodeURIComponent( $scope.query ) : '' )).then(function (data) {
                $scope.loading = false;
                $scope.pagination.total_count = data.total_count;
                $scope.data = Restangular.restangularizeCollection( null, data.items, $scope.template_data.api_object );
            });
        }
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
            $setTimeout(
                function() {$state.transitionTo($state.current, $state.params, { 
              reload: true, inherit: false, location: false
            });}, 50);
        });
    };
});