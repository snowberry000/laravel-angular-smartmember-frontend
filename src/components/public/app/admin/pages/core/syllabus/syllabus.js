var app = angular.module("app");

app.config(function ($stateProvider) {
    $stateProvider
        .state("public.app.admin.pages.syllabus", {
            url: "/syllabus",
            templateUrl: "/templates/components/public/app/admin/pages/core/syllabus/syllabus.html",
            controller: "SyllabusSettingsController"
        })
});

app.controller("SyllabusSettingsController", function ($scope, $rootScope, $state, Restangular, toastr, smModal) {
    $scope.site = $site = $rootScope.site;

    $scope.saved_site = false;
    $scope.saved_meta = false;

    $scope.save = function () {
        var data = {
            syllabus_format: $scope.site.syllabus_format,
            show_syllabus_toggle: $scope.site.show_syllabus_toggle,
            welcome_content: $scope.site.welcome_content
        };

        Restangular.all('site').customPUT(data, $scope.site.id).then(function ( response ) {
            $scope.saved_site = true;
            $scope.transitionAfterSave();
        });

        Restangular.all('siteMetaData').customPOST( $rootScope.meta_data, "save").then(function () {
            $scope.saved_meta = true;
            $scope.transitionAfterSave();
        });
    }

    $scope.transitionAfterSave = function() {
        if( $scope.saved_site && $scope.saved_meta ) {
            toastr.success("Your syllabus changes has been saved!");
            $state.go('public.app.admin.pages.core.list');
        }
    }
});