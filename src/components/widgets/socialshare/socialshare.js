var app = angular.module("app");

app.controller("SocialshareChosenBannerController", function ($scope, $timeout ) {
    $scope.show_settings = false;

    if( !$scope.chosen_widget.meta )
        $scope.chosen_widget.meta = {};

    $scope.chosen_types = [];

    if( $scope.chosen_widget.meta.chosen_types )
        $scope.chosen_types = $scope.chosen_widget.meta.chosen_types.split(',');

    $scope.available_types = [
        {type: 'facebook', label: 'Facebook'},
        {type: 'pinterest', label: 'Pinterest'},
        {type: 'twitter', label: 'Twitter'},
        {type: 'google', label: 'Google+'},
        {type: 'linkedin', label: 'LinkedIn'},
        {type: 'reddit', label: 'Reddit'},
        {type: 'tumblr', label: 'Tumblr'}
    ];

    $timeout(function(){
        $('.ui.dropdown').dropdown();
    });

    $scope.update_chosen_types = function() {
        $scope.chosen_widget.meta.chosen_types = $scope.chosen_types.join(',');
    }

    $scope.typeChosen = function( type ) {
        return $scope.chosen_types.indexOf( type ) != -1;
    }

    $scope.parseTwitterUsername = function() {
        $scope.chosen_widget.meta.twitter_user = $scope.chosen_widget.meta.twitter_user.replace(/@/g, '' );
    }

    $scope.delete = function(){
        $scope.$parent.delete( $scope.chosen_widget );
    };

    $scope.save = function(){
        $scope.$parent.save( $scope.chosen_widget );
    };
});

app.controller("SocialshareDisplayBannerController", function ($scope, $rootScope) {
    $scope.chosen_types = [];

    if( $scope.display_widget.meta.chosen_types )
        $scope.chosen_types = $scope.display_widget.meta.chosen_types.split(',');

    $scope.typeChosen = function( type ) {
        return $scope.chosen_types.indexOf( type ) != -1;
    }
});