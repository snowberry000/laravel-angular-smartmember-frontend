// app.directive('urlSelector', function ( $parse) {
//   return {
//     restrict : 'A',
//     scope: '=',//{ method:'&method' },
//     replace : false ,
//     require : 'ngModel',
//     templateUrl: function(elem,attrs) {
//        return attrs.templateUrl || "templates/modals/popover.html"
//     },
//     link : function(scope, element, attrs , ctrl) {
//        scope.$watch('ctrl.$viewValue',function(){
//          scope.model = ctrl.$viewValue;
//          if(attrs.type)
//             scope.model.type = attrs.type;
          
//        }

//       )
//     }
//  }
// });

app.directive( 'urlPopup', function( smModal , $compile)
{
  return {
    restrict: 'AE',
    scope:  '=' ,
    require : 'ngModel',
    link: function( scope, next_item, attributes , ctrl)
    {
      var the_options = {
        hoverable: attributes.edit ? true : (attributes.hoverable || false),
        position: attributes.position || 'right center',
        //popup: '.special.popup',
        html: attributes.edit ? '<button class="ui tiny red button edit-admin" data-state="' + attributes.state +
        '"  data-attributes="' + attributes.stateattributes +
        '">edit</button>' : attributes.html || '',
        target: attributes.target || '',
        exclusive: true,
        preserve: true,
        on : 'click',
        duration: attributes.edit ? 100 : attributes.duration || 0,
        delay: {
          show: 100,
          hide: attributes.edit ? 500 :  attributes.hide || 0
        },
        onShow: function (el) { // load data (it could be called in an external function.)
              var popup = this;
              if(attributes.html){
                $.ajax({
                    url: attributes.html
                }).done(function(result) {
                    popup.html(result);
                    $compile( popup.contents() )(scope);
                }).fail(function() {
                    popup.html('error');
                });
              }
          }
      };
        scope.$watch('ctrl.$viewValue',function(){
          scope.model = ctrl.$viewValue;
          if(attributes.type)
             scope.model.type = attributes.type;
           
        });
      scope.next_item = next_item;
      $( next_item ).popup( the_options );
    },
    controller : function($scope){
      $scope.close = function(){
        $($scope.next_item).popup('remove popup');
      }
    }
  };
} );