app.directive('siteAd', ['$timeout', '$parse', function ($timeout, $parse) {
  return {
    restrict: 'A',
    link: function (scope, elem, attrs) {
         $timeout(function () { // You might need this timeout to be sure its run after DOM render.
          	if(attrs.id != 'none')
            {
              scope.bannerView(attrs.id);
            }
            else
            {
              //console.log('info called');
            }
          	//console.log('attrs: ');
          	//console.log(attrs.id);
         }, 1, false);
         
         var fn = $parse(attrs.myRightClick);
         angular.element.bind('contextmenu', function(event) {
           scope.$apply(function() {
             event.preventDefault();
             fn(scope, {$event:event});
           });
         });
    }
  }
 }]);