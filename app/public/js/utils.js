(function() {
  $(document).ready(function() {
    return $('.ui-view-container').css({
      "min-height": $(window).height() - $('.nav-bar').height() - $('footer').height() + 'px'
    });
  });

}).call(this);
