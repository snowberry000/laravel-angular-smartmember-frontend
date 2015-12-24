var app = angular.module("app");

app.controller("WidgetChosenTextController", function ($scope) {
    $scope.show_settings = false;

    if( !$scope.chosen_widget.meta )
        $scope.chosen_widget.meta = {};

    if( !$scope.chosen_widget.meta.content )
        $scope.chosen_widget.meta.content = '<p><br></p>';

    $scope.delete = function(){
        $scope.$parent.delete( $scope.chosen_widget );
    }

    $scope.save = function(){
        $scope.$parent.save( $scope.chosen_widget );
    }

    console.log('how many times does this get called?', $scope.chosen_widget );
});

app.controller("WidgetDisplayTextController", function ($scope) {

});