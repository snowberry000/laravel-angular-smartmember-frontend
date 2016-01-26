var app = angular.module("app");

app.config(function($stateProvider){
    $stateProvider
        .state("public.app.admin.members",{
            url: "/members",
            template: "<ui-view></ui-view>"
        })
});