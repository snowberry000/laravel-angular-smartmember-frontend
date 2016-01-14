var PageObject = function()
{
	var email_input = element( by.model( 'user.email' ) );
	var password_input = element( by.model( 'user.password' ) );
	var login_button = element( by.css( '.button.green' ) );
	var register_button = element( by.css( '.button.blue' ) );

	this.Visit = function()
	{
		return browser.get( 'http://my.' + browser.params.site_url );
	};

	this.PopModal = function()
	{
		return login_button.click()
	};
	this.SetEmail = function( text )
	{
		return email_input.sendKeys( text );
	};
	this.SetPassword = function( text )
	{
		return password_input.sendKeys( text );
	};
	this.GetSignInButton = function()
	{
		return login_button
	};
	this.GetSignUpButton = function()
	{
		return register_button
	};
};

module.exports = new PageObject();