(function($) {

    function getTextWidth($element) {
        var tester = $("<div/>").text($element.text())
			.css({ "position": "absolute", "float": "left", "white-space": "nowrap", "visibility": "hidden", "font-style": $element.css("font-style"), "font-variant": $element.css("font-variant"), "font-weight": $element.css("font-weight"), "font-stretch": $element.css("font-stretch"), "font-size": $element.css("font-size"), "text-transform": $element.css("text-transform"), "letter-spacing": $element.css("letter-spacing") })
			.appendTo($element.parent()),
			width = tester.innerWidth();
        tester.remove();
        return width;
    }

    function AutoShrinker($element) {
        this.$element = $element;
        this.$parent = $element.parent();
        this.initialFontSize = parseFloat($element.css("fontSize"));
        this.currentFontSize = this.initialFontSize;
        this.leftMarginRatio = parseFloat($element.css("marginLeft")) / this.initialFontSize;
        this.resize = function() {
            var maxWidth = this.$element.width(),
				newSize = this.currentFontSize * (maxWidth / getTextWidth(this.$element));
            newSize = newSize > this.initialFontSize ? this.initialFontSize : newSize;
            this.$element.css({
                "fontSize": newSize,
                "marginLeft": newSize * this.leftMarginRatio
            });
            this.currentFontSize = newSize;
        };
    }

    $.fn.autoshrink = function() {
        return this.each(function() {
            var shrinker, $this = $(this);
            $this.data("autoshrinker", shrinker = new AutoShrinker($this));
            shrinker.resize();
            $(window).on("resize", function() {
                shrinker.resize();
            });
        });
    };
})(jQuery);