var admin_toolbar = RequireObject('public/admin-bar');
var current_page = RequireObject('public/my');

describe( 'Sign people in successfully', function()
{
	it( 'should be able to sign people in', function()
	{
		current_page.Visit();

		current_page.SetEmail( browser.params.user.email );
		current_page.SetPassword( browser.params.user.password );

		current_page.GetSignInButton().click().then( function()
		{
			browser.waitForAngular();
			expect( admin_toolbar.GetToolbar().isPresent() ).toBe(true);
		} )
	} );
} );