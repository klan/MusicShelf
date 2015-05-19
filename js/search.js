jQuery(function($) {

  var query = null;
  var search_url = null;
  var entities = null;
  var attributes = null;
  var search_data = null;
  var search = null;
  var lookup_url = null;
  var lookup_identifier = null;
  var id = null;
  var entity = null;
  var lookup_data = null;
  var lookup = null;

  // set search identifier on column
  var parameters = $('input[name=parameters]:checked');
  var search_identifier = parameters.attr('id');
  $('.search_result').addClass(search_identifier);

  /*
   * Search
   */
  $('.search_form').submit(function(event) {
    event.preventDefault();

    query = $(".search").val();
    search_url = 'https://itunes.apple.com/search';
    parameters = $('input[name=parameters]:checked');
    search_identifier = parameters.attr('id');
    entities = parameters.attr('data-entities');
    attributes = parameters.attr('data-attributes');
    search_data = {
      'term': query,
      'media': 'music',
      'entity': entities,
      'attributes': attributes
    };

    if (query.trim() && query != 'Search') {
      search = new iTunesSearchAPI().getResult({
        'url': search_url,
        'data': search_data,
        'resultType': 'search'
      }).formatResult();

      // reset new search identifier on column
      $('.search_result').removeClass().addClass('search_result list');
      $('.search_result').addClass(search_identifier);
    }

    $('input[name=parameters]').change(function() {
      // reset vars
      parameters = $('input[name=parameters]:checked');
      search_identifier = parameters.attr('id');
      entities = parameters.attr('data-entities');
      attributes = parameters.attr('data-attributes');
      search_data = {
        'term': query,
        'media': 'music',
        'entity': entities,
        'attributes': attributes
      };

      // redo call
      search = new iTunesSearchAPI().getResult({
        'url': search_url,
        'data': search_data,
        'resultType': 'search'
      }).formatResult();

      // reset new search identifier on column
      $('.search_result').removeClass().addClass('search_result list');
      $('.search_result').addClass(search_identifier);
    });
  });

  /*
   * Lookup
   */
  $('.search_result').on('click', '.anchor', function () {
    event.preventDefault();

    // {
    //   'song': {
    //     'https://itunes.apple.com/lookup?id=974187298'
    //   },
    //   'collection': {
    //     'https://itunes.apple.com/lookup?id=974187289',
    //     'https://itunes.apple.com/lookup?id=974187289&entity=album'
    //   },
    //   'collection & tracks': {
    //     'https://itunes.apple.com/lookup?id=974187289&entity=song'
    //   },
    //   'artist': {
    //     'https://itunes.apple.com/lookup?id=368183298'
    //   },
    //   'artist & collections': {
    //     'https://itunes.apple.com/lookup?id=368183298&entity=album'
    //   },
    // }

    lookup_url = 'https://itunes.apple.com/lookup';
    lookup_identifier = $(this).parent().attr('class');
    id = $(this).attr('data-id');
    entity = $(this).attr('data-entity');
    lookup_data = {
      'id' : id,
      'entity' : entity
    };

    lookup = new iTunesSearchAPI().getResult({
      'url': lookup_url,
      'data': lookup_data,
      'resultType': 'lookup'
    }).formatResult();

    // reset new lookup identifier on column
    $('.lookup_result').removeClass().addClass('lookup_result list');
    $('.lookup_result').addClass(lookup_identifier);
  });

  /*
   * Classes & Methods
   */
  var iTunesSearchAPI = function() {
    this.name = 'iTunesSearchAPI';
    this.settings = {};
    this.results = {};
    this.errors = {};
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

      switch (self.settings.resultType) {
        case 'search':
          var element = $('#left');
          break;
        case 'lookup':
          var element = $('#right');
          break;
      }

      window.resultCall = $.ajax({
        type: config.type,
        url: config.url,
        timeout: config.timeout,
        dataType: config.dataType,
        data: config.data,
        beforeSend: function(xhr) {
          var dom_ajax_loader = element.find('.loader > img');

          // create and place new offscreen image
          var ajax_loader = new Image();
          ajax_loader.src = dom_ajax_loader.attr('src');

          dom_ajax_loader.css({
            left: ((element.width() - ajax_loader.width) / 2),
            top: ((element.height() - ajax_loader.height) / 2)
          });

          element.find('.loader').css({
            top: -(element.find('.list').position().top)
          });

          // freeze column loader
          element.css({
            overflow: 'hidden'
          });

          // display loader
          element.find('.loader').fadeIn(100);
        },
      }).done(function(json) {
        // setting results
        self.results = json.results;
      }).fail(function(jqXHR, textStatus) {
        // setting errors
        self.errors = {
          'type': 'call_failed',
          'status': textStatus
        };
      }).always(function() {
        // hide loader
        $('.loader').hide();

        // unfreeze column scroll
        element.css({
          overflow: 'auto'
        });
      });
    }

    return self;
  };

  iTunesSearchAPI.prototype.formatResult = function() {
    var self = this;

    // wait for call to finish and for self.results to be populated
    $.when(window.resultCall).done(function() {
      console.log('done: %O', self);

      switch (self.settings.resultType) {
        case 'search':
          $('.search_result > .entry').remove();

          $.each(self.results, function(key, result) {

            var entry = $('<div></div>');
            entry.addClass('entry');
            entry.addClass('element_'+key);
            entry.addClass(result.wrapperType);

            // artist name
            var artistName = $('<div></div>').addClass('artist');
            var artistNameAnchor = $('<a href="#"></a>');
            artistNameAnchor.addClass('anchor');
            artistNameAnchor.attr('data-id', result.artistId);
            artistNameAnchor.attr('data-entity', 'album');
            artistNameAnchor.text(result.artistName);
            artistName.append(artistNameAnchor);

            // collection name
            var collectionName = $('<div></div>').addClass('collection');
            var collectionNameAnchor = $('<a href="#"></a>');
            collectionNameAnchor.addClass('anchor');
            collectionNameAnchor.attr('data-id', result.collectionId);
            collectionNameAnchor.attr('data-entity', 'song');
            collectionNameAnchor.text(result.collectionName);
            collectionName.append(collectionNameAnchor);

            // track name
            var trackName = $('<div></div>').addClass('track');
            var trackNameAnchor = $('<a href="#"></a>');
            trackNameAnchor.addClass('anchor');
            trackNameAnchor.attr('data-id', result.trackId);
            trackNameAnchor.attr('data-entity', '');
            trackNameAnchor.text(result.trackName);
            trackName.append(trackNameAnchor);

            // track number
            var trackNumber = $('<div></div>').addClass('track-number');
            var trackNumberSpan = $('<span></span>');
            trackNumberSpan.text(result.trackNumber);
            if (result.trackNumber && result.trackCount) {
              trackNumberSpan.append(document.createTextNode(' out of '));
            }
            trackNumberSpan.append(document.createTextNode(result.trackCount));
            trackNumber.append(trackNumberSpan);

            entry.append(artistName, collectionName, trackName, trackNumber);
            $('.search_result').append(entry);

          });
          break;
        case 'lookup':
          $('.lookup_result').empty();

          $.each(self.results, function(key, result) {

            var entry = $('<div></div>');
            entry.addClass('entry');
            entry.addClass('element_'+key);
            entry.addClass(result.wrapperType);

            // artwork
            if (result.artworkUrl100) {
              var artworkContainer = $('<div></div>').addClass('artwork');
              var artworkImg = new Image();
              // var artworkImg = document.createElement('img');
              var artworkUrl100 = result.artworkUrl100;
              var artworkUrl350 = artworkUrl100.replace(/\.[0-9]{3}x[0-9]{3}\-[0-9]{2,3}\.jpg$/i, '.350x350.jpg');
              artworkImg.src = artworkUrl350;
              artworkImg.crossOrigin = 'Anonymous';
              artworkImg.onload = function() {
                $(this).addClass('artwork-img');

                var colorThief = new ColorThief();
                var artworkColor = colorThief.getColor(artworkImg);

                artworkContainer.css({
                  'border' : '4px solid rgb('+artworkColor[0]+','+artworkColor[1]+','+artworkColor[2]+')'
                })
              };
              artworkContainer.append(artworkImg);
            }

            // artist name
            if (result.artistName) {
              var artistName = $('<div></div>').addClass('artist');
              artistName.text(result.artistName);
            }

            // collection name
            if (result.collectionName) {
              var collectionName = $('<div></div>').addClass('collection');
              collectionName.text(result.collectionName);
            }

            // track name
            if (result.trackName) {
              var trackName = $('<div></div>').addClass('track');;
              trackName.text(result.trackName);
            }

            // track number
            if (result.trackNumber) {
              var trackNumber = $('<div></div>').addClass('track-number');
              var trackNumberSpan = $('<span></span>');
              trackNumberSpan.text(result.trackNumber);
              if (result.trackCount)
                trackNumberSpan.append(document.createTextNode(' out of '+result.trackCount));
              trackNumber.append(trackNumberSpan);
            }

            entry.append(artworkContainer, artistName, collectionName, trackNumber, trackName);
            $('.lookup_result').append(entry);
          });
          break;
      }
    });

    $.when(window.resultCall).fail(function() {
      console.log('fail: %O', self);
    });
  };

});
