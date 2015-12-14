app.filter( 'numbertoword', [ function()
{
	return function( number )
	{
		var words = [ 'one', 'two', 'three', 'four', 'five', 'six',
			'seven', 'eight', 'nine', 'ten', 'eleven', 'twelve', 'thirteen', 'fourteen', 'fifteen', 'sixteen' ];
		return words[ number - 1 ];
	}
} ] );