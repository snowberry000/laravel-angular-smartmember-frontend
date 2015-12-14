app.filter( 'sizetonumberword', [ function()
{
	return function( size )
	{
		if( size == 'mini' )    return 'two';
		if( size == 'tiny' )    return 'three';
		if( size == 'small' )   return 'four';
		if( size == 'medium' )  return 'four';
		if( size == 'large' )   return 'five';
		if( size == 'big' )     return 'six';
		if( size == 'huge' )    return 'seven';
		if( size == 'massive' ) return 'eight';

		return 'four';
	}
} ] );