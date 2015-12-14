app.factory('TeamWizards', function () {
	var self = {};
	self.GetAll = function() {
		return [
			{
				"slug" : 'team_setup_wizard',
                "parent": '',
				"feature" : "Team Setup Wizard",
				"heading" : "Setup Your Team" ,
				"enabled" : true ,
				"completed" : false ,
				"name" : "Setup Your Team",
				"nodes" : [
					"update_team_name" ,
					"create_new_site"
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