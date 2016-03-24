app.directive('sitePreview', function() {
    return {
        restrict: 'AE',
        link: function( scope, element, attrs ) {
            element.css('width','100%');
        },
        templateUrl: '/templates/components/admin/app/common/site-preview.html',
        controller : function($scope, $element, $attrs, $sce ){
            $scope.GetPreviewViewportWidth = function()
            {
                switch( $scope.GetPreviewViewport() )
                {
                    case 'mobile':
                        return '450px';
                    case 'tablet':
                        return '768px';
                    case 'desktop':
                    default:
                        return '100%';
                }
            };

            $scope.$watch(function () {
                return $scope.$eval( $attrs[ 'src' ] );
            }, function (newValue) {

                if( newValue )
                    $scope.src = $sce.trustAsResourceUrl( newValue );
            });
        }
    };
});