/*
 * Progressr - jQuery Plugin
 * A progressive AJAX content loading library.
 *
 * Copyright (c) 2013 Alex Vanyan (http://alex-v.net)
 * Version: 1.0
 * Requires: jQuery v1.4.2+
 *
 */

(function($) {

    $.fn.progressr = function(options) {

        return this.each(function() {

            var $this = $(this);

            // default options: do not change!
            var defaults = {
                loadContainer: $this,
                singleItemSelector: ".item",
                nextSelector: "a.next-page",
                extraPixels: 0,
                fadeIn: false,
                beforeLoad: function() {},
                afterLoad: function() {},
                onFailure: function() {},
                onRequestComplete: function() {},
                onNoMoreItems: function() {}
            };

            var opts = $.extend( {}, defaults, options );
            var extraPixels = parseInt(opts.extraPixels);
            var loadContainer = (typeof opts.loadContainer === "string" ? $(opts.loadContainer) : opts.loadContainer);

            // guesser method definitions:
            // those methods are supposed to guess
            // various jquery selectors/objects
            var guessNextHref = function(obj) {
                obj = obj.eq(0);
                return ( obj.prop("tagName") == "A" ? obj : obj.find("a").eq(0) ).attr("href");
            };
            var guessSingleItem = function() {
                return ( $(opts.singleItemSelector).length ? opts.singleItemSelector :
                    '>' + (loadContainer.children().eq(0).attr("id") ?
                        '#' + loadContainer.children().eq(0).attr("id") :
                        loadContainer.children().eq(0).prop("tagName").toLowerCase()) );
            };

            var reqUrl = guessNextHref( $(opts.nextSelector) );
            var singleItemSel = guessSingleItem();
            var fadeTime = (opts.fadeIn ? parseInt(opts.fadeIn) : 0);
            var ajaxInProgress = false;
            var newItems;

            // bind scroll event to the selector
            // object on which plugin function
            // was called on
            $this.scroll(function() {
                // if no URL string is given, we've reached the last page
                if ( typeof reqUrl === "undefined" && ! reqUrl ) {
                    opts.onNoMoreItems.call();
                    return false;
                }
                // check if we have reached to the end of the scroll container
                if ( $(this).scrollTop() + $(this).height() + extraPixels >= $(this)[0].scrollHeight && ! ajaxInProgress ) {
                    // process the GET type ajax request
                    ajaxInProgress = true;
                    $.ajax({
                        type: "GET",
                        url: reqUrl
                    }).done(function(data) { // in case of success
                            var respObj = $(data);
                            // reassign the url variable
                            // to be given to next ajax request object
                            reqUrl = guessNextHref( respObj.find(opts.nextSelectors) );
                            // find the newly loaded items and append
                            // to "loadContainer" element (defined in options)
                            newItems = respObj.find(singleItemSel).hide();
                            // pre item load callbacks
                            opts.beforeLoad.call(this, newItems);
                            loadContainer.append(newItems);
                            // show items immediately or fade in based on "fadeIn" option value
                            newItems.fadeIn(fadeTime);
                            window.setTimeout(function() {
                                // post item load callbacks
                                opts.afterLoad.call(this, newItems);
                            }, fadeTime + 1); // add one extra millisecond to be sure afterLoad is processed after fadeIn
                        }).fail(function(data) { // in case of failure
                            // proceed to callback
                            opts.onFailure.call(this, data);
                        }).always(function(data) { // always called after request
                            ajaxInProgress = false;
                            // proceed to callback
                            opts.onRequestComplete.call(this, data);
                        });
                }
            });

        });

    };

})(jQuery);