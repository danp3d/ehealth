# Set a minimum page size
$(document).ready ->
    $('.ui-view-container').css "min-height": $(window).height() - $('.nav-bar').height() - $('footer').height() + 'px'
