var app = angular.module("app");

app.config(function($stateProvider){
    $stateProvider
        .state("public.app.admin.members",{
            url: "/members",
            template: "<ui-view></ui-view>",
            controller: 'AdminMembersAreaController'
        })
});

app.controller( "AdminMembersAreaController", function( $scope, $stateParams,$state,$rootScope,$timeout, $http, Restangular )
{
    if( !$rootScope.site || $rootScope.site.capabilities.indexOf( 'manage_members' ) == -1 )
        $state.go('public.app.site.home');
} );