var mediumText = {
  'config' : {
    'text_container' : $('#text_editor'),
    'statistics' : $('#statistic')
  },
  'init' :  function(config) {
    if (config && typeof(config) == 'object') {
          $.extend(myFeature.config, config);
      }

      // create and/or cache some DOM elements
      // we'll want to use throughout the code
      mediumText.$container = mediumText.config.text_container;
      mediumText.$stats = mediumText.config.statistics;
     
      //initialize statistics
      mediumText.changeStats(mediumText.$container);

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
    var full_text = $text_container.text();
    var statistics = {}

  },

  'setStats' : function($stat_container, numbers) {
  }
}

$(document).ready(mediumText.init);
