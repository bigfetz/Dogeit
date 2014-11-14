/*!
  jQuery dogeIt plugin
  @name dogeit.js
  @author Matthew Fetzer matthewfetz@gamil.com  @bigfetz
  @version 1.0
  @date 11/13/2014
  @category jQuery Plugin
  @license Licensed under the MIT (http://www.opensource.org/licenses/mit-license.php) license.
*/

(function($){
 
  var dogeIt, defaultOptions, __bind;
 
  __bind = function(fn, me) {
    return function() {
      return fn.apply(me, arguments);
    };
  };

 
  // Plugin default options.
  defaultOptions = {
    textVals: ['WOW!!!', 'Such Website!!', 'Much responsive', 'So Fancy!', 'How amazing', 'Very impressive']
  };
 
  dogeIt = (function(options) {
 
    function dogeIt(handler, options) {
      this.handler = handler;
      if (options.textValues == null) {
        this.textValues = defaultOptions.textVals;
      }else{
        this.textValues = options.textValues;
      }

      
      // plugin variables.
      this.resizeTimer = null;
 
      // Extend default options.
      $.extend(true, this, defaultOptions, options);
 
      // Bind methods.
      this.update = __bind(this.update, this);
      this.onResize = __bind(this.onResize, this);
      this.init = __bind(this.init, this);
      this.clear = __bind(this.clear, this);
      this.muchShow = __bind(this.muchShow, this);
 
      // Listen to resize event if requested.
      if (this.autoResize) {
        $(window).bind('resize.dogeIt', this.onResize);
      };
    };


    // Method for updating the plugins options.
    dogeIt.prototype.update = function(options) {
      $.extend(true, this, options);
    };
 
    // This timer ensures that layout is not continuously called as window is being dragged.
    dogeIt.prototype.onResize = function() {
      clearTimeout(this.resizeTimer);
      this.resizeTimer = setTimeout(this.resizeFunc, this.resizeDelay);
    };

    function checkCollision(handler,top,left, width, height){
      var that = handler;
      var doesColide = false;
      var visibleElements = $(that).find('.text:visible')

      var aLeft = left;
      var aRight = left + width;
      var aTop = top;
      var aBottom = top + height;

      $(visibleElements).each(function(index, element){
        var bLeft = $(element).position().left;
        var bRight = $(element).position().left + $(element).width();
        var bTop = $(element).position().top;
        var bBottom = $(element).position().top + $(element).height();
        if (!(aRight < bLeft || aLeft > bRight || aBottom < bTop || aTop > bBottom )){
          doesColide = true;
          return false;
        }
      });

      return doesColide;
    }

    function setRandomLocation(handler, id){
      var that = handler;
      var temp = $($(that.handler).find(id));
      while(true)
        {
          var top = Math.floor(Math.random()*($(document).height() - temp.height()));
          var left = Math.floor(Math.random()*($(document).width() - temp.width()));
          if(!$(that.handler).find('.text:visible') || !checkCollision(that.handler,top, left, temp.width(), temp.height())) 
          {
            temp.css({'top': top, 'left': left });
            break;
          }
        }
    }

    dogeIt.prototype.muchShow = function() {
      var that = this;
      $(that.handler).find("#doge-face").fadeIn();
      for (var i = 1; i < 4; i++) {
        setRandomLocation(that,"#area" +i);
        $($(that.handler).find(".text:hidden")[i]).fadeIn()
      };

      window.setInterval(function(){
          var randHiddenElement = $($(that.handler).find(".text:hidden")[Math.floor(Math.random()*3)]);
          var randVisElement = $($(that.handler).find(".text:visible")[Math.floor(Math.random()*3)]);
          setRandomLocation(that, "#"+randHiddenElement.attr('id'))
          randHiddenElement.fadeIn();
          randVisElement.fadeOut();
      }, 3000);
    };

 
    // Main method.
    dogeIt.prototype.init = function() {
        this.handler.prepend('<img src="dogeface.png" id="doge-face" class="doge">')
        $('#doge-face').css("left",this.handler.width()/2 - 250);
        for (var i = 0; i < 6; i++) {
          var text = this.textValues[i].toUpperCase()
          if (text.length > 10) {
            text = text.split(" ").join("</br>")
          }
          this.handler.prepend('<div class="doge text" id="area' +  (i+1) + '">' + text +'</div>')
        };

        $('.doge').hide();
    };
 
    // Clear event listeners and time outs.
    dogeIt.prototype.clear = function() {
      clearTimeout(this.resizeTimer);
      $(window).unbind('resize.dogeIt', this.onResize);
    };
 
    return dogeIt;
  })();
 
  $.fn.dogeIt = function(options) {
    // Create a dogeIt instance if not available.
    if (!this.myPluginInstance) {
      this.dogeItInstance = new dogeIt(this, options || {});
    } else {
      this.myPluginInstance.update(options || {});
    }
 
    // Init plugin.
    this.dogeItInstance.init();
 
    // Display items (if hidden) and return jQuery object to maintain chainability.
    return this.dogeItInstance;
  };
})(jQuery);
