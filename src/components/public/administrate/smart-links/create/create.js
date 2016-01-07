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

app.controller("SmartLinksCreateController", function ($scope, $rootScope, Restangular, smModal, toastr, close) {
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
            },
            {
                url: ''
            },
            {
                url: ''
            }
        ]
    };

    $scope.rotation_methods = [
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

    $scope.save = function() {
        var count = 1;

        angular.forEach( next_item.urls, function(value, key){
            if( !value.url )
                delete next_item.urls[ key ];
            else {
                next_item.order = count;
                count++;
            }
        });

        if( next_item.id ) {
            next_item.put().then(function(response){

            });
        } else {
            Restangular( $scope.template_data.api_object ).post( next_item ).then(function(response){

            });
        }
    }
});