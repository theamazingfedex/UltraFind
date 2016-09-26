/**
 * Created with JetBrains RubyMine.
 * User: Daniel
 * Date: 10/31/13
 * Time: 7:54 AM
 * To change this template use File | Settings | File Templates.
 */
// finderCounter keeps track of what state the application is in.
var finderCounter = 0;
var colorPicker = '<input id="finderColorPicker" type="color" class="finderColorWheels" value="#F00" style="width:25px"/>';
var finderWindow =
  '<div id="hiddenFinderContainer">'+
  '<div id="hiddenFinderWindow">'+
  '<h2>Find Stuff</h2>'+
  '<span>'+
  '<input id="finderInput" type="text" name="term"/>' +colorPicker+
  '</span>'+
  '<div id="finderSearchButton">Search</div>'+
  '<div id="finderResetButton">Reset</div>'+
  '</div></div>';


// Getting everything ready
$(document).ready(function(){
  WordFinder.getReady();

  $(document).on('click', '#finderSearchButton', function(){
    WordFinder.initiateSearch();
  });
  $(document).on('click', '#finderResetButton', function(){
    WordFinder.clearHighlightedWords();
  });
  $(document).keydown(function (e){
    if (e.which === 13){
      WordFinder.initiateSearch();
      WordFinder.getReady();
    }
  });
});


//  WordFinder is the encapsulator for the main functions of my extension
var WordFinder = {

  //  getReady is the method which controls the opening and closing of the extension
  //      using a counter and incrementing/decrementing it, I can toggle between states of being
  //      shut down, standby, or active.
  getReady: function(){
    $(window).keydown(function (e){
      if (e.ctrlKey && e.which === 70){
        e.preventDefault();
        if (finderCounter === 2){
          WordFinder.clearHighlightedWords();
          WordFinder.hideFinder();
          finderCounter--;
        } else if (finderCounter === 1){
          WordFinder.showFinder();
          $('#finderInput').focus();
          finderCounter++;
        } else {
          WordFinder. launchFinder();
          $('#finderInput').focus();
          finderCounter = 2;
        }
      }
      if (e.which === 27){
        e.preventDefault();
        WordFinder.clearHighlightedWords();
        WordFinder.hideFinder();
      }

    });
  },

  //  launchFinder is called when the user initially presses the launch sequence for the extension, Ctrl+F
  //      it prepends the div of the search window to the body of the document, then proceeds to
  //      style the elements of the view.
  launchFinder: function(){
    $('body').prepend(finderWindow);
    //$('#hiddenFinderWindow').css('z-index', '999');
    //$('#hiddenFinderWindow').css('background-color', '#888');
    //$('#hiddenFinderWindow').css('float', 'right');
    //$('#hiddenFinderWindow').css('width', '20%');
    //$('#hiddenFinderWindow').css('padding', '10px');
    //$('#hiddenFinderWindow').css('font', '10px');
    //$('#hiddenFinderWindow').css('position', 'fixed');
    //$('#hiddenFinderWindow').css('border-bottom-left-radius', '15px');
    //$('#hiddenFinderWindow').position({
      //my: "right top",
      //at: "right top",
      //of: "body"
    //});
    $('#hiddenFinderWindow').draggable();

    //$('#finderSearchButton').css('background-color', '#CCC');
    //$('#finderSearchButton').css('border-radius', '5px');
    //$('#finderSearchButton').css('font-style', 'bold');
    //$('#finderSearchButton').css('width', '75px');
    //$('#finderSearchButton').css('padding', '3px');
    //$('#finderSearchButton').css('margin', 'auto');
    //$('#finderSearchButton').css('margin-bottom', '3px');

    //$('#finderResetButton').css('background-color', '#CCC222');
    //$('#finderResetButton').css('border-radius', '5px');
    //$('#finderResetButton').css('font-style', 'bold');
    //$('#finderResetButton').css('width', '75px');
    //$('#finderResetButton').css('padding', '3px');
    //$('#finderResetButton').css('margin', 'auto');

    $('.finderColorWheels').spectrum({
      color: "#F00",
      clickoutFiresChange: true,
      change: function(color){
        $('#finderColorPicker').val(color.toHexString());
      }
    });
  },

  //  hideFinder is called after the extension has been launched and the user wants to close it.
  //      it simply takes the selector of the view and calls .hide().
  hideFinder: function(){
    $('#hiddenFinderWindow').hide();
  },

  //  showFinder is called when the extension has already been launched on the page once then closed,
  //      and the user is opening it again. Rather than re-creating it each time it is opened or closed,
  //      this method keeps the view cached on the page for less load-time.
  showFinder: function(){
    $('#hiddenFinderWindow').show();

    $('.finderColorWheels').spectrum({
      color: "#F00",
      clickoutFiresChange: true,
      change: function(color){
        $('#finderColorPicker').val(color.toHexString());
      }
    });
  },

  //  tryLight is called after a search has been initiated.
  //      it takes the word and tells .wrapInTag() to wrap each iteration of the search term with the
  //      appropriate tag to enable highlighting of the term.
  tryLight: function(term, color){

    $('p').wrapInTag({
      words: [term],
      tag: '<span class="finderMarks'+ term +' finderMarks">'
    });

    $('.finderMarks'+ term +'').css('background-color', color);
  },

  //  clearHighlightedWords is called when the user presses the 'Esc' key or clicks the 'Reset' button.
  //      it simply uses the class selector for all my highlighted elements,
  //      and resets the background-color of each highlighted element.
  clearHighlightedWords: function(){
    $('.finderMarks').css('background-color', "");
  },

  //  initiateSearch is called when the 'Search' button is clicked or 'Enter' key is pressed.
  //      it will get the search term as 'input' and the selected color as 'color'.
  //      it will then call WordFinder.tryLight() which highlights the term the specified color.
  initiateSearch: function(){
    var input = $('#finderInput').val();
    var pickedColor =  $('#finderColorPicker').val();
    var color = pickedColor == '#000000' ? '#FF0000' : pickedColor;
    if (input.length > 0)
      WordFinder.tryLight(input, color);
    else
      $('#finderInput').effect('highlight', {color:''+color+''}, 500);

  }
};

