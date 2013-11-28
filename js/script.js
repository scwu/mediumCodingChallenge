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
  // TO DO : proper nouns -> verbs associated with them
  // Visualization of Distribution of words by length -> pie or bar chart
  'getSentenceStatistics' : function(full_text) {
    var sen_stats = {};
    var bigrams = {};
    var proper_nouns = {};
    var w_distr = {}
    var sentence_count = 0;

    // get text split on spaces (also tokenizing words)
    var words_list = full_text.split(" ");
    // get and assign word count
    sen_stats['words'] = words_list.length;

    var j = 0;
    console.log(words_list);
    for (var i = 0; i < words_list.length; i++) {

      //get last character of word and check if it's a period.
      if ($.trim(words_list[i]).slice(-1) === ".") {
        sentence_count++;
      }

      var w = mediumText.cleanString(words_list[i]);
      
      //get word length distribution
      if (w.length.toString() in w_distr) {
        w_distr[w.length.toString()]++;
      } else {
        w_distr[w.length.toString()] = 1;
      }

      
      // check if previous word even exists
      if (j > 0) {

        var full_proper = "";
        var cleaned = mediumText.cleanString(words_list[j]);
       
        //get full proper noun - like (Mount Everest)
        while (mediumText.isProperNoun(cleaned)) {
          //check to make sure j+1 is valid index
          if (j+1 <= words_list.length) {
            full_proper += " " + cleaned;
            cleaned = mediumText.cleanString(words_list[++j]);
          } else {
            break;
          }
        }
        
        //check for previous word to make sure isn't beginning of sentence
        if ((words_list[i-1].slice(-1) !== "." || full_proper in proper_nouns
            ) && full_proper !== "")  { //or if it already exist in the dictionary
          
          full_proper = $.trim(full_proper);

          //add to proper noun associative array
          if (full_proper in proper_nouns) {
            proper_nouns[full_proper]++;
          } else {
            proper_nouns[full_proper] = 1;
          }
        }
      }
      j++;

      // check if next word even exists
      if (i !== words_list.length - 1) {
        var w_next = mediumText.cleanString(words_list[i + 1]);
        var bigram = w.toLowerCase() + " " + w_next.toLowerCase();
        //maintain bigram associative array
        if (bigram in bigrams) {
          bigrams[bigram]++;
        } else {
          bigrams[bigram] = 1;
        }
      }

    }
    sen_stats['bigrams'] = mediumText.sortDictionary(bigrams);
    sen_stats['sentences'] = sentence_count;
    sen_stats['proper'] = mediumText.sortDictionary(proper_nouns);
    sen_stats['distribution'] = mediumText.sortDictionary(w_distr);
    return sen_stats;
  },

  'sortDictionary' :  function(dictionary) {
    var arr = []
    for (var key in dictionary) {
      if (dictionary.hasOwnProperty(key)) {
        arr.push({'name': key, 'value' : dictionary[key]});
      }
    }

    var sorted = arr.sort(function(a,b) {
      return b.value - a.value;
    });
    return sorted;
  },
  
  //returns string with no punctuation & trimmed
  'cleanString' : function(word) {
      //eliminate punctuation
      var no_punct = $.trim(word).replace(/[\.,-\/#!$%\^&\*;:{}=\-_`~()]/g,""); //remove punctuation
      var no_spaces = no_punct.replace(/\s{2,}/g," ");
      return no_spaces
  },

  'isProperNoun' : function(noun) { 
      if (noun.slice(0,1) !== noun.slice(0,1).toLowerCase() //make sure uppercase (not number either)
          && noun.length > 1) { //make sure not not 'I' or number 
            return true;
      }
  },

  'setStats' : function($stat_container, numbers) {
    $stat_container.find('#paragraph').children('#p_number').text(numbers['paragraphs']);
    $stat_container.find('#sentence').children('#s_number').text(numbers['sentences']);
    $stat_container.find('#word').children('#w_number').text(numbers['words']);
    // TO DO : set bigrams and sort in order before finishing (create ordered list for them)
  }
}

$(document).ready(mediumText.init);
