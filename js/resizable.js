jQuery(function($) {

  // setting vars
  var column01 = $('#column01');
  var column02 = $('#column02');
  var windowWidth = $(window).width();

  // setting init style
  column01.css({
    'width': windowWidth/2,
    'max-width': windowWidth - 350
  });
  column02.css({
    'width': windowWidth/2,
    'max-width': windowWidth - 350
  });

  // update vars and style on resize
  $(window).resize(function() {
    windowWidth = $(window).width();
    column01.css({
      'width': windowWidth - column02.width()
    });
    column02.css({
      'max-width': windowWidth - 350
    });
  });

  $('#handle').on('mousedown', function(event) {
    $(document).on('mousemove', function(event) {
      event.preventDefault();

      column01.css({
        // limiting to min and max width
        'width':  event.pageX < 350 ? 350 :
                  event.pageX > (windowWidth - 350) ? windowWidth - 350 :
                  event.pageX
      });
      column02.css({
        // limiting to min and max width
        'width':  (windowWidth - event.pageX) < 350 ? 350 :
                  (windowWidth - event.pageX) > (windowWidth - 350) ? windowWidth - 350 :
                  windowWidth - event.pageX
      });
    });

    // removing event handlers
    $(document).on('mouseup', function() {
      $(document).off('mouseup').off('mousemove');
      $('#handle').off('mousedown');
    });
  });

});
