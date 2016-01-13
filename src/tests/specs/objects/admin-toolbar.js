var AdminToolbar = function()
{
	var the_toolbar = element( by.css( '.admin' ) );

	this.GetToolbar = function()
	{
		return the_toolbar;
	}
};

module.exports = new AdminToolbar();