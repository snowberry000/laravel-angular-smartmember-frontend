app.factory( 'smMembers', [ 'Restangular', function( Restangular )
{
    return {
        Update: function( meta, sm_customer_id ) {
            if( !sm_customer_id )
                sm_customer_id = 10;

            meta.sm_customer_id = sm_customer_id;

            Restangular.all('memberMeta/save').post( meta );
        }
    }
} ] );