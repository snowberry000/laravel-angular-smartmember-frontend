$(function(){
    $("body").on('click', 'ul.primary_nav a', function(e){
        $('body').removeClass('nav_open');
    });


    $("body").on("click", "#sidebar-shortcuts a", function (e) {
        $(".nav-list li").removeClass("active");
        $(".nav-list li").first().addClass("active");

    });

    $("body").on("click", ".nav-list li a", function (e) {
        //if (!($(this).hasClass("dropdown-toggle"))) {
            $(".nav-list li").removeClass("active");
            $(this).closest("li").addClass("active");
        //}
    });
})

function fixMenuWidth() {
    var initial_top_location = 0;
    var elements_hidden = [];
    $("ul.nav.navbar-nav.main-menu li.dropdown").remove();
    $("ul.nav.navbar-nav.main-menu li").each(function(){
        var offset = $(this).offset();

        if( initial_top_location == 0 )
        {
            initial_top_location = offset.top;
        }

        if( offset.top != initial_top_location ) {
            elements_hidden.push( $(this) );
            $(this).hide();
        }
    });

    if( elements_hidden.length > 0 )
    {
        elements_hidden.unshift( $("ul.nav.navbar-nav.main-menu li:visible:last") );
        $("ul.nav.navbar-nav.main-menu li:visible:last").hide();

        var new_element = $('<li>').addClass('dropdown')
            .html(
            $('<a>').attr('href','#').addClass('dropdown-toggle').css('padding-right','7px').css('padding-left','7px').attr('data-toggle','dropdown').attr('aria-haspopup','true').attr('aria-expanded','false')
                .html( '<div><img align="middle" class="" style="z-index: 100;  height: 45px;  padding: 5px; display: block; margin-left: auto; margin-right: auto;"></div><span class="menu-text">More </span><span class="caret"></span>' ) )
                .append( '<ul class="dropdown-menu" aria-labelledby="dropdownMenu1"></ul>');

        $( elements_hidden).each(function(){
            var self = $(this);
            $(new_element).find('ul').append( $('<li>').append( $(self).find('a') )).append('<li role="separator" class="divider"></li>');
        });

        $("ul.nav.navbar-nav.main-menu").append( new_element );
    }
    return elements_hidden;
}

$(window).load(function () {
    activeNavList();

    //var w = Math.max(document.documentElement.clientWidth, window.innerWidth || 0);
    //if (w > 1440) document.querySelector('body').classList.add('widescreen');
})

function activeNavList() {
    var path = window.location.hash;
    var arr = path.split("/");
    if(arr[1])
        path = window.location.hash.split("/")[1];

    var sideLink = $('.nav-list a[nav-link="' + path + '"]');
    sideLink.closest("li").addClass("active");
}