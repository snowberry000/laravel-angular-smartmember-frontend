$(function(){

    $("body").on('click', 'ul.primary_nav > li > a', function(e){
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

$(window).load(function () {
    activeNavList();

    var w = Math.max(document.documentElement.clientWidth, window.innerWidth || 0);
    if (w > 1440) document.querySelector('body').classList.add('widescreen');
})

function activeNavList() {
    var path = window.location.hash;
    var arr = path.split("/");
    if(arr[1])
        path = window.location.hash.split("/")[1];

    var sideLink = $('.nav-list a[nav-link="' + path + '"]');
    sideLink.closest("li").addClass("active");
}