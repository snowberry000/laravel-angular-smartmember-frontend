var app = angular.module("app");

app.config(function ($stateProvider) {
    $stateProvider
        .state("admin.app.smart-sites.page", {
            url: "/:subdomain/page/:id",
            templateUrl: "/templates/components/admin/app/smart-sites/page/page.html",
            controller: "AdminSmartSitePageController"
        })
});

app.controller('AdminSmartSitePageController', function ($scope, toastr, $stateParams, $rootScope, $state, $localStorage, $location, Restangular, RestangularV3, $filter, $sce, smMembers, $timeout ) {
    $scope.iframe_src = '';
    $scope.preview_viewport_size = 'desktop';
    $scope.subdomain = $stateParams.subdomain;
    $scope.loading = true;
    $scope.myForm = {schema: {}};
    $rootScope.myForm = {schema: {}};

    $scope.savedForm = {schema: {}};
    RestangularV3.one('page', $stateParams.id).get().then(function (response) {
        $scope.next_item = response;
        $scope.next_item.boxes = $filter('orderBy')($scope.next_item.boxes, 'sort_order');

        $rootScope.page = $scope.next_item;

        angular.forEach($scope.next_item.boxes, function (value) {
            if (!value.column || ( value.column != 'right' && value.column != 'left' ))
                value.column = 'main';
        });

        $scope.updateSchema();

        $rootScope.myForm = {fields: $scope.next_item.boxes};
        $scope.loading = false;

        $rootScope.full_url = 'http://' + $scope.subdomain + '.smartmember.' + $scope.app.env + '/page-content/' + $scope.next_item.full_permalink;
    });

    $rootScope.refreshPreview = function()
    {
        $( 'iframe.site_preview').attr( 'src', function( i, val ) { return val; });
    }

    $scope.updateSchema = function () {
        $scope.savedForm.schema = {
            left: {
                fields: $filter('filter')($scope.next_item.boxes, {column: 'left'})
            },
            right: {
                fields: $filter('filter')($scope.next_item.boxes, {column: 'right'})
            },
            main: {
                fields: $filter('filter')($scope.next_item.boxes, {column: 'main'})
            }
        };

        $scope.myForm.schema = {
            left: {
                fields: $filter('filter')($scope.next_item.boxes, {column: 'left'})
            },
            right: {
                fields: $filter('filter')($scope.next_item.boxes, {column: 'right'})
            },
            main: {
                fields: $filter('filter')($scope.next_item.boxes, {column: 'main'})
            }
        };
    }

    $scope.save = function ($event) {
        for (var i = 0; i < $scope.myForm.schema.fields.length; i++) {
            delete $scope.myForm.schema.fields[i]['$_displayProperties'];
            $scope.myForm.schema.fields[i].sort_order = i;
        }
        ;

        $scope.next_item.boxes = $scope.myForm.schema;

        RestangularV3.all('page').customPUT($scope.next_item, $scope.next_item._id).then(function (response) {
            $scope.myForm.schema = {fields: response.boxes};

            $state.transitionTo($state.current, $stateParams, {
                reload: true,
                inherit: false,
                notify: true
            });

            toastr.success("Successfully saved");
        })

        $event.stopPropagation();
        $event.stopImmediatePropagation();
    }

    $scope.addBoxes = function (boxes) {
        angular.forEach(boxes.main, function (value) {
            $scope.addBox(value, 'main');
        });

        switch ($scope.next_item.layout) {
            case 'left-sidebar':
                angular.forEach(boxes['sidebar-1'], function (value) {
                    $scope.addBox(value, 'left');
                });
                angular.forEach(boxes['sidebar-2'], function (value) {
                    $scope.addBox(value, 'left');
                });
                break;
            case 'right-sidebar':
                angular.forEach(boxes['sidebar-2'], function (value) {
                    $scope.addBox(value, 'right');
                });
                angular.forEach(boxes['sidebar-1'], function (value) {
                    $scope.addBox(value, 'right');
                });
                break;
            case 'both-sidebars':
                angular.forEach(boxes['sidebar-1'], function (value) {
                    $scope.addBox(value, 'left');
                });
                angular.forEach(boxes['sidebar-2'], function (value) {
                    $scope.addBox(value, 'right');
                });
                break;
        }
        $scope.updateSchema();
    }

    $scope.addBox = function (box, column) {
        if (!column)
            column = 'main';

        var new_box = {
            page_id: $scope.next_item._id,
            type: box,
            column: column
        };

        $scope.next_item.boxes.push(new_box);
    }
});