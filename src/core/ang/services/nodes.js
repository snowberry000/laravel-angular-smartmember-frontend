app.factory('Nodes', function () {

	return {
		GetAll: function() {
			return [
				{
					"slug" : 'site_settings',
                    "parent": '',
					"feature" : "Settings",
					"heading" : "Setup site settings" ,
					"template" : "templates/components/public/administrate/other/appearance/settings.html",
					"controller" : "siteSettingsWizardController",
					"image": "/images/image.png",
					"icon": "user",
					"enabled" : true ,
					"completed" : false ,
				} ,

				{
                    "slug" : 'product',
                    "parent": 'site_settings',
					"feature" : "Product",
					"heading" : "Create your first product" ,
					"template" : "templates/components/public/administrate/site/membership/product.html",
					"controller" : "accessWizardController",
					"image": "/images/image.png",
					"icon": "user",
					"enabled" : true ,
					"completed" : false
				} ,

				{
                    "slug" : 'lesson',
                    "parent": 'access_level',
					"feature" : "Lesson",
					"heading" : "Create a lesson" ,
					"template" : "templates/components/public/admin/wizard/lesson_creation.html",
                    "controller" : "lessonWizardController",
					"image": "/images/image.png",
					"icon": "user",
					"enabled" : true ,
					"completed" : false
				} ,

				{
                    "slug" : 'menu',
                    "parent": 'lesson',
					"feature" : "Menus",
					"heading" : "Configure navigation menus" ,
					"template" : "templates/components/public/administrate/site/appearance/menus.html",
					"controller" : "menuWizardController",
					"image": "/images/image.png",
					"icon": "user",
					"enabled" : true ,
					"completed" : false
				}
				,
                {
                    "slug" : 'sendgrid',
                    "parent": 'menu',
                    "feature" : "Sendgrid",
                    "heading" : "Add SendGrid integration" ,
                    "template" : "templates/components/public/app/admin/apps/app_configurations/wizard_sendgrid.html",
                    "controller" : "sendgridWizardController",
	                "image": "/images/image.png",
	                "icon": "user",
                    "enabled" : true ,
                    "completed" : false
                } ,
                {
                    "slug" : 'paypal',
                    "parent": 'sendgrid',
                    "feature" : "Paypal",
                    "heading" : "Add Paypal integration" ,
                    "template" : "templates/components/public/app/admin/apps/app_configurations/wizard_paypal.html",
                    "controller" : "paypalWizardController",
	                "image": "/images/image.png",
	                "icon": "user",
                    "enabled" : true ,
                    "completed" : false
                } ,
				{
                    "slug" : 'blog',
                    "parent": 'paypal',
					"feature" : "Blog",
					"heading" : "Write a blog post" ,
					"template" : "templates/components/public/app/admin/post/post.html",
					"controller" : "postWizardController",
					"image": "/images/image.png",
					"icon": "user",
					"enabled" : true ,
					"completed" : false
				} ,
				{
					"slug" : 'upload_site_logo',
                    "parent": '',
					"feature" : "Logo",
					"heading" : "Update site branding" ,
					"description": "Before adding content to your site, upload it's logo (if you have one)",
					"template" : "templates/components/public/administrate/wizard/nodes/upload_site_logo.html",
					"controller" : "siteLogoWizardController",
					"image": "/images/image.png",
					"icon": "find",
					"enabled" : true ,
					"completed" : false ,
				} ,
				{
					"slug" : 'create_site_modules',
                    "parent": '',
					"feature" : "Modules",
					"heading" : "Create modules (categories)" ,
					"description": "To better organize the lessons on your site, create some module(s) (aka categories)",
					"template" : "templates/components/public/administrate/wizard/nodes/create_site_modules.html",
					"controller" : "modulesWizardController",
					"image": "/images/image.png",
					"icon": "folder open outline",
					"enabled" : true ,
					"completed" : false ,
				} ,
				{
					"slug" : 'create_site_lessons',
                    "parent": '',
					"feature" : "Lessons",
					"heading" : "Add lesson content" ,
					"description": "Give members something to access for joining your site - paid or free alike",
					"template" : "templates/components/public/administrate/wizard/nodes/lesson_creation.html",
					"controller" : "lessonWizardController",
					"image": "/images/image.png",
					"icon": "write",
					"enabled" : true ,
					"completed" : false ,
				} ,
				{
					"slug" : 'lock_site_content',
                    "parent": '',
					"feature" : "Lock Content",
					"heading" : "Restrict access to site content" ,
					"description": "Want this site's content to be private? Optionally lock it down here",
					"template" : "templates/components/public/administrate/wizard/nodes/lock_site_content.html",
					"controller" : "lockContentWizardController",
					"image": "/images/image.png",
					"icon": "lock",
					"enabled" : true ,
					"completed" : false ,
				} ,
				{
					"slug" : 'invite_members',
                    "parent": '',
					"feature" : "Invite members",
					"heading" : "Invite members and JV's" ,
					"description": "Send out invite emails or hand out your unique url to get members on your site",
					"template" : "templates/components/public/administrate/wizard/nodes/invite_members.html",
					"controller" : "inviteMembersWizardController",
					"image": "/images/image.png",
					"icon": "add user",
					"enabled" : true ,
					"completed" : false ,
				} ,
				{
					"slug" : 'update_team_name',
					"parent": '',
					"feature" : "Update Team Name",
					"heading" : "Update Your Team Name" ,
					"description": "Teams default to your name - but can change to appear more brand-friendly.",
					"template" : "templates/components/public/administrate/wizard/nodes/update_team_name.html",
					"controller" : "teamNameWizardController",
					"image": "/images/image.png",
					"icon": "user",
					"enabled" : true ,
					"completed" : false ,
				},
				{
					"slug" : 'create_new_site',
					"parent": '',
					"feature" : "Create New Site",
					"heading" : "Create New Site" ,
					"description": "Create your first site here.",
					"template" : "templates/components/public/administrate/wizard/nodes/create_new_site.html",
					"controller" : "siteWizardController",
					"image": "/images/image.png",
					"icon": "globe",
					"enabled" : true ,
					"completed" : false ,
				}

			]
		}
	}
});