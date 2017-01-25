(function (root, doc, factory) {
  if (typeof define === "function" && define.amd) {
    define(["jquery"], function ($) {
      factory($, root, doc);
      return $.mobile;
    });
  } else {
    factory(root.jQuery, root, doc);
  }
}(this, document, function (jQuery, window, document, undefined) {
  (function ($) {
    $.event.special.throttledresize = {
      setup: function () {
        $(this).bind("resize", handler);
      },
      teardown: function () {
        $(this).unbind("resize", handler);
      }
    };
    var throttle = 250,
      handler = function () {
        curr = (new Date()).getTime();
        diff = curr - lastCall;
        if (diff >= throttle) {
          lastCall = curr;
          $(this).trigger("throttledresize");
        } else {
          if (heldCall) {
            clearTimeout(heldCall);
          }
          heldCall = setTimeout(handler, throttle - diff);
        }
      },
      lastCall = 0,
      heldCall, curr, diff;
  })(jQuery);
  (function ($, window, undefined) {
    var nsNormalizeDict = {};
    $.mobile = $.extend({}, {
      version: "1.2.0",
      ns: "",
      subPageUrlKey: "ui-page",
      activePageClass: "ui-page-active",
      activeBtnClass: "ui-btn-active",
      focusClass: "ui-focus",
      ajaxEnabled: true,
      hashListeningEnabled: true,
      linkBindingEnabled: true,
      defaultPageTransition: "fade",
      maxTransitionWidth: false,
      minScrollBack: 250,
      touchOverflowEnabled: false,
      defaultDialogTransition: "pop",
      pageLoadErrorMessage: "Error Loading Page",
      pageLoadErrorMessageTheme: "e",
      phonegapNavigationEnabled: false,
      autoInitializePage: true,
      pushStateEnabled: true,
      ignoreContentEnabled: false,
      orientationChangeEnabled: true,
      buttonMarkup: {
        hoverDelay: 200
      },
      keyCode: {
        ALT: 18,
        BACKSPACE: 8,
        CAPS_LOCK: 20,
        COMMA: 188,
        COMMAND: 91,
        COMMAND_LEFT: 91,
        COMMAND_RIGHT: 93,
        CONTROL: 17,
        DELETE: 46,
        DOWN: 40,
        END: 35,
        ENTER: 13,
        ESCAPE: 27,
        HOME: 36,
        INSERT: 45,
        LEFT: 37,
        MENU: 93,
        NUMPAD_ADD: 107,
        NUMPAD_DECIMAL: 110,
        NUMPAD_DIVIDE: 111,
        NUMPAD_ENTER: 108,
        NUMPAD_MULTIPLY: 106,
        NUMPAD_SUBTRACT: 109,
        PAGE_DOWN: 34,
        PAGE_UP: 33,
        PERIOD: 190,
        RIGHT: 39,
        SHIFT: 16,
        SPACE: 32,
        TAB: 9,
        UP: 38,
        WINDOWS: 91
      },
      silentScroll: function (ypos) {
        if ($.type(ypos) !== "number") {
          ypos = $.mobile.defaultHomeScroll;
        }
        $.event.special.scrollstart.enabled = false;
        setTimeout(function () {
          window.scrollTo(0, ypos);
          $(document).trigger("silentscroll", {
            x: 0,
            y: ypos
          });
        }, 20);
        setTimeout(function () {
          $.event.special.scrollstart.enabled = true;
        }, 150);
      },
      nsNormalizeDict: nsNormalizeDict,
      nsNormalize: function (prop) {
        if (!prop) {
          return;
        }
        return nsNormalizeDict[prop] || (nsNormalizeDict[prop] = $.camelCase($.mobile.ns + prop));
      },
      getInheritedTheme: function (el, defaultTheme) {
        var e = el[0],
          ltr = "",
          re = /ui-(bar|body|overlay)-([a-z])\b/,
          c, m;
        while (e) {
          c = e.className || "";
          if (c && (m = re.exec(c)) && (ltr = m[2])) {
            break;
          }
          e = e.parentNode;
        }
        return ltr || defaultTheme || "a";
      },
      closestPageData: function ($target) {
        return $target.closest(':jqmData(role="page"), :jqmData(role="dialog")').data("page");
      },
      enhanceable: function ($set) {
        return this.haveParents($set, "enhance");
      },
      hijackable: function ($set) {
        return this.haveParents($set, "ajax");
      },
      haveParents: function ($set, attr) {
        if (!$.mobile.ignoreContentEnabled) {
          return $set;
        }
        var count = $set.length,
          $newSet = $(),
          e, $element, excluded;
        for (var i = 0; i < count; i++) {
          $element = $set.eq(i);
          excluded = false;
          e = $set[i];
          while (e) {
            var c = e.getAttribute ? e.getAttribute("data-" + $.mobile.ns + attr) : "";
            if (c === "false") {
              excluded = true;
              break;
            }
            e = e.parentNode;
          }
          if (!excluded) {
            $newSet = $newSet.add($element);
          }
        }
        return $newSet;
      },
      getScreenHeight: function () {
        return window.innerHeight || $(window).height();
      }
    }, $.mobile);
    $.fn.jqmData = function (prop, value) {
      var result;
      if (typeof prop !== "undefined") {
        if (prop) {
          prop = $.mobile.nsNormalize(prop);
        }
        if (arguments.length < 2 || value === undefined) {
          result = this.data(prop);
        } else {
          result = this.data(prop, value);
        }
      }
      return result;
    };
    $.jqmData = function (elem, prop, value) {
      var result;
      if (typeof prop !== "undefined") {
        result = $.data(elem, prop ? $.mobile.nsNormalize(prop) : prop, value);
      }
      return result;
    };
    $.fn.jqmRemoveData = function (prop) {
      return this.removeData($.mobile.nsNormalize(prop));
    };
    $.jqmRemoveData = function (elem, prop) {
      return $.removeData(elem, $.mobile.nsNormalize(prop));
    };
    $.fn.removeWithDependents = function () {
      $.removeWithDependents(this);
    };
    $.removeWithDependents = function (elem) {
      var $elem = $(elem);
      ($elem.jqmData('dependents') || $()).remove();
      $elem.remove();
    };
    $.fn.addDependents = function (newDependents) {
      $.addDependents($(this), newDependents);
    };
    $.addDependents = function (elem, newDependents) {
      var dependents = $(elem).jqmData('dependents') || $();
      $(elem).jqmData('dependents', $.merge(dependents, newDependents));
    };
    $.fn.getEncodedText = function () {
      return $("<div/>").text($(this).text()).html();
    };
    $.fn.jqmEnhanceable = function () {
      return $.mobile.enhanceable(this);
    };
    $.fn.jqmHijackable = function () {
      return $.mobile.hijackable(this);
    };
    var oldFind = $.find,
      jqmDataRE = /:jqmData\(([^)]*)\)/g;
    $.find = function (selector, context, ret, extra) {
      selector = selector.replace(jqmDataRE, "[data-" + ($.mobile.ns || "") + "$1]");
      return oldFind.call(this, selector, context, ret, extra);
    };
    $.extend($.find, oldFind);
    $.find.matches = function (expr, set) {
      return $.find(expr, null, null, set);
    };
    $.find.matchesSelector = function (node, expr) {
      return $.find(expr, null, null, [node]).length > 0;
    };
  })(jQuery, this);
  (function ($, undefined) {
    $.extend($.support, {
      orientation: "orientation" in window && "onorientationchange" in window
    });
  }(jQuery));
  (function ($, window) {
    var win = $(window),
      event_name = "orientationchange",
      special_event, get_orientation, last_orientation, initial_orientation_is_landscape, initial_orientation_is_default, portrait_map = {
        "0": true,
        "180": true
      };
    if ($.support.orientation) {
      var ww = window.innerWidth || $(window).width(),
        wh = window.innerHeight || $(window).height(),
        landscape_threshold = 50;
      initial_orientation_is_landscape = ww > wh && (ww - wh) > landscape_threshold;
      initial_orientation_is_default = portrait_map[window.orientation];
      if ((initial_orientation_is_landscape && initial_orientation_is_default) || (!initial_orientation_is_landscape && !initial_orientation_is_default)) {
        portrait_map = {
          "-90": true,
          "90": true
        };
      }
    }
    $.event.special.orientationchange = $.extend({}, $.event.special.orientationchange, {
      setup: function () {
        if ($.support.orientation && !$.event.special.orientationchange.disabled) {
          return false;
        }
        last_orientation = get_orientation();
        win.bind("throttledresize", handler);
      },
      teardown: function () {
        if ($.support.orientation && !$.event.special.orientationchange.disabled) {
          return false;
        }
        win.unbind("throttledresize", handler);
      },
      add: function (handleObj) {
        var old_handler = handleObj.handler;
        handleObj.handler = function (event) {
          event.orientation = get_orientation();
          return old_handler.apply(this, arguments);
        };
      }
    });

    function handler() {
      var orientation = get_orientation();
      if (orientation !== last_orientation) {
        last_orientation = orientation;
        win.trigger(event_name);
      }
    }
    $.event.special.orientationchange.orientation = get_orientation = function () {
      var isPortrait = true,
        elem = document.documentElement;
      if ($.support.orientation) {
        isPortrait = portrait_map[window.orientation];
      } else {
        isPortrait = elem && elem.clientWidth / elem.clientHeight < 1.1;
      }
      return isPortrait ? "portrait" : "landscape";
    };
    $.fn[event_name] = function (fn) {
      return fn ? this.bind(event_name, fn) : this.trigger(event_name);
    };
    if ($.attrFn) {
      $.attrFn[event_name] = true;
    }
  }(jQuery, this));
  (function ($, undefined) {
    var support = {
      touch: "ontouchend" in document
    };
    $.mobile = $.mobile || {};
    $.mobile.support = $.mobile.support || {};
    $.extend($.support, support);
    $.extend($.mobile.support, support);
  }(jQuery));
  (function ($, window, undefined) {
    var createHandler = function (sequential) {
      if (sequential === undefined) {
        sequential = true;
      }
      return function (name, reverse, $to, $from) {
        var deferred = new $.Deferred(),
          reverseClass = reverse ? " reverse" : "",
          active = $.mobile.urlHistory.getActive(),
          toScroll = active.lastScroll || $.mobile.defaultHomeScroll,
          screenHeight = $.mobile.getScreenHeight(),
          maxTransitionOverride = $.mobile.maxTransitionWidth !== false && $(window).width() > $.mobile.maxTransitionWidth,
          none = !$.support.cssTransitions || maxTransitionOverride || !name || name === "none" || Math.max($(window).scrollTop(), toScroll) > $.mobile.getMaxScrollForTransition(),
          toPreClass = " ui-page-pre-in",
          toggleViewportClass = function () {
            $.mobile.pageContainer.toggleClass("ui-mobile-viewport-transitioning viewport-" + name);
          },
          scrollPage = function () {
            $.event.special.scrollstart.enabled = false;
            window.scrollTo(0, toScroll);
            setTimeout(function () {
              $.event.special.scrollstart.enabled = true;
            }, 150);
          },
          cleanFrom = function () {
            $from.removeClass($.mobile.activePageClass + " out in reverse " + name).height("");
          },
          startOut = function () {
            if (!sequential) {
              doneOut();
            } else {
              $from.animationComplete(doneOut);
            }
            $from.height(screenHeight + $(window).scrollTop()).addClass(name + " out" + reverseClass);
          },
          doneOut = function () {
            if ($from && sequential) {
              cleanFrom();
            }
            startIn();
          },
          startIn = function () {
            $to.css("z-index", -10);
            $to.addClass($.mobile.activePageClass + toPreClass);
            $.mobile.focusPage($to);
            $to.height(screenHeight + toScroll);
            scrollPage();
            $to.css("z-index", "");
            if (!none) {
              $to.animationComplete(doneIn);
            }
            $to.removeClass(toPreClass).addClass(name + " in" + reverseClass);
            if (none) {
              doneIn();
            }
          },
          doneIn = function () {
            if (!sequential) {
              if ($from) {
                cleanFrom();
              }
            }
            $to.removeClass("out in reverse " + name).height("");
            toggleViewportClass();
            if ($(window).scrollTop() !== toScroll) {
              scrollPage();
            }
            deferred.resolve(name, reverse, $to, $from, true);
          };
        toggleViewportClass();
        if ($from && !none) {
          startOut();
        } else {
          doneOut();
        }
        return deferred.promise();
      };
    };
    var sequentialHandler = createHandler(),
      simultaneousHandler = createHandler(false),
      defaultGetMaxScrollForTransition = function () {
        return $.mobile.getScreenHeight() * 3;
      };
    $.mobile.defaultTransitionHandler = sequentialHandler;
    $.mobile.transitionHandlers = {
      "default": $.mobile.defaultTransitionHandler,
      "sequential": sequentialHandler,
      "simultaneous": simultaneousHandler
    };
    $.mobile.transitionFallbacks = {};
    $.mobile._maybeDegradeTransition = function (transition) {
      if (transition && !$.support.cssTransform3d && $.mobile.transitionFallbacks[transition]) {
        transition = $.mobile.transitionFallbacks[transition];
      }
      return transition;
    };
    $.mobile.getMaxScrollForTransition = $.mobile.getMaxScrollForTransition || defaultGetMaxScrollForTransition;
  })(jQuery, this);
  (function ($, window, document, undefined) {
    var dataPropertyName = "virtualMouseBindings",
      touchTargetPropertyName = "virtualTouchID",
      virtualEventNames = "vmouseover vmousedown vmousemove vmouseup vclick vmouseout vmousecancel".split(" "),
      touchEventProps = "clientX clientY pageX pageY screenX screenY".split(" "),
      mouseHookProps = $.event.mouseHooks ? $.event.mouseHooks.props : [],
      mouseEventProps = $.event.props.concat(mouseHookProps),
      activeDocHandlers = {},
      resetTimerID = 0,
      startX = 0,
      startY = 0,
      didScroll = false,
      clickBlockList = [],
      blockMouseTriggers = false,
      blockTouchTriggers = false,
      eventCaptureSupported = "addEventListener" in document,
      $document = $(document),
      nextTouchID = 1,
      lastTouchID = 0,
      threshold;
    $.vmouse = {
      moveDistanceThreshold: 10,
      clickDistanceThreshold: 10,
      resetTimerDuration: 1500
    };

    function getNativeEvent(event) {
      while (event && typeof event.originalEvent !== "undefined") {
        event = event.originalEvent;
      }
      return event;
    }

    function createVirtualEvent(event, eventType) {
      var t = event.type,
        oe, props, ne, prop, ct, touch, i, j, len;
      event = $.Event(event);
      event.type = eventType;
      oe = event.originalEvent;
      props = $.event.props;
      if (t.search(/^(mouse|click)/) > -1) {
        props = mouseEventProps;
      }
      if (oe) {
        for (i = props.length, prop; i;) {
          prop = props[--i];
          event[prop] = oe[prop];
        }
      }
      if (t.search(/mouse(down|up)|click/) > -1 && !event.which) {
        event.which = 1;
      }
      if (t.search(/^touch/) !== -1) {
        ne = getNativeEvent(oe);
        t = ne.touches;
        ct = ne.changedTouches;
        touch = (t && t.length) ? t[0] : ((ct && ct.length) ? ct[0] : undefined);
        if (touch) {
          for (j = 0, len = touchEventProps.length; j < len; j++) {
            prop = touchEventProps[j];
            event[prop] = touch[prop];
          }
        }
      }
      return event;
    }

    function getVirtualBindingFlags(element) {
      var flags = {},
        b, k;
      while (element) {
        b = $.data(element, dataPropertyName);
        for (k in b) {
          if (b[k]) {
            flags[k] = flags.hasVirtualBinding = true;
          }
        }
        element = element.parentNode;
      }
      return flags;
    }

    function getClosestElementWithVirtualBinding(element, eventType) {
      var b;
      while (element) {
        b = $.data(element, dataPropertyName);
        if (b && (!eventType || b[eventType])) {
          return element;
        }
        element = element.parentNode;
      }
      return null;
    }

    function enableTouchBindings() {
      blockTouchTriggers = false;
    }

    function disableTouchBindings() {
      blockTouchTriggers = true;
    }

    function enableMouseBindings() {
      lastTouchID = 0;
      clickBlockList.length = 0;
      blockMouseTriggers = false;
      disableTouchBindings();
    }

    function disableMouseBindings() {
      enableTouchBindings();
    }

    function startResetTimer() {
      clearResetTimer();
      resetTimerID = setTimeout(function () {
        resetTimerID = 0;
        enableMouseBindings();
      }, $.vmouse.resetTimerDuration);
    }

    function clearResetTimer() {
      if (resetTimerID) {
        clearTimeout(resetTimerID);
        resetTimerID = 0;
      }
    }

    function triggerVirtualEvent(eventType, event, flags) {
      var ve;
      if ((flags && flags[eventType]) || (!flags && getClosestElementWithVirtualBinding(event.target, eventType))) {
        ve = createVirtualEvent(event, eventType);
        $(event.target).trigger(ve);
      }
      return ve;
    }

    function mouseEventCallback(event) {
      var touchID = $.data(event.target, touchTargetPropertyName);
      if (!blockMouseTriggers && (!lastTouchID || lastTouchID !== touchID)) {
        var ve = triggerVirtualEvent("v" + event.type, event);
        if (ve) {
          if (ve.isDefaultPrevented()) {
            event.preventDefault();
          }
          if (ve.isPropagationStopped()) {
            event.stopPropagation();
          }
          if (ve.isImmediatePropagationStopped()) {
            event.stopImmediatePropagation();
          }
        }
      }
    }

    function handleTouchStart(event) {
      var touches = getNativeEvent(event).touches,
        target, flags;
      if (touches && touches.length === 1) {
        target = event.target;
        flags = getVirtualBindingFlags(target);
        if (flags.hasVirtualBinding) {
          lastTouchID = nextTouchID++;
          $.data(target, touchTargetPropertyName, lastTouchID);
          clearResetTimer();
          disableMouseBindings();
          didScroll = false;
          var t = getNativeEvent(event).touches[0];
          startX = t.pageX;
          startY = t.pageY;
          triggerVirtualEvent("vmouseover", event, flags);
          triggerVirtualEvent("vmousedown", event, flags);
        }
      }
    }

    function handleScroll(event) {
      if (blockTouchTriggers) {
        return;
      }
      if (!didScroll) {
        triggerVirtualEvent("vmousecancel", event, getVirtualBindingFlags(event.target));
      }
      didScroll = true;
      startResetTimer();
    }

    function handleTouchMove(event) {
      if (blockTouchTriggers) {
        return;
      }
      var t = getNativeEvent(event).touches[0],
        didCancel = didScroll,
        moveThreshold = $.vmouse.moveDistanceThreshold,
        flags = getVirtualBindingFlags(event.target);
      didScroll = didScroll || (Math.abs(t.pageX - startX) > moveThreshold || Math.abs(t.pageY - startY) > moveThreshold);
      if (didScroll && !didCancel) {
        triggerVirtualEvent("vmousecancel", event, flags);
      }
      triggerVirtualEvent("vmousemove", event, flags);
      startResetTimer();
    }

    function handleTouchEnd(event) {
      if (blockTouchTriggers) {
        return;
      }
      disableTouchBindings();
      var flags = getVirtualBindingFlags(event.target),
        t;
      triggerVirtualEvent("vmouseup", event, flags);
      if (!didScroll) {
        var ve = triggerVirtualEvent("vclick", event, flags);
        if (ve && ve.isDefaultPrevented()) {
          t = getNativeEvent(event).changedTouches[0];
          clickBlockList.push({
            touchID: lastTouchID,
            x: t.clientX,
            y: t.clientY
          });
          blockMouseTriggers = true;
        }
      }
      triggerVirtualEvent("vmouseout", event, flags);
      didScroll = false;
      startResetTimer();
    }

    function hasVirtualBindings(ele) {
      var bindings = $.data(ele, dataPropertyName),
        k;
      if (bindings) {
        for (k in bindings) {
          if (bindings[k]) {
            return true;
          }
        }
      }
      return false;
    }

    function dummyMouseHandler() {}

    function getSpecialEventObject(eventType) {
      var realType = eventType.substr(1);
      return {
        setup: function (data, namespace) {
          if (!hasVirtualBindings(this)) {
            $.data(this, dataPropertyName, {});
          }
          var bindings = $.data(this, dataPropertyName);
          bindings[eventType] = true;
          activeDocHandlers[eventType] = (activeDocHandlers[eventType] || 0) + 1;
          if (activeDocHandlers[eventType] === 1) {
            $document.bind(realType, mouseEventCallback);
          }
          $(this).bind(realType, dummyMouseHandler);
          if (eventCaptureSupported) {
            activeDocHandlers["touchstart"] = (activeDocHandlers["touchstart"] || 0) + 1;
            if (activeDocHandlers["touchstart"] === 1) {
              $document.bind("touchstart", handleTouchStart).bind("touchend", handleTouchEnd).bind("touchmove", handleTouchMove).bind("scroll", handleScroll);
            }
          }
        },
        teardown: function (data, namespace) {
          --activeDocHandlers[eventType];
          if (!activeDocHandlers[eventType]) {
            $document.unbind(realType, mouseEventCallback);
          }
          if (eventCaptureSupported) {
            --activeDocHandlers["touchstart"];
            if (!activeDocHandlers["touchstart"]) {
              $document.unbind("touchstart", handleTouchStart).unbind("touchmove", handleTouchMove).unbind("touchend", handleTouchEnd).unbind("scroll", handleScroll);
            }
          }
          var $this = $(this),
            bindings = $.data(this, dataPropertyName);
          if (bindings) {
            bindings[eventType] = false;
          }
          $this.unbind(realType, dummyMouseHandler);
          if (!hasVirtualBindings(this)) {
            $this.removeData(dataPropertyName);
          }
        }
      };
    }
    for (var i = 0; i < virtualEventNames.length; i++) {
      $.event.special[virtualEventNames[i]] = getSpecialEventObject(virtualEventNames[i]);
    }
    if (eventCaptureSupported) {
      document.addEventListener("click", function (e) {
        var cnt = clickBlockList.length,
          target = e.target,
          x, y, ele, i, o, touchID;
        if (cnt) {
          x = e.clientX;
          y = e.clientY;
          threshold = $.vmouse.clickDistanceThreshold;
          ele = target;
          while (ele) {
            for (i = 0; i < cnt; i++) {
              o = clickBlockList[i];
              touchID = 0;
              if ((ele === target && Math.abs(o.x - x) < threshold && Math.abs(o.y - y) < threshold) || $.data(ele, touchTargetPropertyName) === o.touchID) {
                e.preventDefault();
                e.stopPropagation();
                return;
              }
            }
            ele = ele.parentNode;
          }
        }
      }, true);
    }
  })(jQuery, window, document);
  (function ($, window, undefined) {
    $.each(("touchstart touchmove touchend " + "tap taphold " + "swipe swipeleft swiperight " + "scrollstart scrollstop").split(" "), function (i, name) {
      $.fn[name] = function (fn) {
        return fn ? this.bind(name, fn) : this.trigger(name);
      };
      if ($.attrFn) {
        $.attrFn[name] = true;
      }
    });
    var supportTouch = $.mobile.support.touch,
      scrollEvent = "touchmove scroll",
      touchStartEvent = supportTouch ? "touchstart" : "mousedown",
      touchStopEvent = supportTouch ? "touchend" : "mouseup",
      touchMoveEvent = supportTouch ? "touchmove" : "mousemove";

    function triggerCustomEvent(obj, eventType, event) {
      var originalType = event.type;
      event.type = eventType;
      $.event.handle.call(obj, event);
      event.type = originalType;
    }
    $.event.special.scrollstart = {
      enabled: true,
      setup: function () {
        var thisObject = this,
          $this = $(thisObject),
          scrolling, timer;

        function trigger(event, state) {
          scrolling = state;
          triggerCustomEvent(thisObject, scrolling ? "scrollstart" : "scrollstop", event);
        }
        $this.bind(scrollEvent, function (event) {
          if (!$.event.special.scrollstart.enabled) {
            return;
          }
          if (!scrolling) {
            trigger(event, true);
          }
          clearTimeout(timer);
          timer = setTimeout(function () {
            trigger(event, false);
          }, 50);
        });
      }
    };
    $.event.special.tap = {
      tapholdThreshold: 750,
      setup: function () {
        var thisObject = this,
          $this = $(thisObject);
        $this.bind("vmousedown", function (event) {
          if (event.which && event.which !== 1) {
            return false;
          }
          var origTarget = event.target,
            origEvent = event.originalEvent,
            timer;

          function clearTapTimer() {
            clearTimeout(timer);
          }

          function clearTapHandlers() {
            clearTapTimer();
            $this.unbind("vclick", clickHandler).unbind("vmouseup", clearTapTimer);
            $(document).unbind("vmousecancel", clearTapHandlers);
          }

          function clickHandler(event) {
            clearTapHandlers();
            if (origTarget === event.target) {
              triggerCustomEvent(thisObject, "tap", event);
            }
          }
          $this.bind("vmouseup", clearTapTimer).bind("vclick", clickHandler);
          $(document).bind("vmousecancel", clearTapHandlers);
          timer = setTimeout(function () {
            triggerCustomEvent(thisObject, "taphold", $.Event("taphold", {
              target: origTarget
            }));
          }, $.event.special.tap.tapholdThreshold);
        });
      }
    };
    $.event.special.swipe = {
      scrollSupressionThreshold: 30,
      durationThreshold: 1000,
      horizontalDistanceThreshold: 30,
      verticalDistanceThreshold: 75,
      setup: function () {
        var thisObject = this,
          $this = $(thisObject);
        $this.bind(touchStartEvent, function (event) {
          var data = event.originalEvent.touches ? event.originalEvent.touches[0] : event,
            start = {
              time: (new Date()).getTime(),
              coords: [data.pageX, data.pageY],
              origin: $(event.target)
            },
            stop;

          function moveHandler(event) {
            if (!start) {
              return;
            }
            var data = event.originalEvent.touches ? event.originalEvent.touches[0] : event;
            stop = {
              time: (new Date()).getTime(),
              coords: [data.pageX, data.pageY]
            };
            if (Math.abs(start.coords[0] - stop.coords[0]) > $.event.special.swipe.scrollSupressionThreshold) {
              event.preventDefault();
            }
          }
          $this.bind(touchMoveEvent, moveHandler).one(touchStopEvent, function (event) {
            $this.unbind(touchMoveEvent, moveHandler);
            if (start && stop) {
              if (stop.time - start.time < $.event.special.swipe.durationThreshold && Math.abs(start.coords[0] - stop.coords[0]) > $.event.special.swipe.horizontalDistanceThreshold && Math.abs(start.coords[1] - stop.coords[1]) < $.event.special.swipe.verticalDistanceThreshold) {
                start.origin.trigger("swipe").trigger(start.coords[0] > stop.coords[0] ? "swipeleft" : "swiperight");
              }
            }
            start = stop = undefined;
          });
        });
      }
    };
    $.each({
      scrollstop: "scrollstart",
      taphold: "tap",
      swipeleft: "swipe",
      swiperight: "swipe"
    }, function (event, sourceEvent) {
      $.event.special[event] = {
        setup: function () {
          $(this).bind(sourceEvent, $.noop);
        }
      };
    });
  })(jQuery, this);
  (function ($) {
    var meta = $("meta[name=viewport]"),
      initialContent = meta.attr("content"),
      disabledZoom = initialContent + ",maximum-scale=1, user-scalable=no",
      enabledZoom = initialContent + ",maximum-scale=10, user-scalable=yes",
      disabledInitially = /(user-scalable[\s]*=[\s]*no)|(maximum-scale[\s]*=[\s]*1)[$,\s]/.test(initialContent);
    $.mobile.zoom = $.extend({}, {
      enabled: !disabledInitially,
      locked: false,
      disable: function (lock) {
        if (!disabledInitially && !$.mobile.zoom.locked) {
          meta.attr("content", disabledZoom);
          $.mobile.zoom.enabled = false;
          $.mobile.zoom.locked = lock || false;
        }
      },
      enable: function (unlock) {
        if (!disabledInitially && (!$.mobile.zoom.locked || unlock === true)) {
          meta.attr("content", enabledZoom);
          $.mobile.zoom.enabled = true;
          $.mobile.zoom.locked = false;
        }
      },
      restore: function () {
        if (!disabledInitially) {
          meta.attr("content", initialContent);
          $.mobile.zoom.enabled = true;
        }
      }
    });
  }(jQuery));
  (function ($, window) {
    if (!(/iPhone|iPad|iPod/.test(navigator.platform) && navigator.userAgent.indexOf("AppleWebKit") > -1)) {
      return;
    }
    var zoom = $.mobile.zoom,
      evt, x, y, z, aig;

    function checkTilt(e) {
      evt = e.originalEvent;
      aig = evt.accelerationIncludingGravity;
      x = Math.abs(aig.x);
      y = Math.abs(aig.y);
      z = Math.abs(aig.z);
      if (!window.orientation && (x > 7 || ((z > 6 && y < 8 || z < 8 && y > 6) && x > 5))) {
        if (zoom.enabled) {
          zoom.disable();
        }
      } else if (!zoom.enabled) {
        zoom.enable();
      }
    }
    $(window).bind("orientationchange.iosorientationfix", zoom.enable).bind("devicemotion.iosorientationfix", checkTilt);
  }(jQuery, this));
  (function ($, window, undefined) {
    $.mobile.transitionFallbacks.flip = "fade";
  })(jQuery, this);
  (function ($, window, undefined) {
    $.mobile.transitionFallbacks.flow = "fade";
  })(jQuery, this);
  (function ($, window, undefined) {
    $.mobile.transitionFallbacks.pop = "fade";
  })(jQuery, this);
  (function ($, window, undefined) {
    $.mobile.transitionHandlers.slide = $.mobile.transitionHandlers.simultaneous;
    $.mobile.transitionFallbacks.slide = "fade";
  })(jQuery, this);
  (function ($, window, undefined) {
    $.mobile.transitionFallbacks.slidedown = "fade";
  })(jQuery, this);
  (function ($, window, undefined) {
    $.mobile.transitionFallbacks.slidefade = "fade";
  })(jQuery, this);
  (function ($, window, undefined) {
    $.mobile.transitionFallbacks.slideup = "fade";
  })(jQuery, this);
  (function ($, window, undefined) {
    $.mobile.transitionFallbacks.turn = "fade";
  })(jQuery, this);
}));
jQuery.cookie = function (name, value, options) {
  if (typeof value != 'undefined') {
    options = options || {};
    if (value === null) {
      value = '';
      options.expires = -1;
    }
    var expires = '';
    if (options.expires && (typeof options.expires == 'number' || options.expires.toUTCString)) {
      var date;
      if (typeof options.expires == 'number') {
        date = new Date();
        date.setTime(date.getTime() + (options.expires * 24 * 60 * 60 * 1000));
      } else {
        date = options.expires;
      }
      expires = '; expires=' + date.toUTCString();
    }
    var path = options.path ? '; path=' + (options.path) : '';
    var domain = options.domain ? '; domain=' + (options.domain) : '';
    var secure = options.secure ? '; secure' : '';
    document.cookie = [name, '=', encodeURIComponent(value), expires, path, domain, secure].join('');
  } else {
    var cookieValue = null;
    if (document.cookie && document.cookie != '') {
      var cookies = document.cookie.split(';');
      for (var i = 0; i < cookies.length; i++) {
        var cookie = jQuery.trim(cookies[i]);
        if (cookie.substring(0, name.length + 1) == (name + '=')) {
          cookieValue = decodeURIComponent(cookie.substring(name.length + 1));
          break;
        }
      }
    }
    return cookieValue;
  }
};;
var Klass = (function () {
  var $removeOn = function (string) {
    return string.replace(/^on([A-Z])/, function (full, first) {
      return first.toLowerCase();
    });
  };
  var $tryRemoveOn = function (string) {
    if (/^on([A-Z]\w+)$/.test(string)) {
      return String(RegExp.$1).toLowerCase();
    } else {
      return string;
    }
  };
  var $proxy = function (fn, obj) {
    return function () {
      fn.apply(obj, arguments);
    };
  };
  var $extend = function (obj, properties) {
    for (var p in properties)
      if (Object.hasOwnProperty.call(properties, p)) {
        if (!Object.hasOwnProperty.call(obj, p)) {
          obj[p] = properties[p];
        }
      }
  };
  if (Object.hasOwnProperty.call(Array.prototype, 'indexOf')) {
    var $include = function (array, item) {
      if (-1 == array.indexOf(item)) array.push(item);
      return array;
    };
    var $contains = function (array, item) {
      return -1 != array.indexOf(item);
    };
  } else {
    var $include = function (array, item) {
      for (var i = array.length; i--;) {
        if (array[i] == item) return array;
      }
      array.push(item);
      return array;
    };
    var $contains = function (array, item) {
      for (var i = array.length; i--;) {
        if (array[i] == item) return true;
      }
      return false;
    };
  }
  var $erase = function (array, item) {
    for (var i = array.length; i--;) {
      if (array[i] === item) array.splice(i, 1);
    }
    return array;
  };
  var $each_array = function (array, fn, bind) {
    for (var i = 0; i < array.length; i++) {
      fn.apply(bind || array, [array[i], i]);
    };
  };
  var $each_object = function (obj, fn, bind) {
    for (var p in obj)
      if (Object.hasOwnProperty.call(obj, p)) {
        fn.apply(bind || obj, [obj[p], p]);
      }
    return obj;
  };
  var $clone = function (obj) {
    if (obj instanceof Array) {
      var len = obj.length;
      var _obj = new Array(len);
      for (var i = 0; i < len; i++) {
        _obj[i] = arguments.callee(obj[i]);
      };
      return _obj;
    } else if (typeof obj == 'object') {
      var _obj = new Object;
      for (var i in obj)
        if (Object.hasOwnProperty.call(obj, i)) {
          _obj[i] = arguments.callee(obj[i]);
        };
      return _obj;
    }
    return obj;
  };
  _Klass.each = function (obj, fn, bind) {
    if (obj instanceof Array) {
      return $each_array(obj, fn, bind);
    } else if (typeof obj == 'object') {
      return $each_object(obj, fn, bind);
    } else {
      throw new Exception('error');
    }
  };

  function _Klass(methods) {
    var binds = {};
    if (Object.hasOwnProperty.call(methods, 'Binds')) {
      $each_array(methods['Binds'], function (p) {
        if (Object.hasOwnProperty.call(methods, p)) {
          binds[p] = methods[p];
          delete methods[p];
        }
      });
      delete methods['Binds'];
    }
    var $options = {};
    if (Object.hasOwnProperty.call(methods, 'options')) {
      $options = methods['options'];
      delete methods['options'];
    }
    var $options_events = {};
    $each_object($options, function (fn, type) {
      var _type = $tryRemoveOn(type);
      if (_type != type) {
        $options_events[_type] = $include($options_events[_type] || [], fn);
        delete $options[type];
      }
    });
    if (Object.hasOwnProperty.call($options, 'events')) {
      $each_object($options['events'], function (fn, type) {
        type = $removeOn(type);
        $options_events[type] = $include($options_events[type] || [], fn);
      });
      delete $options['events'];
    }
    var klass = function () {
      $each_object(binds, function (fn, property) {
        this[property] = jQuery.proxy(fn, this);
      }, this);
      this.options = $clone($options);
      $options_initialize = null;
      this.setOptions = function (options) {
        if (typeof options != 'object') {
          return this;
        }
        var scope_initialize = null;
        if (Object.hasOwnProperty.call(options, 'initialize')) {
          if (true === $options_initialize) {
            scope_initialize = options['initialize'];
          } else {
            $options_initialize = options['initialize'];
          }
          delete options['initialize'];
        }
        for (var p in options)
          if (Object.hasOwnProperty.call(options, p)) {
            var _type = $tryRemoveOn(p);
            if (p != _type) {
              this.addEvent(_type, options[p]);
            } else if (p == 'events') {
              this.addEvents(options[p]);
            } else {
              this.options[p] = options[p];
            }
          }
        if (scope_initialize) {
          scope_initialize.call(this);
        }
        return this;
      };
      var $events = $clone($options_events);
      this.addEvent = function (type, fn) {
        if (!(fn instanceof Function)) {
          throw new Exception('add event need Function argument!');
        }
        type = $removeOn(type);
        $events[type] = $include($events[type] || [], fn);
        return this;
      };
      this.addEvents = function (events) {
        for (var type in events)
          if (Object.hasOwnProperty.call(events, type)) {
            this.addEvent(type, events[type]);
          }
        return this;
      };
      this.removeEvent = function (type, fn) {
        type = $removeOn(type);
        if (Object.hasOwnProperty.call($events, type)) {
          $erase($events[type], fn);
        }
        return this;
      };
      this.removeEvents = function (type) {
        if (!(type instanceof String)) {
          for (_type in type)
            if (Object.hasOwnProperty.call(type, _type)) {
              this.removeEvent(_type, type[_type]);
            }
          return this;
        }
        type = $removeOn(type);
        if (Object.hasOwnProperty.call($events, type)) {
          delete $events[type];
        }
        return this;
      };
      this.fireEvent = function (type, args) {
        type = $removeOn(type);
        if (Object.hasOwnProperty.call($events, type)) {
          var events = $events[type];
          for (var i = 0; i < events.length; i++) {
            var fn = events[i];
            fn.apply(this, args);
          }
        }
        return this;
      };
      this.initialize.apply(this, arguments);
      if ('function' === typeof $options_initialize) {
        $options_initialize.call(this);
      }
      $options_initialize = true;
    };
    for (var property in methods)
      if (Object.hasOwnProperty.call(methods, property)) {
        klass.prototype[property] = methods[property];
      }
    if (!klass.prototype.initialize) klass.prototype.initialize = function () {};
    return klass;
  };
  return _Klass;
})();
(function ($) {
  if (App.player_static_tools) {
    return;
  }
  var tools_box = $('#tools');
  var tools = $('#tools>div');
  var offsets = [-130, -232];

  function relayout(is_close) {
    var left = parseInt(tools.css('left'));
    var _left = left;
    if (is_close) {
      if (left >= 0) {
        _left = offsets[0];
      } else if (left >= offsets[0]) {
        _left = offsets[1];
      } else {
        return;
      }
    } else {
      if (left <= offsets[1]) {
        _left = offsets[0];
      } else if (left <= offsets[0]) {
        _left = 0;
      } else {
        return;
      }
    }
    if (_left < 0) {
      tools_box.addClass('tools_show_download_button');
    } else {
      tools_box.removeClass('tools_show_download_button');
    }
    tools.animate({
      left: _left
    }, {
      duration: 300,
      complete: function () {
        if (App.player_debug) {
          $('#tools').css('border', '1px solid #f00');
          //alert('relayout done')
        }
      }
    });
  }
  if (App.mobile) {
    if (App.player_debug) {
      $('#tools').css('border', '1px solid #f00');
    }
    $('#tools').swipeleft(function () {
      if (App.player_debug) {
        //alert(['  swipeleft ']);
      }
      relayout(true);
    }).swiperight(function () {
      if (App.player_debug) {
        //alert(['  swiperight  ']);
      }
      relayout(false);
    });
  }
  $.each($('#tools>div>p>a'), function (i) {
    var _this = $(this);
    _this.bind('vclick', function (evt) {
      if (App.player_debug) {
        //alert(['  swipe  ', i]);
      }
      relayout(!i);
    });
  });
})(jQuery);
(function ($) {
  var ev_name = App.mobile ? 'tap' : 'click';
  var MyApp = new Klass({
    initialize: function () {}
  });
  var full_screen = $('#full_screen');
  full_screen.bind('vclick', function (evt) {
	jQuery('#mp4_player')[0].webkitEnterFullscreen();
	jQuery('#mp4_player').webkitEnterFullscreen();
  //  alert('dfadsf11');
    /*var vid = document.getElementById("mp4_player");
	//var vid = document.documentElement;
    if (vid[0].requestFullScreen) {
      vid[0].requestFullScreen();
    } else if (vid[0].f) {
      vid[0].webkitRequestFullScreen();
    } else if (vid[0].mozRequestFullScreen) {
      vid[0].mozRequestFullScreen();
    }*/
    //alert(player);
    //  player.tryPlayOrPause();
    if (window.parent && window.parent.toggleGmcHtml5PlayerFullScreeen) {
      evt.stopPropagation();
      evt.preventDefault();
      window.parent.toggleGmcHtml5PlayerFullScreeen();
    }
    jQuery(document.body).toggleClass('GmcHtml5PlayerFullScreen');
  });
  var my_app = App.my_app = new MyApp();
  var gmc_html5player_member_only = jQuery('#gmc_html5player_member_only');
  var gmc_html5player_member_only_mask = jQuery('#gmc_html5player_member_only>div:last-child');
  var gmc_html5player_member_only_text = jQuery('#gmc_html5player_member_only_text');
  jQuery('#gmc_html5player_member_only p').bind('vclick', function (evt) {
    setTimeout(function () {
      gmc_html5player_member_only.addClass('HideClassName');
    }, 400);
  });
  var just_fired = false;

  function member_only(a, evt, type) {
    if (just_fired) return;
    just_fired = true;
    gmc_html5player_member_only_mask.css('display', 'block');
    setTimeout(function () {
      just_fired = false;
      gmc_html5player_member_only_mask.css('display', 'none');
    }, 900);
    gmc_html5player_member_only.removeClass('HideClassName');
    var pos = a.position();
    pos.left = 110 - gmc_html5player_member_only.width();
    var types = {
      'guitarpro': 'This file Requires Guitar Pro software Available for free trail <a href="http://www.guitar-pro.com/en/index.php"  target="_blank">here</a>. Free alternative <a href="http://www.tuxguitar.com.ar/download.html"   target="_blank">here</a>.',
      'member': 'To access member content login or <a href="/signup/" target="_blank"><u>sign up</u></a>.<br/><br/><br/><span class="tap-to-close-popup">tap to close</span>',
      'cover': 'For copyright reasons this lesson does not contain tabs. Instead every note is explained by the instructor.',
      'download': 'To download this backing track please login or <a href="/signup/" target="_blank">sign up</a>.'
    };
    gmc_html5player_member_only_text.html(types[type]);
    gmc_html5player_member_only.css(pos);
  }
  if (App.lesson_data.hasOwnProperty('tools')) {
    var tools_items = $('#tools_items');
    Klass.each(App.lesson_data.tools, function (o, tool) {
      var src = o[0];
      var a = $('<a/>').css('cursor', 'pointer');
      if (App.lesson_data.coverd_lesson) {
        a.addClass('Question');
      } else {
        a.addClass(tool);
      }
      var not_available = false;
      if (!src || '/' === src) {
        not_available = true;
        a.addClass('not_available');
      }
      a.append($('<span/>').text(tool).css('font-size', 10));
      tools_items.append(a);
      a.bind('vclick', function (evt) {
        if (not_available) {
          member_only(a, evt, App.lesson_data.coverd_lesson ? 'cover' : 'member');
          return;
        }
        window.open(src);
      });
    });
  }
  if (App.lesson_data.hasOwnProperty('backingtracks')) {
    var tools_songs = $('#tools_songs');
    var downloads_list = [];
    Klass.each(App.lesson_data.backingtracks, function (o, i) {
      var src = o.url;
      var fid = o.fid;
      var nid = o.nid;
      var a = $('<a/>').css('cursor', 'pointer');
      var not_available = false;
      if (!src || '/' === src) {
        not_available = true;
        a.addClass('not_available');
      }
      a.append($('<i/>').text(i < 9 ? '0' + (1 + i) : (1 + i)));
      if (o.hasOwnProperty('downloadable')) {
        downloads_list.push([a, src, fid, nid]);
        a.addClass('tools_song_downloadable');
        if (o.downloadable) {
          a.addClass('tools_song_downloadable_true');
        }
      }
      a.append($('<span/>').text(o.title).css('font-size', 10));
      tools_songs.append(a);
      a.bind('vclick', function (evt) {
        if (not_available) {
          member_only(a, evt, 'member');
          App.mp3_player.stop();
          return;
        }
        if (!$(this).hasClass("tools_song_now")) {
          $('#tools_songs a').removeClass('tools_song_now');
          a.addClass('tools_song_now');
          $("#mp3_player").attr("src", src);
          App.mp3_player.load(src);
          App.mp3_player.play();
        } else {
          App.mp3_player.tryPlayOrPause();
        }
      });
      if (!i) {
        a.addClass('tools_song_now');
        my_app.addEvent('ready', function () {
          App.mp3_player.load(src);
          $("#mp3_player").attr("src", src);
        });
      }
    });
    setTimeout(function () {
      var tools = jQuery('#tools');
      jQuery.each(downloads_list, function (i) {
        var _this = jQuery(this[0]);
        var src = String(this[1]).replace(/\.mp3$/, '/download/');
        var src = '/backingtrack/' + this[3] + '/' + this[2] + '/download';
        var a = jQuery('<a/>').attr('target', '_blank');
        tools.append(a);
        var pos = _this.position();
        a.css('top', pos.top);
        var is_downloadable = _this.hasClass('tools_song_downloadable_true');
        a.bind('vclick', function (evt) {
          if (!is_downloadable) {
            member_only(_this, evt, 'download');
            return;
          }
          window.open(src);
        });
      });
    }, 100);
  }
})(jQuery);
(function ($) {
  var Quality = new Klass({
    Binds: ['getValue', 'setValue', 'toggleQuality'],
    options: {
      cookie_key: '$gmc_player_quality',
      cookie_options: {
        expires: 77
      },
      values: [0, 1, 2],
      defaule_value_index: 0
    },
    initialize: function (element, options) {
      this.setOptions(options);
      this.element = jQuery(element);
      this.text_element = jQuery(element + ' span');
      this.element.bind('vclick', this.toggleQuality);
      this.fireEvent('write', [this.getValue()]);
    },
    getIndex: function (val) {
      var values = this.options.values;
      for (var i = 0; i < values.length; i++) {
        if (val === values[i]) {
          return i;
        }
      }
      return -1;
    },
    getValue: function () {
      var val = jQuery.cookie(this.options.cookie_key);
      if (null === val) {
        val = this.options.values[this.options.defaule_value_index];
      } else {
        val = parseInt(val);
      }
      return val;
    },
    setValue: function (val) {
      if (this.getIndex(val) < 0) {
        val = this.options.values[this.options.defaule_value_index];
      }
      jQuery.cookie(this.options.cookie_key, val, this.options.cookie_options);
      this.fireEvent('write', [val]);
      return this;
    },
    toggleQuality: function (evt) {
      var val = this.getValue();
      var i = this.getIndex(val) + 1;
      if (i >= this.options.values.length) {
        i = 0;
      }
      var _val = this.options.values[i];
      this.setValue(_val);
    }
  });
  window["QualityInstance"] = new Quality('#quality_btn', {
    values: [0, 2],
    onWrite: function (val) {
      if (0 === val) {
        this.text_element.text('LQ');
      } else {
        this.text_element.text('HQ');
      }
    }
  });
})(jQuery);
(function ($) {
  var $ = jQuery;
  var parts = [];
  if (App.lesson_data.hasOwnProperty('parts')) {
    parts = App.lesson_data.parts;
  }
  var GmcSlider = new Klass({
    Binds: ['getValue', 'whenTouchStart', 'whenTouchMove', 'whenTouchEnd', 'whenResize'],
    options: {
      maxValue: 0,
      snap: false,
      wheel: true,
      offset: 0
    },
    initialize: function (element, knob, options) {
      this.setOptions(options);
      this.element = jQuery(element);
      knob = this.knob = jQuery(knob);
      options = this.options;
      this.minValue = 0;
      this.maxValue = this.element.width();
      this.property = 'left';
      this.axis = 'x';
      knob.css(this.property, knob.css(this.property));
      this.isDragging = false;
      jQuery(window).resize(this.whenResize);
    },
    whenResize: function () {
      this.maxValue = this.element.width();
      this.setPercentageValue(this.last_percentage_value);
    },
    whenTouchStart: function (_evt) {
      var evt = _evt.originalEvent;
      if (evt.touches.length != 1) {
        return;
      }
      this.maxValue = this.element.width();
      var t = evt.targetTouches[0];
      this.touchPosition = {
        x: t.pageX,
        y: t.pageY
      };
      var value = parseInt(this.knob.css(this.property)) || 0;
      this.touchPosition.value = value;
      this.isDragging = true;
      this.last_percentage_value = 0;
      this.fireEvent('start', [value, evt]);
    },
    whenTouchMove: function (_evt) {
      if (!this.isDragging) {
        return;
      }
      var evt = _evt.originalEvent;
      evt.preventDefault();
      evt.stopPropagation();
      var t = event.targetTouches[0];
      if (t == null) {
        return;
      }
      var lastTouchPosition = {
        x: t.pageX,
        y: t.pageY
      };
      var delta = lastTouchPosition[this.axis] - this.touchPosition[this.axis];
      var _value = this.touchPosition.value + delta;
      this.lastTouchPosition = lastTouchPosition;
      if (_value < this.minValue) {
        _value = this.minValue;
      } else if (_value > this.maxValue) {
        _value = this.maxValue;
      }
      this.knob.css(this.property, _value);
      this.fireEvent('drag', [_value, evt]);
    },
    whenTouchEnd: function (_evt) {
      if (!this.isDragging) {
        return;
      }
      var evt = _evt.originalEvent;
      this.isDragging = false;
      this.fireEvent('stop', [this, evt]);
    },
    setValue: function (value) {
      if (value < this.minValue) value = this.minValue;
      else if (value > this.maxValue) value = this.maxValue;
      this.knob.css(this.property, value);
      return this;
    },
    getValue: function () {
      var value = parseInt(this.knob.css(this.property)) || 0;
      return value;
    },
    setPercentageValue: function (value) {
      this.last_percentage_value = value;
      var _value = value * this.maxValue;
      return this.setValue(_value);
    },
    getPercentageValue: function () {
      var value = this.getValue();
      return (value / this.maxValue);
    },
    getPercentageValueByValue: function (value) {
      return (value / this.maxValue);
    },
    detach: function () {
      this.knob.unbind("touchstart", this.whenTouchStart);
      this.knob.unbind("touchmove", this.whenTouchMove);
      this.knob.unbind("touchend", this.whenTouchEnd);
    },
    attach: function () {
      this.knob.bind("touchstart", this.whenTouchStart);
      this.knob.bind("touchmove", this.whenTouchMove);
      this.knob.bind("touchend", this.whenTouchEnd);
    },
  });
  var Player = new Klass({
    Binds: ['tryPlayOrPause', 'whenPlay', 'whenStop', 'updateProgress', 'updateDuration', 'whenResize'],
    initialize: function (media, type, options) {
      this.setOptions(options);
      this.body = jQuery(document.body);
      this.media = media;
      this.type = type;
      var types = {
        mp4: 'video/mp4',
        mp3: 'audio/mpeg',
        metronome: 'audio/mpeg'
      };
      if (Object.hasOwnProperty.call(types, type)) {
        this.media_type = types[type];
        for (var _type in types)
          if (Object.hasOwnProperty.call(types, _type)) {
            this['is_' + _type] = false;
          }
        this['is_' + type] = true;
      } else {
        throw new Exception('unsupport media type `' + type + '`');
      }
      this.player = media.get(0);
      this.progess_bar = $('#' + type + '_box .progress_box');
      this.progress_time = $('#' + type + '_box .progress_time');
      this.play_or_pause = $('#' + type + '_box .play_or_pause');
      this.progess_buffer_bar = $('#' + type + '_box .progress_buffer_bar');
      this.progess_current_bar = $('#' + type + '_box .progress_bar');
      this.progess_position = $('#' + type + '_box .progress_position');
      this.bindEvents();
    },
    bindEvents: function () {
      this.addEvent('play', this.whenPlay);
      this.addEvent('stop', this.whenStop);
      if (this.is_metronome) {
        return;
      }
      var ev_name = App.mobile ? 'tap' : 'click';
      this.play_or_pause[ev_name](this.tryPlayOrPause);
      this.slider = new GmcSlider(this.progess_bar, this.progess_position, {
        player: this,
        onStop: function () {
          if (this.loadEmpty) {
            return;
          }
          var value = this.getPercentageValue();
          var duration = this.options.player.duration;
          if (duration) {
            var time = duration * value;
            this.options.player.player.currentTime = time;
            if (!this.options.player.onPlay) {
              this.options.player.play();
            }
          }
        }
      });
      this.media.bind('loadedmetadata', this.updateDuration);
      this.media.bind('durationchange', this.updateDuration);
      this.media.bind('timeupdate', this.updateProgress);
      this.media.bind('loadeddata', this.updateProgress);
      this.media.bind('progress', this.updateProgress);
    },
    updateDuration: function () {
      this.duration = this.player.duration;
      this.updateTime(0, this.duration);
    },
    updateProgress: function () {
      if (this.loadEmpty || this.is_metronome) {
        return;
      }
      var time = this.player.currentTime;
      var value = this.duration ? time / this.duration : 0;
      this.progess_current_bar.css('width', value * 100 + '%');
      if (!this.slider.isDragging) {
        this.slider.setPercentageValue(value);
      }
      if (!this.duration) {
        this.duration = this.player.duration || 0;
      }
      this.updateTime(time, this.duration);
      if (this.player.buffered.length) {
        time = this.player.buffered.end(0);
        value = this.duration ? time / this.duration : 0;
      } else {
        value = 0;
      }
      this.progess_buffer_bar.css('width', value * 100 + '%');
    },
    updateTime: (function () {

      function format(time) {
        var m = Math.floor(time / 60);
        var s = Math.floor(time % 60);
        if (m < 10) m = '0' + m;
        if (s < 10) s = '0' + s;
        return m + ':' + s;
      }
      return function (time, duration) {
        this.progress_time.text(format(time) + ' / ' + format(duration));
      };
    })(),
    whenPlay: function () {
      this.play_or_pause.addClass('onPlaying');
    },
    whenStop: function () {
      this.play_or_pause.removeClass('onPlaying');
    },
    play: function () {
      this.player.play();
      this.onPlay = 1;
      this.fireEvent('play');
    },
    stop: function () {
      this.player.pause();
      this.onPlay = 0;
      this.fireEvent('stop');
    },
    empty: function () {
      this.load('');
      this.player.load();
    },
    tryPlayOrPause: function () {
      if (this.player.src == 'http://admin.prod.gmc.my/') {
        return;
      }
      if (this.loadEmpty) {
        return;
      }
      if (this.player.paused) {
        this.play();
      } else {
        this.stop();
      }
    },
    load: function (src, autostart) {
      this.stop();
      this.media.empty();
      this.duration = 0;
      this.onPlay = 0;
      this.loadEmpty = !src || src == '';
      if (!this.is_metronome) {
        this.progess_buffer_bar.css('width', '0%');
        this.progess_current_bar.css('width', '0%');
        if (!this.slider.isDragging) {
          this.slider.setPercentageValue(0);
        }
      }
      var source = $('<source/>').attr('type', this.media_type).attr('src', src);
      this.media.append(source);
      if (!this.is_metronome) {
        this.updateTime(0, 0);
        if (!this.loadEmpty) {
          this.slider.attach();
        } else {
          this.slider.detach();
        }
      }
      if (autostart && !this.loadEmpty) {
        this.play();
      }
    },
  });
  var ev_name = App.mobile ? 'tap' : 'click';
  var player = App.mp4_player = new Player($('#player>div>*'), 'mp4', {
    onPlay: function () {
      this.body.addClass('GmcMp4Playing');
      mp3_player.stop();
      metronome_player.stop();
	  jQuery('.gmc-play-icon').hide();
      if (App.is_android && !App.android_tablet) {
        this.media.get(0).webkitEnterFullScreen();
      }
    },
    onStop: function () {
      this.body.removeClass('GmcMp4Playing');
	  var pauseTime = this.player.currentTime;
	  if(pauseTime > 0) {
		jQuery('.gmc-play-icon').show();
	  }
    }
  });
  /*****Play video after icon click*****/
  /*var gmc_play_icon = $('.gmc-play-icon');
  gmc_play_icon.bind('vclick', function (evt) {*/
  jQuery(".gmc-play-icon").live(ev_name, function(e){
    e.preventDefault();
	jQuery(".gmc-play-icon").hide();
	player.play();
  });
  /*****Play video after icon click*****/
  
  /*****Hide popup message for member only*****/
  jQuery(".tap-to-close-popup").live(ev_name, function(e){
	var gmc_html5player_member_only = jQuery('#gmc_html5player_member_only');
    setTimeout(function () {
      gmc_html5player_member_only.addClass('HideClassName');
    }, 400);
	jQuery(".HideClassName").hide();
  });
  /*****Hide popup message for member only*****/
	/*****Auto Play lessons video in mobile*****/
	var vid=document.getElementById('mp4_player');
	vid.addEventListener("loadstart", showVideo, false);
	function showVideo(e) {
		vid.play();
	}
	/*****Auto Play lessons video in mobile*****/
	
	/*****Tool section draggable in mobile*****/
	/*var obj = document.getElementById('tools');
	obj.addEventListener('touchmove', function(event) {
		event.preventDefault();
	  // If there's exactly one finger inside this element
	  if (event.targetTouches.length == 1) {
		var touch = event.targetTouches[0];
		// Place element where the finger is
		if(touch.pageX < 830 && touch.pageX > 400){
			if(App.is_ipad || App.android_tablet) {
				obj.style.left = (touch.pageX / 10 + 20) + '%';
			}
			else {
				obj.style.left = touch.pageX + 'px';
				obj.style.top = touch.pageY + 'px';
			}
		}
	  }
	}, false);*/
	var obj = document.getElementById('tools');
	var tools_box = jQuery('#tools');
	jQuery('#tools *').swipeleft(function (e) {
		e.preventDefault();
		obj.style.left = 80 + '%';
		tools_box.addClass('tools_show_download_button');
	}).swiperight(function (e) {
		e.preventDefault();
		obj.style.left = 100 + '%';
		tools_box.removeClass('tools_show_download_button');
	});
	/*****Tool section draggable in mobile*****/
	
  /*var pinch_mp4_player = $('#mp4_player');
  pinch_mp4_player.bind('touchmove', function (evt) {
	alert('dddd');
  });*/
  
  (function () {
    jQuery('#player_mask div')[ev_name](player.tryPlayOrPause);
	//jQuery('.gmc-play-icon')[ev_name](player.tryPlayOrPause);
  })();
  var mp3_player = App.mp3_player = new Player($('#mp3_player'), 'mp3', {
    onPlay: function () {
      player.stop();
      metronome_player.stop();
    },
    onStop: function () {}
  });
  var metronome_player = App.metronome_player = new Player($('#metronome_player'), 'metronome', {
    onPlay: function () {
      player.stop();
      mp3_player.stop();
      jQuery('#metronome_status span').text('stop');
    },
    onStop: function () {
      jQuery('#metronome_status span').text('start');
    }
  });
  (function () {
    jQuery('#metronome_status').bind('vclick', metronome_player.tryPlayOrPause);
    var input = jQuery('#metronome_box input');
    (function (input) {
      var allowedSpecialCharKeyCodes = [46, 8, 37, 39, 35, 36, 9];
      var numberKeyCodes = [44, 48, 49, 50, 51, 52, 53, 54, 55, 56, 57, 96, 97, 98, 99, 100, 101, 102, 103, 104, 105];
      var commaKeyCode = [188];
      var decimalKeyCode = [190, 110];
      var last_value = input.val();
      var last_check_value = last_value;
      var check = (function (input) {
        var timer = null;

        function do_check(now_check) {
          timer = null;
          var val = input.val();
          if (/\D/.test(val)) {
            input.val(last_value);
            val = last_value;
          } else {
            var _val = parseInt(val);
            if (_val < 30 || _val > 230) {
              input.val(last_value);
              val = last_value;
            }
          }
          if (last_check_value != val) {
            last_check_value = val;
            loadValue();
          }
        };
        return function (delay, now_check) {
          if (timer) clearTimeout(timer);
          timer = setTimeout(function () {
            do_check(now_check)
          }, delay || 6000);
        };
      })(input);
      input.bind('paste', function (event) {
        check(1);
      });
      input.bind('blur', function (event) {
        check(1, 1);
      });
      input.keydown(function (event) {
        last_value = this.value;
        var legalKeyCode = (!event.shiftKey && !event.ctrlKey && !event.altKey) && (jQuery.inArray(event.keyCode, allowedSpecialCharKeyCodes) >= 0 || jQuery.inArray(event.keyCode, numberKeyCodes) >= 0);
        if (legalKeyCode === false) event.preventDefault();
        check();
      });
    })(input);
    var value_range = [30, 120, 230];

    function loadValue(autoplay) {
      var value = parseInt(input.val());
      if (value < value_range[0]) {
        value = value_range[0];
        input.val(value);
      } else if (value > value_range[2]) {
        value = value_range[2];
        input.val(value);
      }
      var url = '/test/bpm-new/' + value + '.mp3';
      // metronome_player.load(url, autoplay);
    }

    function setValue(is_more) {
      var value = parseInt(input.val());
      if (is_more) value++;
      else value--; if (value < value_range[0] || value > value_range[2]) {
        return;
      }
      input.val(value);
      loadValue(true);
    }
    jQuery('#metronome_left').bind('vclick', function () {
      setValue(false);
    });
    jQuery('#metronome_right').bind('vclick', function () {
      setValue(true);
    });
    loadValue();
  })();
  window.LoadLessonPart = (function () {
    var last_part_index = -1;
    var just_loaded = false;
    if (App.mobile) {
      $('#player_mask div').swipeleft(function () {
        if (just_loaded) {
          return;
        }
        var i = last_part_index + 1;
        if (i < 0 || i >= parts.length) {
          return;
        }
        window.LoadLessonPart(i, true);
        if (window.parent && window.parent.GmcHtml5PlayerTryLoadPart) {
          window.parent.GmcHtml5PlayerTryLoadPart(i);
        }
		jQuery("#guitar-lesson-parts-list li").removeClass("current");	
		jQuery(".part-"+i).addClass("current");
		jQuery("#guitar-lesson-parts-list li.part-"+i).trigger('tap');
		
      }).swiperight(function () {
        if (just_loaded) {
          return;
        }
        var i = last_part_index - 1;
        if (i < 0 || i >= parts.length) {
          return;
        }
        window.LoadLessonPart(i, true);
        if (window.parent && window.parent.GmcHtml5PlayerTryLoadPart) {
          window.parent.GmcHtml5PlayerTryLoadPart(i);
        }
		jQuery("#guitar-lesson-parts-list li").removeClass("current");	
		jQuery(".part-"+i).addClass("current");
		jQuery("#guitar-lesson-parts-list li.part-"+i).trigger('tap');
      });
    }
    var QualityInstance = window["QualityInstance"];
    delete window["QualityInstance"];
    QualityInstance.addEvent('write', function (val) {
      if (last_part_index >= 0 && last_part_index < parts.length) {
        var o = parts[last_part_index];
        var src = o[val];
        if (!src) {
          return;
        }
        player.load(src, true);
      }
    });
    return function (i, autostart) {
      if (just_loaded) {
        return;
      }
      just_loaded = true;
      setTimeout(function () {
        just_loaded = false;
      }, 400);
      if (!/^\d+$/.test(i)) {
        player.empty();
        jQuery(document.body).addClass('app_member_only');
        return;
      }
      i = parseInt(i);
      jQuery(document.body).removeClass('app_member_only');
      if (i < 0 || i >= parts.length) {
        i = 0;
      }
      if (parts.length < 1) return;
      last_part_index = i;
      var o = parts[i];
      var src = o[QualityInstance.getValue()];
      if (!src) {
        player.empty();
        jQuery(document.body).addClass('app_member_only');
        return;
      }
      player.load(src, autostart);
    };
  })();
  window.LoadLessonPart(0);
  App.my_app.fireEvent('ready');
  setTimeout(function () {
    var es = jQuery('#full_screen, .play_or_pause, #metronome_status , #metronome_left , #metronome_right, .progress_position, #quality_btn');
    es.bind('vmouseover', function () {
      jQuery(this).addClass('vHover');
    });
    es.bind('vmouseout', function () {
      jQuery(this).removeClass('vHover');
    });
  }, 400);
  if (App.mobile) {
    (function ($) {
      var win = window.parent || window;
      var body = jQuery(document.body);
      var check_orientation = jQuery.proxy(function () {
        var value = this.orientation;
        var orientation = Math.abs(value) == 90 ? 'landscape' : 'portrait';
        if (orientation != 'landscape') {
          body.addClass('GmcHTML5PlayerPortraitView').removeClass('GmcHTML5PlayerLandscapeView');
        } else {
          body.removeClass('GmcHTML5PlayerPortraitView').addClass('GmcHTML5PlayerLandscapeView');
        };
        if (body.hasClass('GmcHtml5PlayerFullScreen')) {
          if (win && win.GmcHtml5PlayerReLayout) {
            win.GmcHtml5PlayerReLayout();
          }
        }
      }, win);
    })(jQuery);
    (function ($) {
      var right = parseInt(jQuery('#player').css('padding-right'));
      var bottom = parseInt(jQuery('#player').css('padding-bottom'));
      var player_box = jQuery('#player_box');
      var mp4_player = jQuery('#mp4_player');
      jQuery(window).resize(function () {
        var _pos = {
          width: (player_box.width() - right),
          height: (player_box.height() - bottom),
        }
        mp4_player.css(_pos);
      });
    })(jQuery);
  }
})(jQuery);
