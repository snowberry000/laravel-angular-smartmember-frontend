//name can be set to anything, slug is what gets used for the css file/template folders
// theme_options is an array of slugs from theme options available at theme-options.js
// you can also send in a theme option object instead and it will use that instead of looking it up in the global_theme_options
// if you send in an object as one of the items in the theme_options array and it has a slug that exists on theme-options.js then you only have to send in attributes you want to overwrite (besides of course the identifying slug)
var global_themes = [
	{
		name: "default",
		slug: "default",
		theme_options: [ 'site_background_image','site_background_color','primary_theme_color', 'secondary_theme_color', 'nav_icons_left_align', 'nav_font_color', 'body_background_color', 'body_font_color', 'title_color', 'subtext_color', 'module_heading_text_color', 'module_heading_background_color', 'module_background_color', 'module_link_text_color', 'module_note_text_color', 'module_note_background_color', 'privacy_text_color' ]
	}
];