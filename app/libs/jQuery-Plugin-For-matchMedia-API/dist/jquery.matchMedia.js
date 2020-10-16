(function ($) {
    "use strict";

    var breakpoint = {};

    var getBreakpoint = function (input) {
        if (breakpoint[input] !== undefined) {
            return breakpoint[input];
        } else {
            return input;
        }
    };

    $.mq = {
        action: function (rule, handlerTrue, handlerFalse, listener, elThis) {
            if (typeof handlerTrue == 'function' || typeof handlerFalse == 'function') {
                var mq = window.matchMedia(getBreakpoint(rule));

                var callTrigger = function () {
                    var matches = mq.matches;

                    if (!matches && typeof handlerFalse == 'function') {
                        if (elThis) {
                            handlerFalse.call(elThis);
                        } else {
                            handlerFalse();
                        }
                    } else if (matches && typeof handlerTrue == 'function') {
                        if (elThis) {
                            handlerTrue.call(elThis);
                        } else {
                            handlerTrue();
                        }
                    }
                };

                if (listener !== false) mq.addListener(callTrigger);

                callTrigger();
            }
        },
        getBreakpoints: function () {
            return breakpoint;
        }
    };

    $.fn.mq = function (rule, handlerTrue, handlerFalse, listener) {
        return this.each(function () {
            $.mq.action(rule, handlerTrue, handlerFalse, listener, this);
        });
    }

})(jQuery);
