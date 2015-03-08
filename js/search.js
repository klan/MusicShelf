jQuery(function($) {

  /*
   * Search
   */
  $('#searchform').submit(function(event) {
    event.preventDefault();

    var query = $("#search").val();
    var search_url = 'https://itunes.apple.com/search';
    var parameters = $('input[name=parameters]:checked', '#searchform');
    var entities = parameters.attr('data-entities');
    var attributes = parameters.attr('data-attributes');
    var search_data = {
      'term': query,
      'media': 'music',
      'entity': entities,
      'attributes': attributes
    };

    if (query.trim() && query != 'Search') {
      var search = new iTunesSearchAPI().getResult({
        'url': search_url,
        'data': search_data,
        'resultType': 'search'
      }).formatResult();
    }
  });

  /*
   * Lookup
   */
  // var lookup_url = 'https://itunes.apple.com/lookup';
  // var lookup_data = {
  //   'id' : 909253,
  //   'entity' : 'album'
  // };

  /*
   * Classes & Methods
   */
  var iTunesSearchAPI = function() {
    this.name = 'iTunesSearchAPI';
    this.settings = {};
    this.results = {};
  };

  iTunesSearchAPI.prototype.getResult = function(settings) {
    var config = {
      'type': 'GET',
      'url': '',
      'timeout': 5000,
      'dataType': 'jsonp',
      'data': '',
      'resultType': ''
    };

    var self = this;

    if (settings) {
      $.extend(config, settings);
      self.settings = config;

      window.resultCall = $.ajax({
        type: config.type,
        url: config.url,
        timeout: config.timeout,
        dataType: config.dataType,
        data: config.data,
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
        self.results = json.results;
        // console.log(self);
      }).fail(function(json) {
        console.log('fail: %O', json);
      }).always(function() {
        // hide loader icon
        $('#loader').hide();
      });
    } else {
      console.log('missing settings!');
    }
    return self;
  };

  iTunesSearchAPI.prototype.formatResult = function() {
    var self = this;

    // wait for call to finish and for self.results to be populated
    $.when(window.resultCall).done(function() {
      console.log('results length: %i', self.results.length);

      switch (self.settings.resultType) {
        case 'search':
          $('#result').empty();

          $.each(self.results, function(key, result) {
            var li = $('<li></li>').addClass('element_'+key);
            var entry = $('<div></div>').addClass('entry');
            entry.attr('data-artist-id', result.artistId);

            // artist name
            var artistName = $('<a></a>').addClass('artist-name');
            // artistName.attr('href', result.artistLinkUrl || result.artistViewUrl);
            artistName.attr('href', 'https://itunes.apple.com/lookup?id='+result.artistId+'&entity=album');
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
            type.text(result.wrapperType);

            details.append(track, type);
            li.append(entry, details);
            $('#result').append(li);
          });
          break;
        case 'lookup':
          // close overlays (in case any is open), build album list, open new overlay
          $.each(self.results, function(key, result) {
            var li = $('<li></li>').addClass('element_'+key);
            var entry = $('<div></div>').addClass('entry');

            li.append(entry);
            $('#result').append(li);
          });
          break;
      }
    });
  };

});
