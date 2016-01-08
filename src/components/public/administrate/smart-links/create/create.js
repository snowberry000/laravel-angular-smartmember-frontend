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

app.controller("SmartLinksCreateController", function ($scope, $rootScope, $filter, Restangular, $stateParams, smModal, toastr, close) {
    $site = $rootScope.site;
    $scope.template_data = {
        title: 'SMARTLINK',
        description: 'Create rotating links',
        singular: 'Smart Link',
        edit_route: 'public.administrate.smart-links.create',
        api_object: 'smartLink'
    }

    $scope.randomPermalink = function(length) {
        if( length == undefined )
            length = 6;

        var characters = "abcdefghijklmnopqrstuwxyz0123456789".split('');
        var permalink = [];
        var length_of_characters = characters.length;

        for( var i = 0; i < length; i++ )
        {
            var n = Math.floor( Math.random() * length_of_characters );
            permalink.push( characters[ n ] );
        }

        return permalink.join('');
    }

    $scope.next_item = {
        type: 'random',
        permalink: $scope.randomPermalink(),
        urls: [
            {
                url: '',
                enabled: 1
            },
            {
                url: '',
                enabled: 1
            },
            {
                url: '',
                enabled: 1
            }
        ]
    };

    if( $stateParams.id ) {
        $nextItemRequest = Restangular.one($scope.template_data.api_object, $stateParams.id).get().then(function (response) {
            $scope.next_item = response;

            if( !$scope.next_item.urls ) {
                $scope.next_item.urls = [];
            }

            angular.forEach( $scope.next_item.urls, function(value){
                value.enabled = parseInt( value.enabled );
            });

            if( $scope.next_item.urls.length < 3 )
                $scope.addUrls( 3 - $scope.next_item.urls.length );
        });
    }

    $scope.rotation_types = [
        {
            value: 'random',
            label: 'Random',
	        icon: 'random',
            description: ''
        },
        {
            value: 'sequential',
            label: 'Sequential',
	        icon: 'ordered',
            description: ''
        },
        {
            value: 'least_hit',
            label: 'Least hit',
	        icon: 'crosshairs',
            description: ''
        },
        {
            value: 'weighted',
            label: 'Weighted',
	        icon: 'calculator',
            description: ''
        }
    ];

    $scope.consoleLog = function(something) {
        console.log( something );
    }

    $scope.moveUp = function(url){

    }

    $scope.moveDown = function(url){

    }

    $scope.moveUp = function(url){
        var count = 0;
        var found = false;
        angular.forEach( $scope.next_item.urls, function(value, key){

            if( !found )
                count++;

            if( value == url ) {
                $scope.next_item.urls = _.without($scope.next_item.urls, value);
                found = true;
            }
        });

        var second_count = 0;
        var new_urls = [];

        angular.forEach( $scope.next_item.urls, function(value, key){
            second_count++;

            if( count - 1 == second_count )
                new_urls.push( url );

            new_urls.push( value );
        });

        $scope.next_item.urls = new_urls;
    }

    $scope.moveDown = function(url){
        var count = 0;
        var found = false;
        angular.forEach( $scope.next_item.urls, function(value, key){

            if( !found )
                count++;

            if( value == url ) {
                $scope.next_item.urls = _.without($scope.next_item.urls, value);
                found = true;
            }
        });

        var second_count = 0;
        var new_urls = [];

        var added = false;

        angular.forEach( $scope.next_item.urls, function(value, key){
            second_count++;

            if( count + 1 == second_count ) {
                new_urls.push(url);
                added = true;
            }

            new_urls.push( value );
        });

        if( !added )
            new_urls.push( url );

        $scope.next_item.urls = new_urls;
    }

    $scope.deleteUrl = function(url){
        $scope.next_item.urls = _.without( $scope.next_item.urls, url );
    }

    $scope.SetRotationType = function( type ) {
        $scope.next_item.type = type;
    }

    $scope.addUrls = function( num ) {
        for( x = 0; x < num; x++ )
            $scope.next_item.urls.push({url: '',enabled: true});
    }

    $scope.onBlurSlug = function( $event )
    {
        if( $scope.next_item.permalink )
        {
            $scope.next_item.permalink = $filter( 'urlify' )( $scope.next_item.permalink );
        }
    }

    $scope.save = function() {
        var count = 1;

        angular.forEach( $scope.next_item.urls, function(value, key){
            if( !value.url )
                $scope.next_item.urls = _.without( $scope.next_item.urls, $scope.next_item.urls[ key ] );
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