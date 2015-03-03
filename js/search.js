jQuery(function($) {
  $('#searchform').submit(function(event) {
    event.preventDefault();

    var query = $("#search").val();
    var url = 'http://itunes.apple.com/search';
    var parameters = $('input[name=parameters]:checked', '#searchform');
    var entities = parameters.attr('data-entities');
    var attributes = parameters.attr('data-attributes');

    if (query.trim() && query != 'Search') {
      $.ajax({
        type: "POST",
        url: url,
        timeout: 5000,
        dataType: "jsonp",
        data: JSON.parse('{ "term":"'+query+'", "media":"music", "entity":"'+entities+'", "attributes":"'+attributes+'" }'),
        beforeSend: function(xhr) {
          // get loading icon
          var dom_ajax_loader = $('#loader_icon');

          // create new offscreen image
          var ajax_loader = new Image();
          ajax_loader.src = dom_ajax_loader.attr('src');

          // place loader icon screen center
          $('#loader_icon').css({
            left: (($(window).width() - ajax_loader.width) / 2),
            top: (($(window).height() - ajax_loader.height) / 2)
          });
          // display icon
          $('#loader').fadeIn(100);
        },
      }).done(function(json) {
        console.log('result: %O', json.results);
        $('#result').empty();

        $.each(json.results, function(key, result) {
          var li = $('<li></li>').addClass('element_'+key);
          var entry = $('<div></div>').addClass('entry');

          // artist name
          var artistName = $('<a></a>').addClass('artist-name');
          artistName.attr('href', result.artistLinkUrl || result.artistViewUrl);
          artistName.text(result.artistName);

          // collection name
          var collectionName = $('<a></a>').addClass('collection-name');
          collectionName.attr('href', result.collectionViewUrl);
          collectionName.text(result.collectionName);

          entry.append(artistName, collectionName);

          var details = $('<div></div>').addClass('details');
          var track = $('<a></a>').addClass('track');

          if (result.trackNumber || result.trackName) {
            // track number
            var trackNumber = $('<span></span>').addClass('number');
            trackNumber.text(result.trackNumber+' out of '+result.trackCount+' - ');

            // track name
            var trackName = $('<span></span>').addClass('name');
            trackName.text(result.trackName);

            track.append(trackNumber, trackName);
          }

          // wrapper type
          var type = $('<span></span>').addClass('type');
          // type.css('fontWeight', 'bold');
          type.text(result.wrapperType);

          details.append(track, type);
          li.append(entry, details);
          $('#result').append(li);
        });
      }).fail(function(json) {
        var li = $('<li></li>').addClass('element_'+key);

        li.append('<span>Failed: '+json+'</span>');
        $('#result').append(li);
      }).always(function() {
        // hide loader icon
        $('#loader').hide();
      });
    }
  });
});
