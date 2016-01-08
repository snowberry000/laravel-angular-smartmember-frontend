app.factory( 'smSidebar', [ '$rootScope', function( $rootScope )
{
	var self = {};

	self.Show = function( the_sidebar, template_file, attributes )
	{
		if( the_sidebar == '.left_sidebar_contents' )
			$rootScope.left_sidebar_contents = 'templates/components/public/sidebars/' + template_file;
		else if( the_sidebar == '.top_sidebar_contents' )
			$rootScope.top_sidebar_contents = 'templates/components/public/sidebars/' + template_file;

		var the_options = {
			transition: 'overlay',
			closable: false,
			dimPage: false
		};

		if( attributes )
		{
			angular.forEach( attributes, function( value, key )
			{
				the_options[ key ] = value;
			} )
		}

		//console.log( 'the attributes', attributes, 'the_options', the_options );

		$( the_sidebar ? the_sidebar : '.ui.sidebar' ).sidebar( the_options ).sidebar( 'toggle' );
	};

	self.Toggle = function( the_sidebar )
	{
		$( the_sidebar ? the_sidebar : '.ui.sidebar' ).sidebar( 'toggle' );
	};

	self.Close = function( the_sidebar )
	{
		$( the_sidebar ? the_sidebar : '.ui.sidebar' ).sidebar( 'hide' );
	};

	self.Init = function( the_sidebar )
	{
		$( the_sidebar ? the_sidebar : '.ui.sidebar' ).sidebar('toggle');
	};

	//self.Init();

	return self;
} ] );