function randomColor() {
  var color;
  color = Math.floor(Math.random() * 0x1000000); // integer between 0x0 and 0xFFFFFF
  color = color.toString(16); // convert to hex
  color = ("000000" + color).slice(-6); // pad with leading zeros
  color = "#" + color; // prepend #
  return color;
}

function invertColor(hexTripletColor) {
  var color = hexTripletColor;
  color = color.substring(1); // remove #
  color = parseInt(color, 16); // convert to integer
  color = 0xFFFFFF ^ color; // invert three bytes
  color = color.toString(16); // convert to hex
  color = ("000000" + color).slice(-6); // pad with leading zeros
  color = '#' + color; // prepend #
  return color;
}

//  wrapInTag is implemented here as a jQuery function to enable use with the jQuery selector.
//      it is called by the WordFinder.tryLight() method and reads through the current page's
//      HTML and wraps each iteration of the search term in a <span> tag with unique identifiers.
$.fn.wrapInTag = function(opts) {

  // default values to be reassigned using opts
  var o = $.extend({
    words: [],
    tag: '<strong>'
  }, opts);

  return this.each(function() {
    var html = $(this).html();
    for (var i = 0, len = o.words.length; i < len; i++) {
      var re = new RegExp('\\b' + o.words[i], "gi");
      html = html.replace(re, o.tag + '$&' + o.tag.replace('<', '</'));
    }
    $(this).html(html);
  });
}
chrome.commands.onCommand.addListener(function(command) {
  console.log('onCommand event received for message: ', command);
});;
