app.factory('TeamWizard', function () {

	return {
		GetNodes: function() {
			return [
				{
					"slug" : 'team_profile',
					"parent": '',
					"feature" : "Name",
					"heading" : "Update team name" ,
					"description" : "Optionally change the name of your team to better represent your product, service, company, or person." ,
					"template" : "templates/admin/team/settings.html",
					"controller" : "teamNameWizardController",
					"enabled" : true,
					"completed" : false
				},
				{
					"slug" : 'team_members',
					"parent": 'team_profile',
					"feature" : "Invite Members",
					"heading" : "Invite team members" ,
					"description" : "If you have employees, assistants, or partners - invite them to help manage your team." ,
					"template" : "templates/admin/team/members/invite.html",
					"parent_controller" : "InviteMembersController",
					"controller" : "inviteMembersWizardController",
					"enabled" : true,
					"completed" : false
				},
				{
					"slug" : 'create_site',
					"parent": 'team_members',
					"feature" : "Site",
					"heading" : "Create a new site" ,
					"description" : "Get started by creating a new site for your team." ,
					"template" : "templates/admin/team/sites/single.html",
					"controller" : "siteWizardController",
					"enabled" : true,
					"completed" : false
				},
				{
					"slug" : 'team_listing',
					"parent": 'create_site',
					"feature" : "",
					"heading" : "Customize your team's public profile" ,
					"description" : "Update your team's public profile to be show in the Smart Member membership directory." ,
					"template" : "templates/admin/team/profile.html",
					"controller" : "teamBioWizardController",
					"enabled" : true,
					"completed" : false
				},


			]
		}
	}
});