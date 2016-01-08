app.directive('ngIconpicker', function ($parse) {
    return {
        restrict: 'A',
        transclude: false,
        link: function(scope, element, attrs , ctrl) {
            var modelAccessor = $parse(attrs.ngModel);
            console.log(scope.menu_item);
            $(element).iconpicker({
                iconset: "fontawesome",
                icon: scope.menu_item && scope.menu_item.custom_icon ? scope.menu_item.custom_icon : "fa-bomb",
                placement: 'inline'
            });

            $(element).on('change', function(e){
                scope.menu_item.custom_icon = e.icon;
                scope.$parent.updateMenuItem(scope.menu_item);
            })
        }
    };
});