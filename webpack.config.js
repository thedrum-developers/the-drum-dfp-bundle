var Encore = require('@symfony/webpack-encore');

Encore
// directory where compiled assets will be stored
//     .setOutputPath('public/build/')
    .setOutputPath('Resources/public/js/')
    // public path used by the web server to access the output path
    .setPublicPath('/public/js')
    // only needed for CDN's or sub-directory deploy
    //.setManifestKeyPrefix('build/')
    .configureBabel(function(babelConfig) {
        babelConfig.plugins.push("transform-class-properties");
    })
    /*
     * ENTRY CONFIG
     *
     * Add 1 entry for each "page" of your app
     * (including one that's included on every page - e.g. "app")
     *
     * Each entry will result in one JavaScript file (e.g. app.js)
     * and one CSS file (e.g. app.css) if your JavaScript imports CSS.
     */
    .addEntry('app', './assets/js/app.js')

    // will require an extra script tag for runtime.js
    // but, you probably want this, unless you're building a single-page app
    .enableSingleRuntimeChunk()

    .cleanupOutputBeforeBuild()
    .enableSourceMaps(!Encore.isProduction())
    // enables hashed filenames (e.g. app.abc123.css)
    .enableVersioning(Encore.isProduction())
    ;
    // console.log(Encore.getWebpackConfig());

module.exports = Encore.getWebpackConfig();
