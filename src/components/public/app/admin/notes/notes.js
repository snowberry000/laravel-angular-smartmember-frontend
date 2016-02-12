var app = angular.module("app");

app.config(function($stateProvider){
	$stateProvider
		.state("public.app.admin.notes",{
			url: "/notes",
			templateUrl: "/templates/components/public/app/admin/notes/notes.html",
			controller: "NotesController"
		})
}); 

app.controller('NotesController', function ($scope, $rootScope, $localStorage, Restangular, $timeout , $stateParams, $state) {

    if( !$rootScope.site || $rootScope.site.capabilities.indexOf( 'manage_members' ) == -1 )
        $state.go('public.app.site.home');

    $site=$rootScope.site;
    $scope.template_data = {
        title: 'LESSON_NOTES',
        description: 'These are the notes your members have taken on the lessons they\'ve watched & read',
        singular: 'note',
        edit_route: 'public.app.admin.note',
        api_object: 'userNote'
    }

    $scope.data = [];
    $scope.pagination = {
        current_page: 1,
        per_page: 25,
        total_count: 0
    };

    $scope.paginationChange = false;
    $scope.$watch( 'pagination.current_page', function( new_value, old_value )
    {
        if( new_value != old_value )
        {
            $scope.paginationChange = true;
            if($scope.query)
            {
                $scope.paginate(true);
            }
            else
            {
                $scope.paginate();
            }
        }
    } );

    $scope.paginate = function(search){

        if (search && $scope.query.length<3 && $scope.query.length!=0 && $scope.paginationChange==false)
        {   
            return;
        }
        if(search && ($scope.query.length>=3 || $scope.query.length==0) && $scope.paginationChange==false)
        {
            $scope.pagination.current_page = 1;
        }
        if($scope.paginationChange==true && ((search && $scope.query.length<3 && $scope.query.length!=0)))
        {   
            $scope.query = '';
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
            $scope.paginationChange = false;
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
        var $params = { site_id :$site.id , p : $scope.pagination.current_page};

        if ($scope.query){
            $params.q = encodeURIComponent( $scope.query );
        }

        Restangular.all('').customGET( $scope.template_data.api_object + '?p=' + $params.p + '&site_id=' + $params.site_id + ( $scope.query ? '&q=' + encodeURIComponent( $scope.query ) : '' ) ).then(function(data){
            $scope.pagination.total_count = data.total_count;

            $scope.data[ $scope.pagination.current_page ] = Restangular.restangularizeCollection( null, data.items, $scope.template_data.api_object );

            $scope.loading = false;
        } , function(error){
            $scope.data = [];
        })
    }

    $scope.deleteResource = function (id) {

       
            var itemWithId = _.find($scope.data, function (next_item) {
                return next_item.id == id;
            });

            itemWithId.remove().then(function () {
                $scope.data = _.without($scope.data, itemWithId);
                $timeout(function(){
                $state.transitionTo( $state.current, $state.params, {
                reload: true, inherit: false, location: false
            } );
            } , 50)
            });
    };
});