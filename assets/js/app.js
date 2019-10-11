import GoogleAdManager from './modules/GoogleAdManager'

const googleAdManager = new GoogleAdManager();

googleAdManager.setDFPConfig('adsense_background_color', 'FFFFFF');

if(tdDfpTargeting !== undefined) {
    googleAdManager.setDFPTargeting(tdDfpTargeting)
}

googleAdManager.displayAdverts(tdDfpUnits);