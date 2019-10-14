import GoogleAdManager from './modules/GoogleAdManager'
import prebid from 'prebid.js';
import 'prebid.js/modules/rubiconBidAdapter';






const googleAdManager = new GoogleAdManager();

googleAdManager.setDFPConfig('adsense_background_color', 'FFFFFF');

if(tdDfpTargeting !== undefined) {
    googleAdManager.setDFPTargeting(tdDfpTargeting)
}

var PREBID_TIMEOUT = 1000;
var FAILSAFE_TIMEOUT = 3000;


var sizes = [
    [300, 250]
];
var adUnits = [{
    code: '/5639370/BID_Drum_300x250_1',
    mediaTypes: {
        banner: {
            sizes: sizes
        }
    }
    ,
    bids: [{
        bidder: "rubicon",
        params: {
            // accountId: 14062,
            // siteId: 70608,
            // zoneId: 498816
        }
    }]
}];

prebid.addAdUnits(adUnits)

prebid.requestBids({
    bidsBackHandler: initAdserver,
    timeout: PREBID_TIMEOUT
});

function initAdserver() {
    debugger;
    if (prebid.initAdserverSet) return;
    prebid.initAdserverSet = true;
    googletag.cmd.push(function() {
        prebid.setTargetingForGPTAsync && prebid.setTargetingForGPTAsync();
        googletag.pubads().refresh();
    });
}

setTimeout(function() {
    initAdserver();
}, FAILSAFE_TIMEOUT);


googletag.cmd.push(function() {
    googletag.defineSlot('/19968336/header-bid-tag-1', sizes, 'div-1')
        .addService(googletag.pubads());
    googletag.pubads().enableSingleRequest();
    googletag.enableServices();
});





// Display Adverts
// googletag.cmd.push(function() {
//     googletag.display('div-1');
// });
googleAdManager.displayAdverts(tdDfpUnits);