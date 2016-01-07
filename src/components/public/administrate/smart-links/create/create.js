var app = angular.module("app");

app.config(function($stateProvider){
	$stateProvider
		.state("public.administrate.smart-links.create",{
			url: "/create/:id?",
			templateUrl: "/templates/components/public/administrate/smart-links/create/create.html",
			controller: "SmartLinksCreateController",
            resolve: {
                loadPlugin: function( $ocLazyLoad )
                {
                    return $ocLazyLoad.load( [
                        {
                            name: 'ui.radio.checkbox'
                        }
                    ] );
                }
            }
		})
}); 

app.controller("SmartLinksCreateController", function ($scope, $rootScope, Restangular, $stateParams, smModal, toastr, close) {
    $site = $rootScope.site;
    $scope.template_data = {
        title: 'SMARTLINK',
        description: 'Create rotating links',
        singular: 'Smart Link',
        edit_route: 'public.administrate.smart-links.create',
        api_object: 'smartLink'
    }

    $scope.next_item = {
        type: 'random',
        urls: [
            {
                url: ''
            },
            {
                url: ''
            },
            {
                url: ''
            }
        ]
    };

    if( $stateParams.id ) {
        $nextItemRequest = Restangular.one($scope.template_data.api_object, $stateParams.id).get().then(function (response) {
            $scope.next_item = response;

            if( !$scope.next_item.urls ) {
                $scope.next_item.urls = [];
            }

            if( $scope.next_item.urls.length < 3 )
                $scope.addUrls( 3 - $scope.next_item.urls.length );
        });
    }

    $scope.rotation_types = [
        {
            value: 'random',
            label: 'Random',
            description: ''
        },
        {
            value: 'sequential',
            label: 'Sequential',
            description: ''
        },
        {
            value: 'least_hit',
            label: 'Least hit',
            description: ''
        },
        {
            value: 'weighted',
            label: 'Weighted',
            description: ''
        }
    ];

    $scope.SetRotationType = function( type ) {
        $scope.next_item.type = type;
    }

    $scope.addUrls = function( num ) {
        for( x = 0; x < num; x++ )
            $scope.next_item.urls.push({url: ''});
    }

    $scope.save = function() {
        var count = 1;

        angular.forEach( $scope.next_item.urls, function(value, key){
            if( !value.url )
                delete $scope.next_item.urls[ key ];
            else {
                value.order = count;
                count++;
            }
        });

        if( $scope.next_item.id ) {
            $scope.next_item.put().then(function(response){
                smModal.Show('public.administrate.smart-links.list');
            });
        } else {
            Restangular.all( $scope.template_data.api_object ).post( $scope.next_item ).then(function(response){
                smModal.Show('public.administrate.smart-links.list');
            });
        }
    }
});