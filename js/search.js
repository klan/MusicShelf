jQuery(function ($) {
  // on submit
  $('#searchform').submit(function(event) {
    event.preventDefault();

    // setting variables
    $query = $("#search").val();
    $url = 'http://itunes.apple.com/search';

    $parameters = $('input[name=parameters]:checked', '#searchform');
    $entities = $parameters.attr('data-entities');
    $attributes = $parameters.attr('data-attributes');

    // validation
    if ($query.trim() && $query != 'Search') {
      $.ajax({
        type: "POST",
        url: $url,
        timeout: 5000,
        dataType: "jsonp",
        data: JSON.parse('{ "term":"'+$query+'", "media":"music", "entity":"'+$entities+'", "attributes":"'+$attributes+'" }'),
        beforeSend: function(xhr) {
          // Get loading icon.
          var dom_ajax_loader = $('#loader_icon');

          // Create new offscreen image.
          var ajax_loader = new Image();
          ajax_loader.src = dom_ajax_loader.attr('src');

          // Place loader icon screen center.
          $('#loader_icon').css({
            left: (($(window).width() - ajax_loader.width) / 2),
            top: (($(window).height() - ajax_loader.height) / 2)
          });
          // Display icon.
          $('#loader').fadeIn(100);
        },
      }).done(function(json) {
        // console.log(json.results);
        // empty result element
        $('#result').empty();
        $.each(json.results, function(key, value) {
          // CREATING LIST ELEMENT
          $li = $('<li></li>');
          $li.addClass('element_'+key);

          // CREATING ENTRY
          $entry = $('<div></div>');
          $entry.addClass('entry');

          // artist name
          $artistName = $('<a></a>');
          $artistName.addClass('artist-name');
          $artistName.attr('href', value.artistLinkUrl || value.artistViewUrl);
          $artistName.html(value.artistName);

          // collection name
          $collectionName = $('<a></a>');
          $collectionName.addClass('collection-name');
          $collectionName.attr('href', value.collectionViewUrl);
          $collectionName.html(value.collectionName);

          // appending to entry
          $entry.append($artistName, $collectionName);

          // CREATING DETAILS
          $details = $('<div></div>');
          $details.addClass('details');

          // CREATING TRACK
          $track = $('<a></a>');
          $track.addClass('track');

          if (value.trackNumber || value.trackName) {

            // track number
            $trackNumber = $('<span></span>');
            $trackNumber.addClass('number');
            $trackNumber.html(value.trackNumber+' out of '+value.trackCount+' - ');

            // track name
            $trackName = $('<span></span>');
            $trackName.addClass('name');
            $trackName.html(value.trackName);

            // appending to track
            $track.append($trackNumber, $trackName);
          }

          // wrapper type
          $type = $('<span></span>');
          $type.addClass('type');
          $type.css('fontWeight', 'bold');
          $type.html(value.wrapperType);

          // appending to details
          $details.append($track, $type);

          // appending to list element
          $li.append($entry, $details);
          // appending to result element
          $('#result').append($li);
        });
      }).fail(function(json) {
        // appending to result element
        $('#result').append('<strong>Search failed, try again.</strong>');
      }).always(function() {
        // Hide loader icon.
        $('#loader').hide();
      });
    }
  });
});