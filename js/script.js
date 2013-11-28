var mediumText = {
  //initialize frequently used containers
  'config' : {
    'text_container' : $('#text_editor'),
    'statistics' : $('#statistic')
  },

  //init function
  'init' :  function(config) {
    if (config && typeof(config) == 'object') {
          $.extend(myFeature.config, config);
      }

      // create and/or cache some DOM elements
      // we'll want to use throughout the code
      mediumText.$container = mediumText.config.text_container;
      mediumText.$stats = mediumText.config.statistics;
     
      //initialize statistics
      var stat_dict = mediumText.changeStats(mediumText.$container);

      // not useful, but just for testing
      mediumText.initialized = true;
  },

  //event listener for typing
  'changeStats' : function($text_container) {
    // set event listener for changing div
    $text_container.bind("DOMSubtreeModified", function(){
      mediumText.getStats($text_container);
    });
  },

  //calculating statistics
  'getStats' : function($text_container) {
    // get html so you can count paragraph breaks
    var full_text_html = $text_container.html();
    var paragraphs = {'paragraphs' : mediumText.getParagraphCount(full_text_html)};
   
    // get regular text to get full unigram
    var full_text = $text_container.text();
    var sentence_stats = mediumText.getSentenceStatistics(full_text); 
   
    var statistics = $.extend({}, sentence_stats, paragraphs);
    mediumText.setStats(mediumText.$stats, statistics);
  },

  // sometimes off by one on paragraph count
  'getParagraphCount' : function(html_text) {
    return html_text.split("<br>").length;
  },

  //get word count, sentence, bigram
  // TO DO : off by one on sentence
  'getSentenceStatistics' : function(full_text) {
    var sen_stats = {};
    var bigrams = {};
    var sentence_count = 0;

    var words_list = full_text.split(" ");
    sen_stats['words'] = words_list.length;
    for (var i = 0; i < words_list.length; i++) {
      var w = words_list[i];
      if (w.slice(-1) === ".") {
        sentence_count++;
      }
      if (i !== words_list.length - 1) {
        //doesn't string string of punctuation - feature or bug? idk.
        var bigram = words_list[i].toLowerCase() + " " + words_list[i+1].toLowerCase();
        if (bigram in bigrams) {
          bigrams[bigram]++;
        } else {
          bigrams[bigram] = 1;
        }
      }
    }
    sen_stats['bigrams'] = bigrams;
    sen_stats['sentences'] = sentence_count;
    return sen_stats;
  },

  'setStats' : function($stat_container, numbers) {
    $stat_container.find('#paragraph').children('#p_number').text(numbers['paragraphs']);
    $stat_container.find('#sentence').children('#s_number').text(numbers['sentences']);
    $stat_container.find('#word').children('#w_number').text(numbers['words']);
    // TO DO : set bigrams and sort in order before finishing (create ordered list for them)
  }
}

$(document).ready(mediumText.init);
