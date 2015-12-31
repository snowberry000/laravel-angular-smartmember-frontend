function syllabus() {

    updateModule();
    $('.module_parent').sortable({
        handle: '.panel-heading',
        toleranceElement: 'div',
        update: function (e) {
        }
    });

    $('.lesson_parent').sortable({
        appendTo: "body",
        helper: self.FixHelper,
        items: 'tr:not(.no_lessons)',
        connectWith: '.lesson_parent',
        update: function (e) {
            e.stopPropagation();
            updateModule();
        }
    });
}

function updateModule() {
    $('.lesson_parent').each(function () {
        if ($(this).children('.lesson_item').length > 0) {
            $(this).find('.no_lessons').remove();
        }
        else if ($(this).children('.no_lessons').length == 0) {
            var new_html = [
                '<tr class="no_lessons">',
                '<td colspan=3>NO LESSONS ADDED YET</td>',
                '</tr>'
            ].join('\n');

            $(this).append(new_html);
        }
    });
}
