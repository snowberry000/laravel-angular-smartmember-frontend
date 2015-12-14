app.factory('Wizards', function () {
	var self = {};
	self.GetAll = function() {
		return [
			{
				"slug" : 'site_content_wizard',
                "parent": '',
				"feature" : "Site Content Wizard",
				"heading" : "Fill your site with content" ,
				"enabled" : true ,
				"completed" : false ,
				"name" : "Fill your site with content",
				"nodes" : [
					"upload_site_logo" ,
					"create_site_modules",
					"create_site_lessons",
					"lock_site_content",
					"invite_members"
				]
			} ,

			{
				"slug" : 'site_launch_wizard',
                "parent": '',
				"feature" : "Site Launch Wizard",
				"heading" : "Get your site launch-ready" ,
				"enabled" : true ,
				"completed" : false ,
				"name" : "Get your site launch-ready",
				"nodes" : [
					"upload_site_logo" ,
					"create_site_modules",
					"create_site_lessons",
					"lock_site_content",
					"invite_members"
				]
			} 
		]
	},

	self.GetCurrent = function(slug) {
		var all = self.GetAll();

		for(var i=0; i < all.length; i++){
			if(all[i].slug == slug)
				return all[i];
		}
		return {};
	}

	return self;
});