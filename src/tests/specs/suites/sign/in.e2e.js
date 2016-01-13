describe( 'Sign people in successfully', function()
{
	var admin_toolbar = require('admin-toolbar.js');
	var next_item = require('site-homepage.js');

	it( 'should be able to sign people in', function()
	{
		next_item.Visit();

		next_item.PopModal().then( function()
		{
			browser.waitForAngular();

			next_item.SetEmail( browser.params.non_admin_user.email );
			next_item.SetPassword( browser.params.non_admin_user.password );

			next_item.SubmitForm().click().then( function()
			{
				browser.waitForAngular();
				expect( admin_toolbar.GetToolbar() ).toBe( true );
			} )
		} );
	} );
} );