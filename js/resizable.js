jQuery(function($) {

  // setting vars
  var left = $('#left');
  var right = $('#right');
  var windowWidth = $(window).width();

  // setting init style
  left.css({
    'width': (windowWidth / 2) < 350 ? 350 : windowWidth / 2,
    'max-width': (windowWidth - 350) < 350 ? 350 : windowWidth - 350
  });
  right.css({
    'width': (windowWidth / 2) < 350 ? 350 : windowWidth / 2,
    'max-width': (windowWidth - 350) < 350 ? 350 : windowWidth - 350
  });

  // update vars and style on resize
  $(window).resize(function() {
    windowWidth = $(window).width();

    left.css({
      'width':  (windowWidth - right.width()) < 350 ? 350 : windowWidth - right.width(),
      'max-width': (windowWidth - 350) < 350 ? 350 : windowWidth - 350
    });
    right.css({
      'max-width': (windowWidth - 350) < 350 ? 350 : windowWidth - 350
    });
  });

  $('#handle').on('mousedown', function(event) {
    $(document).on('mousemove', function(event) {
      event.preventDefault();

      left.css({
        // limiting to min and max width
        'width':  event.pageX < 350 ? 350 :
                  event.pageX > (windowWidth - 350) ? windowWidth - 350 :
                  event.pageX
      });
      right.css({
        // limiting to min and max width
        'width':  (windowWidth - event.pageX) < 350 ? 350 :
                  (windowWidth - event.pageX) > (windowWidth - 350) ? windowWidth - 350 :
                  windowWidth - event.pageX
      });
    });

    // removing event handlers
    $(document).on('mouseup', function() {
      $(document).off('mouseup').off('mousemove');
    });
  });

});
