var PageObject = function()
{
	var the_toolbar = element( by.css( '.admin_bar' ) );

	this.GetToolbar = function()
	{
		return the_toolbar;
	}
};

module.exports = PageObject;