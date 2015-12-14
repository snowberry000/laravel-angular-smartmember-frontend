
app.service('overlay', function () {

    this.CloseMenu = function () {
       $('body').removeClass('nav_open');
    }
});