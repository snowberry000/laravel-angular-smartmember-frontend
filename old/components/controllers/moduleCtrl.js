app.controller('adminModulesController', function ($scope, $localStorage,$site , $location, $stateParams, $modal, Restangular, toastr) {
    $scope.template_data = {
        title: 'MODULES',
        description: 'Modules let you group together lessons - think "sections" or "chapters".',
        singular: 'module',
        edit_route: 'admin.site.content.syllabus.module',
        api_object: 'module'
    }

    $scope.data = [];
    $scope.pagination = {current_page: 1};
    $scope.pagination.total_count = 1;

    $scope.paginate = function(){

        if( typeof $scope.data[ $scope.pagination.current_page] != 'object' ) {

            $scope.loading = true;

            var $params = {p: $scope.pagination.current_page, site_id: $site.id};

            if ($scope.query) {
                $params.q = encodeURIComponent( $scope.query );
            }

            Restangular.all('').customGET( $scope.template_data.api_object + '?view=admin&p=' + $params.p + '&site_id=' + $params.site_id + ( $scope.query ? '&q=' + encodeURIComponent( $scope.query ) : '' )).then(function (data) {
                $scope.loading = false;
                $scope.pagination.total_count = data.total_count;
                $scope.data[ $scope.pagination.current_page] = Restangular.restangularizeCollection( null, data.items, $scope.template_data.api_object );
            });
        }
    }

    $scope.paginate();

    $scope.search = function()
    {
        $scope.loading = true;
        $scope.data = [];
        $scope.pagination = {current_page: 1};
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

    $scope.delete = function (id) {

        var modalInstance = $modal.open({
            templateUrl: 'templates/modals/deleteConfirm.html',
            controller: "modalController",
            scope: $scope,
            resolve: {
                id: function () {
                    return id
                }
            }

        });
        modalInstance.result.then(function () {
            var itemWithId = _.find($scope.data[ $scope.pagination.current_page ], function (next_item) {
                return next_item.id === id;
            });

            itemWithId.remove().then(function () {
                $scope.data[ $scope.pagination.current_page ] = _.without($scope.data[ $scope.pagination.current_page ], itemWithId);
            });
        })
    };
});

app.controller('adminModuleController', function ($scope, $localStorage,$module, $state, $site , $stateParams, $modal, Restangular, toastr) {
    $scope.module = $module;

    $scope.range = function(min, max, step){
        step = step || 1;
        var input = [];
        for (var i = min; i <= max; i += step) input.push(i);
        return input;
    };

    $scope.save = function () {
        if ($scope.module.id) {
            $scope.module.put();
            $state.go("admin.site.content.syllabus.modules");
            toastr.success("Module has been updated!");
        }
        else {
            Restangular.all('module').post($scope.module).then(function (module) {
                $scope.module = module;
                toastr.success("Module has been saved");
                $state.go("admin.site.content.syllabus.modules");
            });
        }
    }
});
