(function($, window, document, undefined) {
    var onffButton = {
        init: function (options, el) {
            var self = this;

            self.el = el;
            self.$el = $(el);
            self.options = $.extend( {}, $.fn.fancyonff.options, options );

            if (self.options.useWrap) {
                self.$el.html(
                    '<div class="ui-fancyonff__label ui-fancyonff__label_l">' + self.options.leftLabel + '</div>' +
                    '<div class="ui-fancyonff__fancyonff"><div class="ui-fancyonff__runner"></div></div>' +
                    '<div class="ui-fancyonff__label ui-fancyonff__label_r">' + self.options.rightLabel + '</div>'
                );
            }

            self.$lLabel = $('.ui-fancyonff__label_l', self.$el);
            self.$runner = $('.ui-fancyonff__runner', self.$el);
            self.$rLabel = $('.ui-fancyonff__label_r', self.$el);

            (function addCssClass() {
                var cssClass = 'ui-fancyonff';
                if (typeof self.options.cssModificator == 'string' && self.options.cssModificator.length > 0) {
                    cssClass += ' ' + self.options.cssModificator;
                }
                self.$el.addClass(cssClass);
            })();


            self.methods = {
                getStatus: self.getStatus
            };

            self.$lLabel.on('click.fancyonff', function (e) {
                self.setStatus(1);
                e.preventDefault();
            });
            self.$rLabel.on('click.fancyonff', function (e) {
                self.setStatus(0);
                e.preventDefault();
            });

            self.$runner.on('mousedown.fancyonff', function () {
                var $parent = self.$runner.parent(),
                    $document = $(document),
                    minPos = 0,
                    maxPos = $parent.width() - self.$runner.outerWidth(true) + minPos,
                    pos = 0,
                    time = (new Date()).getTime();

                self.$runner.addClass('ui-fancyonff__runner_move');

                $document.on('mousemove.fancyonff', function (e) {
                    pos = e.clientX - $parent.offset().left + minPos;
                    if (pos < minPos) {
                        pos = minPos;
                    } else if (pos > maxPos) {
                        pos = maxPos;
                    }

                    self.$runner.css(
                        {
                            left: pos
                        }
                    );
                });

                $document.on('mouseup.fancyonff', function (e) {
                    $document.unbind('.fancyonff');
                    self.$runner.removeClass('ui-fancyonff__runner_move').removeAttr('style');

                    if ((((new Date()).getTime() - time) < 200)) {

                        var status = self.getStatus();

                        if (status === 1) {
                            status = 0;
                        } else {
                            status = 1;
                        }

                        self.setStatus(status);

                    } else {

                        if (pos > (maxPos - minPos)/2) {
                            self.setStatus(0, false);
                        } else {
                            self.setStatus(1, false);
                        }

                    }

                });
            });

            if (self.options.status) {
                self.$lLabel.addClass('ui-fancyonff__label_active');
            } else {
                self.$rLabel.addClass('ui-fancyonff__label_active');
            }
        },

        setStatus: function (status, animateIE) {
            var self = this;

            if (status === 1 && self.options.status !== 1) {
                self.options.status = status;

                if ($.browser && $.browser.msie && animateIE) {
                    self.$runner.animate({left: 0}, 200);
                }
                self.$rLabel.removeClass('ui-fancyonff__label_active');
                self.$lLabel.addClass('ui-fancyonff__label_active');
                self.options.onTurnOn( status );

            } else if (status === 0 && self.options.status !== 0) {
                self.options.status = status;

                if ($.browser && $.browser.msie && animateIE) {
                    self.$runner.animate({left: 17}, 200);
                }
                self.$lLabel.removeClass('ui-fancyonff__label_active');
                self.$rLabel.addClass('ui-fancyonff__label_active');

                self.options.onTurnOff(status);
            }

            return self.options.status;
        },

        getStatus: function() {
            return this.options.status;
        }

    };

    $.fn.fancyonff = function(options) {
        return this.each(function () {
            var fancyonff = Object.create(onffButton);

            if (onffButton[options]) {
                return onffButton[options].apply(this, Array.prototype.slice.call(arguments, 1));
            } else if (typeof options === 'object' || typeof options === 'undefined') {
                return fancyonff.init(options, this);
            } else {
                $.error('"' + options + '" method is not supported in jQuery.fancyonff');
            }
        });
    };

    $.fn.fancyonff.options = {
        status: 0,
        useWrap: true,
        leftLabel: 'ON',
        rightLabel: 'OFF',
        cssModificator: '',
        onTurnOn: function( status ) {},
        onTurnOff: function( status ) {}
    };

})(jQuery, window, document);
