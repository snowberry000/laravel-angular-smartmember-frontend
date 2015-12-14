app.directive('foonice', function(){
    return function(scope, element){
        var footableTable = element;

        //console.log( "here1" );
        if( !scope.$last ) {
	        //console.log( "here1b" );
            //return false;
        }

        //console.log( "her2" );

        scope.$evalAsync(function(){

            //console.log( "Here3" );
            if( !footableTable.hasClass('footable-loaded')) {
                footableTable.footable();
            }

            footableTable.trigger('footable_initialized');
            footableTable.trigger('footable_resize');
            footableTable.trigger('footable_redraw');

            //console.log( "here4" );
        });
    };
})