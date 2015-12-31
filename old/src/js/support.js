function support() {

    updateCategory();
    $('.category_parent').sortable({
        handle: '.panel-heading',
        toleranceElement: 'div',
        update: function (e) {
        }
    });

    $('.article_parent').sortable({
        appendTo: "body",
        helper: self.FixHelper,
        items: 'tr:not(.no_articles)',
        connectWith: '.article_parent',
        update: function (e) {
            e.stopPropagation();
            updateCategory();
        }
    });
}

function updateCategory() {
    $('.article_parent').each(function () {
        if ($(this).children('.article_item').length > 0) {
            $(this).find('.no_articles').remove();
        }
        else if ($(this).children('.no_articles').length == 0) {
            var new_html = [
                '<tr class="no_articles">',
                '<td colspan=3>NO ARTICLES ADDED YET</td>',
                '</tr>'
            ].join('\n');

            $(this).append(new_html);
        }
    });
}
