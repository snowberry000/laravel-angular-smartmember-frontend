app.factory( 'smMembers', [ 'Restangular', function( Restangular )
{
    return {
        Update: function( meta, sm_customer_id ) {
            if( !sm_customer_id )
                sm_customer_id = 10;

            meta.sm_customer_id = sm_customer_id;

            Restangular.all('memberMeta/save').post( meta );
        },
        Attributes: function( options, sm_customer_id ) {
            if( !sm_customer_id )
                sm_customer_id = 10;

            var data = {user_id: sm_customer_id, bypass_paging: 1};

            if( options.archived != undefined )
            {
                if( options.archived )
                    data.archived = 1;
                else
                    data.archived = 0;
            }

            if( options.shown != undefined )
            {
                if( options.shown )
                    data.shown = 1;
                else
                    data.shown = 0;
            }

            if( options.type != undefined )
            {
                data.type = options.type;
            }

            return Restangular.all('customAttribute').getList( data );
        },
        SetPreference: function( attribute, options, sm_customer_id ) {
            if( !sm_customer_id )
                sm_customer_id = 10;

            var data = {
                name: attribute,
                sm_customer_id: sm_customer_id
            }

            angular.forEach( options, function( value, key ) {
                data[ key ] = value;
            } );

            return Restangular.all('customAttribute/set').post( data );
        }
    }
} ] );