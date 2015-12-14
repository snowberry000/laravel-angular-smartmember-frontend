app.directive('urlSelector', function ( $parse) {
  return {
    restrict : 'A',
    scope: '=',//{ method:'&method' },
    replace : false ,
    require : 'ngModel',
    templateUrl: function(elem,attrs) {
       return attrs.templateUrl || "templates/modals/popover.html"
    },
    link : function(scope, element, attrs , ctrl) {
       scope.$watch('ctrl.$viewValue',function(){
         scope.model = ctrl.$viewValue;
         if(attrs.type)
            scope.model.type = attrs.type;
          
       }

      )
    }
 }
});