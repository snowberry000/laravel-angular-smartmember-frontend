var app = angular.module("app");

app.controller("WidgetAvailableBannerController", function ($scope) {

});

app.controller("WidgetChosenBannerController", function ($scope) {
    $scope.show_settings = false;

    if( !$scope.chosen_widget.meta )
        $scope.chosen_widget.meta = {};

    $scope.delete = function(){
        $scope.$parent.delete( $scope.chosen_widget );
    }

    $scope.save = function(){
        $scope.$parent.save( $scope.chosen_widget );
    }
});

app.controller("WidgetDisplayBannerController", function ($scope) {
    //uncomment this line if we want to track views every time rendered, othewise we track once per load in the public controller
    //$scope.bannerView( $scope.display_widget.banner.id );
});