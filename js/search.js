jQuery(document).ready(function ($) {
  // on submit
  $('#searchform').submit(function(event) {
    event.preventDefault();

    // setting variables
    $query = $("#search").val();
    $url = 'http://itunes.apple.com/search';

    // validation
    if ($query.trim() && $query != 'Search') {
      $.ajax({
        type: "POST",
        url: $url,
        cache: false,
        timeout: 5000,
        data: {term:$query, media:"music", entity:"musicArtist,album"},
        beforeSend: function(xhr) {

          // Display loader icon.
          $('#loader').fadeIn(100);

        },
        dataType: "jsonp",
      }).done(function(json) {
        // console.log(json.results);
        // empty result element
        $('#result').empty();
        $.each(json.results, function(key, value) {
          // creating list element
          $li = $('<li></li>');

          // creating entry
          $entry = $('<div></div>');
          $entry.addClass('entry');

          // artist name
          $artistName = $('<a></a>');
          $artistName.attr('href', value.artistLinkUrl || value.artistViewUrl);
          $artistName.html(value.artistName);

          // collection name
          $collectionName = $('<a></a>');
          $collectionName.attr('href', value.collectionViewUrl);
          $collectionName.html(value.collectionName);

          // appending to entry
          $entry.append($artistName, $collectionName);

          // creating details
          $details = $('<div></div>');
          $details.addClass('details');

          // wrapper type
          $details.html('wrapperType: ' + value.wrapperType);

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