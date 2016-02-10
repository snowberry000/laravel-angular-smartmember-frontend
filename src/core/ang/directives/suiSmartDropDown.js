app.directive( 'suiSmartDropdown', function( $timeout )
{
    return {
        restrict: 'A',
        require: '?ngModel',
        scope: {
            ngModel: '='
        },
        link: function( scope, next_item, attributes, ngModel )
        {
            var options = {
                onChange: function( value, text, $choice ) {

                    if( ngModel )
                    {
                        ngModel.$setViewValue( value );
                    }
                }
            };

            $( next_item ).dropdown( options );
            window.setTimeout(function () {
                $( next_item ).dropdown ( 'set text', attributes.label);
            }, 3000);
            $( next_item ).on( 'keydown', function( event )
            {
                if( event.which == 13 )
                {
                    var href = $( '.item.selected:first a' ).attr( 'href' );
                    if( href )
                    {
                        window.location.href = href;
                    }
                }
            } )
        }
    };
} );