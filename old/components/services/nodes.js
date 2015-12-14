app.factory('Nodes', function () {

	return {
		GetAll: function() {
			return [
				{
					"slug" : 'site_settings',
                    "parent": '',
					"feature" : "Settings",
					"heading" : "Setup site settings" ,
					"template" : "templates/admin/other/appearance/settings.html",
					"controller" : "siteSettingsWizardController",
					"enabled" : true ,
					"completed" : false ,
				} ,

				{
                    "slug" : 'product',
                    "parent": 'site_settings',
					"feature" : "Product",
					"heading" : "Create your first product" ,
					"template" : "templates/admin/site/membership/product.html",
					"controller" : "accessWizardController",
					"enabled" : true ,
					"completed" : false
				} ,

				{
                    "slug" : 'lesson',
                    "parent": 'access_level',
					"feature" : "Lesson",
					"heading" : "Create a lesson" ,
					"template" : "templates/admin/site/content/syllabus/lesson.html",
                    "controller" : "lessonWizardController",
					"enabled" : true ,
					"completed" : false
				} ,

				{
                    "slug" : 'menu',
                    "parent": 'lesson',
					"feature" : "Menus",
					"heading" : "Configure navigation menus" ,
					"template" : "templates/admin/site/appearance/menus.html",
					"controller" : "menuWizardController",
					"enabled" : true ,
					"completed" : false
				}
				,
                {
                    "slug" : 'sendgrid',
                    "parent": 'menu',
                    "feature" : "Sendgrid",
                    "heading" : "Add SendGrid integration" ,
                    "template" : "templates/admin/team/integrations/wizard_sendgrid.html",
                    "controller" : "sendgridWizardController",
                    "enabled" : true ,
                    "completed" : false
                } ,
                {
                    "slug" : 'paypal',
                    "parent": 'sendgrid',
                    "feature" : "Paypal",
                    "heading" : "Add Paypal integration" ,
                    "template" : "templates/admin/team/integrations/wizard_paypal.html",
                    "controller" : "paypalWizardController",
                    "enabled" : true ,
                    "completed" : false
                } ,
				{
                    "slug" : 'blog',
                    "parent": 'paypal',
					"feature" : "Blog",
					"heading" : "Write a blog post" ,
					"template" : "templates/admin/site/content/blog/post.html",
					"controller" : "postWizardController",
					"enabled" : true ,
					"completed" : false
				} ,
				{
					"slug" : 'upload_site_logo',
                    "parent": '',
					"feature" : "Logo",
					"heading" : "Update site branding" ,
					"description": "Before adding content to your site, upload it's logo (if you have one)",
					"template" : "templates/admin/site/wizard/nodes/upload_site_logo.html",
					"controller" : "siteLogoWizardController",
					"enabled" : true ,
					"completed" : false ,
				} ,
				{
					"slug" : 'create_site_modules',
                    "parent": '',
					"feature" : "Modules",
					"heading" : "Create modules (categories)" ,
					"description": "To better organize the lessons on your site, create some module(s) (aka categories)",
					"template" : "templates/admin/site/wizard/nodes/create_site_modules.html",
					"controller" : "modulesWizardController",
					"enabled" : true ,
					"completed" : false ,
				} ,
				{
					"slug" : 'create_site_lessons',
                    "parent": '',
					"feature" : "Lessons",
					"heading" : "Add lesson content" ,
					"description": "Give members something to access for joining your site - paid or free alike",
					"template" : "templates/admin/site/wizard/nodes/lesson_creation.html",
					"controller" : "lessonWizardController",
					"enabled" : true ,
					"completed" : false ,
				} ,
				{
					"slug" : 'lock_site_content',
                    "parent": '',
					"feature" : "Lock Content",
					"heading" : "Restrict access to site content" ,
					"description": "Want this site's content to be private? Optionally lock it down here",
					"template" : "templates/admin/site/wizard/nodes/lock_site_content.html",
					"controller" : "lockContentWizardController",
					"enabled" : true ,
					"completed" : false ,
				} ,
				{
					"slug" : 'invite_members',
                    "parent": '',
					"feature" : "Invite members",
					"heading" : "Invite members and JV's" ,
					"description": "Send out invite emails or hand out your unique url to get members on your site",
					"template" : "templates/admin/site/wizard/nodes/invite_members.html",
					"controller" : "inviteMembersWizardController",
					"enabled" : true ,
					"completed" : false ,
				} ,
				{
					"slug" : 'update_team_name',
					"parent": '',
					"feature" : "Update Team Name",
					"heading" : "Update Your Team Name" ,
					"description": "Teams default to your name - but can change to appear more brand-friendly.",
					"template" : "templates/admin/team/wizard/nodes/update_team_name.html",
					"controller" : "teamNameWizardController",
					"enabled" : true ,
					"completed" : false ,
				},
				{
					"slug" : 'create_new_site',
					"parent": '',
					"feature" : "Create New Site",
					"heading" : "Create New Site" ,
					"description": "Create your first site (or another one!) here.",
					"template" : "templates/admin/team/wizard/nodes/create_new_site.html",
					"controller" : "siteWizardController",
					"enabled" : true ,
					"completed" : false ,
				}

			]
		}
	}
});