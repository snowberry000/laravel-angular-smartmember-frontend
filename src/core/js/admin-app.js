$(function () {

    $("body").on("click", "#side-menu a", function (e) {

        if( $(this ).parent().find('ul' ).length )
        {
            console.log( 'has children', $(this ).parent().find('ul' ).html() );
        }
        else
        {
	        $('#overlay').click()
        }
    })

    $("body").on("click", ".the_sidebar .dropdown-toggle", function (e) {
        e.preventDefault();
        var submenu = $(this).parent("li").find(".submenu");
        if (submenu.is(":visible"))
            submenu.slideUp();
        else {
            $(".submenu").slideUp();
            $(this).parent("li").find(".submenu").slideDown("slow");
        }

        return false;

    })

    //shrink or expand sidebar
    $("body").on("click", ".sidebar-toggle", function (e) {

        var menu = $(this).closest("#sidebar");

        //make it bigger
        if (menu.hasClass("menu-min")) {
            $(this).find("i").addClass("fa-angle-double-left").removeClass("fa-angle-double-right");
            menu.removeClass("menu-min");
        }
        //make it smaller
        else {
            $(this).find("i").addClass("fa-angle-double-right").removeClass("fa-angle-double-left");
            menu.addClass("menu-min");
        }
    });

    $("body").on("click", ".the_sidebar li a", function (e) {
        if (!($(this).hasClass("dropdown-toggle"))) {
            $(".the_sidebar li").removeClass("active");
            $(this).closest("li").addClass("active");
        }
    });

    var b="ontouchstart" in document.documentElement;
    if(b){
        $("html").addClass("touch");
        //FastClick.attach(document.body)
    }
    else{
        $("html").addClass("no_touch")
    }

});

$(window).load(function () {
    activeSideBar();
})

function activeSideBar() {
    var path = window.location.hash;
    var sideLink = $('a[href="' + path + '"]');
    sideLink.closest("li").addClass("active");
    //sideLink.closest("ul.submenu").closest("li").addClass("open");
    sideLink.closest("ul.submenu").slideDown();


}