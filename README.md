# The Drum DFP Bundle

Adds support for configuring and rendering DFP ad units in a Symfony project

## Installation

```
composer require thedrum-developers/the-drum-dfp-bundle dev-master
```
## Configuration

#### Add the appropriate configuration for your ads i.e.

```
the_drum_dfp:
    network_id: **NETWORK_ID**
    domain: **DOMAIN NAME**
    positions:
        mpu_dh_1:
            screen_sizes: []
            ad_sizes: [[300, 600], [300,250]]
            dom_name: DFP_mpu_dh_1
            slot_name: **DFP_AD_MPU_SLOTNAME**
            position_name: mpu_dh_1
        leaderboard_header:
            screen_sizes: [[0,0], [728,90]]
            ad_sizes: [[], [728, 90]]
            dom_name: **DFP_AD_LEADERBOARD_SLOT_NAME**
            slot_name: CAMPAIGN1_728x90
            position_name: leaderboard_header
```

#### Add ad placeholder divs into the markup

i.e. `<div id="DFP_mpu_dh_1"></div>`


#### Activate Ads

Set `the_drum_dfp.active` is set to  `true` in `app/config/parameters.yml`


## License

This bundle is under the MIT license. See the complete license in the bundle:

```
Resources/meta/LICENSE
```

## Reporting an issue or a feature request

Issues and feature requests are tracked in the Github issue tracker.

When reporting a bug, it may be a good idea to reproduce it in a basic project built using the Symfony Standard Edition to allow developers of the bundle to reproduce the issue by simply cloning it and following some steps.
