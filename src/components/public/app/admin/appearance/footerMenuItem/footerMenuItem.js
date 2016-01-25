var app = angular.module("app");

app.config(function($stateProvider){
    $stateProvider
        .state("public.app.admin.appearance.footerMenuItem",{
            url: "/footerMenu/:id?",
            templateUrl: "/templates/components/public/app/admin/appearance/footerMenuItem/footerMenuItem.html",
            controller: "MenuItemModalInstanceCtrl",
            resolve: {
                loadPlugin: function ($ocLazyLoad) {
                    return $ocLazyLoad.load([
                        {
                            name: 'ui.sortable'
                        }
                    ]);
                }

            }
        })
});