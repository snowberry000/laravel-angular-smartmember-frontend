app.factory( 'smSidebar', [ '$rootScope', function( $rootScope )
{
	var self = {};

	self.Show = function( the_sidebar, template_file )
	{
		$rootScope.left_sidebar_contents = 'templates/components/public/sidebars/' + template_file;

		$( the_sidebar ? the_sidebar : '.ui.sidebar' ).sidebar( {
			transition: 'overlay',
			closable: false,
			dimPage: false
		} ).sidebar( 'toggle' );
	};

	self.Close = function( the_sidebar )
	{
		$( the_sidebar ? the_sidebar : '.ui.sidebar' ).modal( 'hide' );
	};

	self.Init = function( the_sidebar )
	{
		$( the_sidebar ? the_sidebar : '.ui.sidebar' ).sidebar('toggle');
	};

	//self.Init();

	return self;
} ] );