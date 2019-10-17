import $ from 'jquery';
import { each } from 'lodash-es';

class GoogleAdManager {
    googletag = {};

    shouldLazyLoad = false;

    constructor () {
        this.initDataIfNotSet();
        this.loadScripts();
    }

    initDataIfNotSet() {
        this.googletag = googletag || {};
        this.googletag.cmd = this.googletag.cmd || [];
        window.googletag =  this.googletag;
    }

    loadScripts() {
        var gads = document.createElement('script');
        gads.async = true;
        gads.type = 'text/javascript';
        var useSSL = 'https:' == document.location.protocol;
        gads.src = (useSSL ? 'https:' : 'http:') + '//www.googletagservices.com/tag/js/gpt.js';
        var node = document.getElementsByTagName('script')[0];
        node.parentNode.insertBefore(gads, node);
    }

    setDFPConfig(key, value) {
        window.googletag.cmd.push(function() {
            window.googletag.pubads().set(key, value);
        });
    }

    setDFPTargeting(tdDfpTargeting) {
        window.googletag.cmd.push(function() {
            if (typeof(tdDfpTargeting) !== 'undefined') {

                each(tdDfpTargeting, function (value, key) {

                    // we don't a real value
                    if (value === 0 || value === '' || value === null) {
                        return;
                    }
                    window.googletag.pubads().setTargeting(key, value);
                });
            }
        });
    }

    displayAdverts(tdDfpU1nits) {

        //the set up code
        window.googletag.cmd.push(function() {
            if (typeof(tdDfpUnits) !== 'undefined') {

                each(tdDfpUnits, loadAdvert);

                function loadAdvert(data, i) {
                    // check if the dom exists

                    if(document.getElementById(data.domName) === null) {
                        return;
                    }

                    var builtMapping = null;

                    if(data.screenSizes.length > 0) {
                        var sizeMapping = window.googletag.sizeMapping();
                        for(let index = 0;index < data.screenSizes.length;index++) {
                            var item = data.screenSizes[index];
                            sizeMapping.addSize([item[0], item[1]], data.adSizes[index]);
                        }
                        builtMapping = sizeMapping.build();
                    }

                    // push this ad slot through
                    var dfp = window.googletag.defineSlot(data.slotName, data.adSizes, data.domName);

                    if(builtMapping !== null) {
                        dfp.defineSizeMapping(builtMapping);
                    }
                    dfp.addService(window.googletag.pubads());
                    dfp.setTargeting("position", data.positionName);
                }

                window.googletag.pubads().collapseEmptyDivs();
                window.googletag.enableServices();
            }
        });


        if(this.shouldLazyLoad) {
            this.lazyLoadAdverts(tdDfpUnits);
        } else {
            this.loadAdverts(tdDfpUnits);
        }

    }

    loadAdverts(tdDfpUnits) {
        window.googletag.cmd.push(function() {
            each(tdDfpUnits, function (data, i) {
                // check if the dom exists
                var dom = $('#' + data.domName);
                if (dom.length === 0) {
                    return;
                }
                window.googletag.display(data.domName);
            });
        });
    }

    lazyLoadAdverts(tdDfpUnits) {
        //TODO: Refactor withou Jquery
        $.fn.isInViewport = function() {
            var elementTop = $(this).offset().top;
            var elementBottom = elementTop + $(this).outerHeight();
            var viewportTop = $(window).scrollTop();
            var viewportBottom = viewportTop + $(window).height();
            return elementBottom > viewportTop && elementTop < viewportBottom;
        };

        window.googletag.cmd.push(function() {
            function displayVisibleAds() {
                if (typeof(tdDfpUnits) !== 'undefined') {
                    each(tdDfpUnits, function (data, i) {
                        // check if the dom exists
                        var dom = $('#' + data.domName);
                        if (dom.length === 0) {
                            return;
                        }

                        if (dom.isInViewport() && !dom.data('adloaded')) {
                            window.googletag.display(data.domName);
                            $('#' + data.domName).data('adloaded', true);
                        }
                    });
                }
            }

            window.addEventListener('scroll', displayVisibleAds)

            //Run once on page loaded to show ads in viewport
            displayVisibleAds();
        });
    }
}

export default GoogleAdManager;
