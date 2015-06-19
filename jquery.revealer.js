/*!
 * Revealer 0.1.1
 *
 * Copyright 2015, Pixel Union - http://pixelunion.net
 * Released under the MIT license
 */
(function($){
  // Simple requestAnimationFrame polyfill
  var raf = window.requestAnimationFrame ||
    window.mozRequestAnimationFrame ||
    window.webkitRequestAnimationFrame ||
    function(fn) { window.setTimeout(fn, 1000/60); }


  // Public API
  var methods = {
    isOpen: function(el) {
      return !!el.data("revealer-open");
    },

    show: function(el) {
      // Check state
      if (methods.isOpen(el)) {
        el.removeClass("revealer-animating revealer-animating-in");
        el.off("revealer-animating revealer-show");
        return;
      }

      // Remove previous event listeners
      el.data("revealer-open", true);
      el.off("trend");

      raf(function(){
        // Start animation state transition
        el.addClass("revealer-animating revealer-animating-in");
        el.trigger("revealer-animating");

        raf(function(){
          el.addClass("revealer-visible");

          el.one("trend", function(){
            el.removeClass("revealer-animating revealer-animating-in");
            el.trigger("revealer-show");
          });
        });
      });
    },

    hide: function(el) {
      // Check state
      if (!methods.isOpen(el)) {
        el.removeClass("revealer-animating revealer-animating-out revealer-visible");
        el.off("revealer-animating revealer-hide");
        return;
      }

      // Remove previous event listeners
      el.data("revealer-open", false);
      el.off("trend");

      raf(function(){
        el.addClass("revealer-animating revealer-animating-out");
        el.trigger("revealer-animating");

        raf(function(){
          el.removeClass("revealer-visible");

          el.one("trend", function(){
            el.removeClass("revealer-animating revealer-animating-in revealer-animating-out");
            el.trigger("revealer-hide");
          });
        });
      });
    },

    toggle: function(el) {
      if (methods.isOpen(el)) {
        methods.hide(el)
      } else {
        methods.show(el);
      }
    }
  };

  // jQuery plugin
  $.fn.revealer = function(method) {

    // Get action
    var action = methods[method || "toggle"];
    if (!action) return this;

    // Run action
    if (method === "isOpen") {
      return action(this);
    }

    return this.each(function(){
      action($(this));
    });
  };
})(jQuery);
