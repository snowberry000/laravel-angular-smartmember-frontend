var app = angular.module("app");

app.config(function($stateProvider){
    $stateProvider
        .state("public.admin.site.appearance.menu",{
            url: "/menu/:id?",
            templateUrl: "/templates/components/public/admin/site/appearance/menu/menu.html",
            controller: "MenuItemModalInstanceCtrl",
            // resolve: {
            //     loadPlugin: function ($ocLazyLoad) {
            //         return $ocLazyLoad.load([
            //             {
            //                 files: ['bower/ui-iconpicker/dist/scripts/ui-iconpicker.min.js']
            //             }
            //         ]);
            //     }
            // }
        })
});

