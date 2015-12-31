var app = angular.module("app");

app.config(function($stateProvider){
    $stateProvider
        .state("public.admin.site.appearance.footerMenuItem",{
            url: "/footerMenu/:id?",
            templateUrl: "/templates/components/public/admin/site/appearance/footerMenuItem/footerMenuItem.html",
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