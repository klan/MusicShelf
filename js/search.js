jQuery(function($) {

  var query = null;
  var search_url = null;
  var parameters = null;
  var identifier = null;
  var entities = null;
  var attributes = null;
  var search_data = null;
  var search = null;

  /*
   * Search
   */
  $('.search_form').submit(function(event) {
    event.preventDefault();

    query = $(".search").val();
    search_url = 'https://itunes.apple.com/search';
    parameters = $('input[name=parameters]:checked');
    identifier = parameters.attr('id');
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

      // reset new identifier on table
      $('.search_result').removeClass().addClass('search_result');
      $('.search_result').addClass(identifier);
    }

    $('input[name=parameters]').change(function() {
      // reset vars
      parameters = $('input[name=parameters]:checked');
      identifier = parameters.attr('id');
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

      // reset new identifier on table
      $('.search_result').removeClass().addClass('search_result');
      $('.search_result').addClass(identifier);
    });
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

      window.resultCall = $.ajax({
        type: config.type,
        url: config.url,
        timeout: config.timeout,
        dataType: config.dataType,
        data: config.data,
        beforeSend: function(xhr) {
          // get loading icon
          var dom_ajax_loader = $('.loader_icon');

          // create new offscreen image
          var ajax_loader = new Image();
          ajax_loader.src = dom_ajax_loader.attr('src');

          // place loader icon screen center
          dom_ajax_loader.css({
            left: (($('#left').width() - ajax_loader.width) / 2),
            top: (($('#left').height() - ajax_loader.height) / 2)
          });

          // display icon
          $('#loader').fadeIn(100);
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
        // hide loader icon
        $('#loader').hide();
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
          $('.search_result').empty();

          $.each(self.results, function(key, result) {

            var entry = $('<div></div>');
            entry.addClass('entry');
            entry.addClass('element_'+key);
            entry.addClass(result.wrapperType);

            // artist name
            var artistName = $('<div></div>').addClass('artist-name');
            var artistNameAnchor = $('<a></a>');
            artistNameAnchor.attr('href', 'https://itunes.apple.com/lookup?id='+result.artistId+'&entity=album');
            artistNameAnchor.text(result.artistName);
            artistName.append(artistNameAnchor);

            // collection name
            var collectionName = $('<div></div>').addClass('collection-name');
            var collectionNameAnchor = $('<a></a>');
            collectionNameAnchor.attr('href', result.collectionViewUrl);
            collectionNameAnchor.text(result.collectionName);
            collectionName.append(collectionNameAnchor);

            // track name
            var trackName = $('<div></div>').addClass('track-name');
            var trackNameSpan = $('<span></span>');
            trackNameSpan.text(result.trackName);
            trackName.append(trackNameSpan);

            // track number
            var trackNumber = $('<div></div>').addClass('track-number');
            var trackNumberSpan = $('<span></span>');
            trackNumberSpan.text(result.trackNumber+' out of '+result.trackCount);
            trackNumber.append(trackNumberSpan);

            entry.append(artistName, collectionName, trackName, trackNumber);
            $('.search_result').append(entry);

          });
          break;
        case 'lookup':
          // close overlays (in case any is open), build album list, open new overlay
          $.each(self.results, function(key, result) {
            var entry = $('<div></div>');
            entry.addClass('entry');
            entry.addClass('element_'+key);
            entry.addClass(result.wrapperType);

            var something = $('<div></div>').addClass('something');

            entry.append(something);
            $('.search_result').append(entry);
          });
          break;
      }
    });

    $.when(window.resultCall).fail(function() {
      console.log('fail: %O', self);
    });
  };

});
