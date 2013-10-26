progressr
=========

Yet another progressive loading jQuery plugin.  
This plugin does what no other plugins do normally (without bugs) - it can work with separate item append and scroll containers (meaning those could be completely different 2 DOM elements). 
Plus, there is some logic in this one to guess what selectors should be used instead, if some selectors do not exist (given wrong) or are omitted.

Usage
=====
```html
<script type="text/javascript">
    $(document).ready(function() {
        $("#my-scrollable-container").progressr({
			loadContainer: "#my-repeatable-block-parent",
			nextSelector: ".next-page-invisible-element",
			singleItemSelector: ".my-repeatable-block",
			fadeIn: 1500
		});
    });
</script>
<div id="my-scrollable-container">
	a hell of content here...
	...
	...
	...
</div>
<div id="my-repeatable-block-parent">
	<div class="my-repeatable-block">rpt 1</div>
	<div class="my-repeatable-block">rpt 2</div>
	<div class="my-repeatable-block">rpt 3</div>
	<div class="my-repeatable-block">rpt 4</div>
</div>
<a class="next-page-invisible-element" href="http://my-example-site.com/?page=2" style="display: none;"></a>
```

Demo and advanced usage
-----------------------
Demo available at: http://narek.ws/ (usage with WordPress)


Options
=======

**loadContainer** [default: (jQuery object on which plugin was called, e.g. $("#my-scrollable-container") )] - jquery selector for the element which newly loaded content (block item elements) will be appended to  
**singleItemSelector** [default: ".item"] - single item element selector string (block item element); the plugin will get items from the next page (e.g. /?page=2) according to this option  
**nextSelector** [default: "a.next-page"] - selector string to element which has href attribute pointing to the next page (e.g. <a href="/?page=2"></a>); this element will be grabbed again from the newly loaded DOM each time a request to next page is made  
**extraPixels** [default: 0] - extra added pixels from which progressive loading will occur (by default, loading will begin only after last bottom pixel has been reached)  
**fadeIn** [default: false] - integer value meaning milliseconds after which newly loaded blocks will fade in after being appended to the "loadContainer" (by default, they will appear without delay and fade effect)  

Callbacks
=========

**beforeLoad()** - is fired in case of success but before the newly loaded data has been appended to the "loadContainer"; receives no arguments  
**afterLoad(newItems)** - is fired in case of success after the newly loaded data has been appended to the "loadContainer" and is displayed (after fadeIn effect); newItems jQuery elements array is passed as an argument (to know which are the new elements in the item stack)  
**onFailure(data)** - works in case of AJAX request failure, receives "data" argument - response of XHR request  
**onRequestComplete(data)** - works in case of any XHR request, has "data" argument - the response text  
**onNoMoreItems()** - is triggered every time whenever bottom of the scrollable container has been reached (or bottom + extraPixels - depending on configuration option) but there are no more items to load  

Notes
=====

Whenever the plugin does not find anything necessary for working it tries to "guess" it from the given DOM structure and process everything intuitively - be that a wrongly given selector string or a missed option in plugin configuration.  

