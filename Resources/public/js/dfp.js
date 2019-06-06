var googletag = googletag || {};
googletag.cmd = googletag.cmd || [];
(function() {
    var gads = document.createElement('script');
    gads.async = true;
    gads.type = 'text/javascript';
    var useSSL = 'https:' == document.location.protocol;
    gads.src = (useSSL ? 'https:' : 'http:') + '//www.googletagservices.com/tag/js/gpt.js';
    var node = document.getElementsByTagName('script')[0];
    node.parentNode.insertBefore(gads, node);
})();

var googletag = googletag || {};
googletag.cmd = googletag.cmd || [];
googletag.cmd.push(function() {
    googletag.pubads().set("adsense_background_color", "FFFFFF");

    if (typeof(tdDfpTargeting) !== 'undefined') {
        $.each(tdDfpTargeting, function (key, value) {
            // we don't a real value
            if (value === 0 || value === '' || value === null) {
                return;
            }
            googletag.pubads().setTargeting(key, value);
        });

        if (gp !== undefined) {
            googletag.pubads().setTargeting('user_company', gp)
        }
    }
});

//the set up code
googletag.cmd.push(function() {
    if (typeof(tdDfpUnits) !== 'undefined') {
      $.each(tdDfpUnits, function(i, data) {
          // check if the dom exists
          if ($('#'+data.domName).length === 0) {
              return;
          }

          var builtMapping = null;

          if(data.screenSizes.length > 0) {
              var sizeMapping = googletag.sizeMapping();
              for(index = 0;index < data.screenSizes.length;index++) {
                  var item = data.screenSizes[index];
                  sizeMapping.addSize([item[0], item[1]], data.adSizes[index]);
              }
              builtMapping = sizeMapping.build();
           }

          // push this ad slot through
          var dfp = googletag.defineSlot(data.slotName, data.adSizes, data.domName);

          if(builtMapping !== null) {
              dfp.defineSizeMapping(builtMapping);
          }
          dfp.addService(googletag.pubads());
          dfp.setTargeting("position", data.positionName);
      });

      googletag.pubads().enableSingleRequest();
      googletag.pubads().collapseEmptyDivs();
      // send the request
      googletag.enableServices();
    }
});

//the display code
googletag.cmd.push(function() {
    $.each(tdDfpUnits, function(i, data) {
        // check if the dom exists
        if ($('#'+data.domName).length === 0) {
            return;
        }

        googletag.display(data.domName);
    });
});


// $('#DFP_drum_pushdown iframe').height($('#DFP_drum_pushdown iframe').contents().find('iframe').height())
