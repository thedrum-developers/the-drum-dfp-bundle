import GoogleAdManager from './modules/GoogleAdManager'
import prebid from 'prebid.js';
import 'prebid.js/modules/rubiconBidAdapter';
import * as utils from "prebid.js/src/utils";

prebid.processQueue();

window.prebid = prebid;


var sizeMap = {
    1: '468x60',
    2: '728x90',
    5: '120x90',
    8: '120x600',
    9: '160x600',
    10: '300x600',
    13: '200x200',
    14: '250x250',
    15: '300x250',
    16: '336x280',
    17: '240x400',
    19: '300x100',
    31: '980x120',
    32: '250x360',
    33: '180x500',
    35: '980x150',
    37: '468x400',
    38: '930x180',
    39: '750x100',
    40: '750x200',
    41: '750x300',
    43: '320x50',
    44: '300x50',
    48: '300x300',
    53: '1024x768',
    54: '300x1050',
    55: '970x90',
    57: '970x250',
    58: '1000x90',
    59: '320x80',
    60: '320x150',
    61: '1000x1000',
    64: '580x500',
    65: '640x480',
    66: '930x600',
    67: '320x480',
    68: '1800x1000',
    72: '320x320',
    73: '320x160',
    78: '980x240',
    79: '980x300',
    80: '980x400',
    83: '480x300',
    94: '970x310',
    96: '970x210',
    101: '480x320',
    102: '768x1024',
    103: '480x280',
    105: '250x800',
    108: '320x240',
    113: '1000x300',
    117: '320x100',
    125: '800x250',
    126: '200x600',
    144: '980x600',
    145: '980x150',
    156: '640x320',
    159: '320x250',
    179: '250x600',
    195: '600x300',
    198: '640x360',
    199: '640x200',
    213: '1030x590',
    214: '980x360',
    229: '320x180',
    232: '580x400',
    257: '400x600',
    264: '970x1000',
    265: '1920x1080',
    278: '320x500',
    288: '640x380'
};
const rubiconSizes = {};
Object.values(sizeMap).forEach(item => { rubiconSizes[item] = item });



const bidders = [
    {
        bidder: "rubicon",
        params: {
            accountId: 21502,
            siteId: 21502,
            zoneId: 1454090
            // zoneId: 1454092
        },
    }
]

const googleAdManager = new GoogleAdManager();

prebid.setConfig({
    debugging: {
        enabled: true
    }
})

googleAdManager.setDFPConfig('adsense_background_color', 'FFFFFF');

if(tdDfpTargeting !== undefined) {
    googleAdManager.setDFPTargeting(tdDfpTargeting)
}

var PREBID_TIMEOUT = 1000;
var FAILSAFE_TIMEOUT = 1000;


var sizes = [
    [300, 250],
    [300, 600]
];
var adUnits = [{
    code: '/5639370/BID_Drum_300x250_1',
    mediaTypes: {
        banner: {
            sizes: sizes
        }
    },
    bids: [
        {
            bidder: "rubicon",
            params: {
                accountId: 21502,
                siteId: 21502,
                zoneId: 1454090
                // zoneId: 1454092
            },
        }
    ]
}];

let prebidUnits = tdDfpUnits.map(a => {
    return {
        code: a.slotName,
        mediaTypes: {
            banner: {
                sizes: a.adSizes
            }
        },
        bids: [
            {
                bidder: "rubicon",
                params: {
                    accountId: 21502,
                    siteId: 21502,
                    zoneId: 1454090
                    // zoneId: 1454092
                },
            }
        ]
    };
});


prebidUnits = prebidUnits.filter((item) => {
    item.mediaTypes.banner.sizes = item.mediaTypes.banner.sizes.filter((sizeAsArray) => {
        return rubiconSizes[`${sizeAsArray[0]}x${sizeAsArray[1]}`] !== undefined;
    });
    return item.mediaTypes.banner.sizes.length > 0;
});

console.log(prebidUnits);

prebid.addAdUnits(prebidUnits)

prebid.requestBids({
    bidsBackHandler: initAdserver,
    timeout: PREBID_TIMEOUT
});

function initAdserver() {
    if (prebid.initAdserverSet) return;
    prebid.initAdserverSet = true;
    googletag.cmd.push(function() {
        prebid.setTargetingForGPTAsync && prebid.setTargetingForGPTAsync();
        googletag.pubads().refresh();
        googleAdManager.displayAdverts(tdDfpUnits);
    });
}

setTimeout(function() {
    initAdserver();
}, FAILSAFE_TIMEOUT);


export default {
    prebid: prebid,
    googleAdManager: googleAdManager
};