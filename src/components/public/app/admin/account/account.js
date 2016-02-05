var app = angular.module("app");

app.config(function($stateProvider){
    $stateProvider
        .state("public.app.admin.account",{
            url: "/account",
            template: "<ui-view></ui-view>",
            controller: "UserAccountController"
        })
});


app.controller("UserAccountController", function ($scope) {

});

