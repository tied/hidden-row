(function(AJS,$){
    function findTable($elt){
        var $parent = $elt.parent();
        for (var i = 0; i < $parent.children().length; i++){
            if ($parent.children()[i].tagName === 'TABLE'){
                return $($parent.children()[i]);
            } else if ($parent.children()[i].tagName === 'DOCUMENT'){
                return null;
            } else if ($parent.children()[i] === $elt[0]){
                return findTable($parent);
            }
        }
    }

    function init(n){
        if (n > 1000){
            return;
        }
        var $editor = $('#wysiwygTextarea_ifr');
        if ($editor.length === 0){
            setTimeout(init, 100, n + 1);
            return;
        }
        var $macro = $editor.contents().find('img.editor-inline-macro[data-macro-name="Add Row Button"]');
        if ($macro.length === 0){
            setTimeout(init, 100, n + 1);
            return;
        }
        $macro.each(function(){
            $(this).hide();
            var $button = $('<button class="aui-button aui-button-link"></button>')
                .text(AJS.I18n.getText('com.mesilat.hidden-row.btn.caption'))
                .insertAfter($(this))
                .on('click', function(e){
                    e.preventDefault();
                    e.stopPropagation();

                    var $button = $(e.target);
                    var $table = findTable($button);
                    if ($table === null){
                        console.log('com.mesilat:hidden-row','WARN: no table found for button');
                    } else {
                        /*
                        var $tr = $table.find('tbody tr').last();
                        $('<tr>' + $tr.html() + '</tr>').insertBefore($tr);
                        */
                        var $tr = $table.find('tbody tr').filter(function(i,elt){
                            return $table[0] === $(elt).closest('table')[0];
                        }).last();
                        var $newTr = $('<tr>');
                        $newTr.append($tr.html());
                        $newTr.attr('class', $tr.attr('class'));
                        $newTr.insertBefore($tr);
                        $newTr.removeClass('com-mesilat-hidden-row-lastrow');
                    }
                });

            // Find a table
            var $table = findTable($button);
            if ($table === null){
                console.log('com.mesilat:hidden-row','WARN: no table found for button');
            } else {
                var $tr = $table.find('tbody tr').last();
                if ($tr.length === 0){
                    console.log('com.mesilat:hidden-row','WARN: no rows in table');
                } else {
                    $tr.addClass('com-mesilat-hidden-row-lastrow');
                }
            }
        });
    }

    AJS.bind('rte-ready', function(){
        setTimeout(init, 100, 0);
    });
})(AJS,AJS.$||$);