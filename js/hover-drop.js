/*
 * Hover Drop
 * Extends search.js
 */
jQuery(function($) {

  $('.lookup_result').on({
    mouseenter: function(e) {
      console.log('mouseenter: %O', e);

      $(e.target.lastElementChild).stop(true, true).show();

      // adding class
      $(e.target.lastElementChild).addClass('drop');

      var initTop = -(e.target.clientWidth/2)-(e.target.clientHeight);
      var initLeft = -(e.target.clientWidth/2);

      // console.log('left: %i, top: %i', initLeft, initTop);
      // console.log('x: %i, y: %i', e.offsetX, e.offsetY);

      $(e.target.lastElementChild).css({
        'height': e.target.clientWidth,
        'margin-top': initTop+e.offsetY,
        'margin-left': initLeft+e.offsetX
      });


      // waiting for css transition end
      $(e.target.lastElementChild).on('transitionend webkitTransitionEnd', function() {
        // removing class
        $(e.target.lastElementChild).removeClass('drop');

        $(this).off('transitionend webkitTransitionEnd');
      });
    },
    mouseleave: function(e) {
      console.log('mouseleave: %O',e);

      // $(e.target.lastElementChild).css({
      //   'opacity': 0
      // });
    }
  }, '.drop-parent');

});
