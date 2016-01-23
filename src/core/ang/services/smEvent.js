app.factory( 'smEvent', [ 'Restangular', function( Restangular )
{
    return {
        Log: function( event_name, optional_meta ) {
            var data = {
                event_name: event_name
            }

            if( optional_meta && typeof optional_meta == 'object' )
            {
                angular.forEach( optional_meta, function( value, key ) {
                    data[ key ] = value;
                });
            }

            Restangular.all('event').post( data );
        }
    }
} ] );