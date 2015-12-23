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