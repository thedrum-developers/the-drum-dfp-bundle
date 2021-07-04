<?php

namespace TheDrum\DfpBundle\Twig\Extension;

use TheDrum\DfpBundle\Helper\DfpDataHelperInterface;
use Twig\Extension\AbstractExtension;
use Twig\TwigFunction;

class DfpExtension extends AbstractExtension
{
    protected $dataHelper;
    protected $debug;
    protected $active;

    public function __construct(DfpDataHelperInterface $dataHelper, $active = true)
    {
        $this->dataHelper = $dataHelper;
        $this->active = $active;
    }

    /**
     * {@inheritdoc}
     */
    public function getFunctions()
    {
        return array(
            new TwigFunction('the_drum_dfp_render', array($this, 'renderDfp'), array('is_safe' => array('html'))),
        );
    }

    public function renderDfp()
    {
        if (!$this->active) {
            return;
        }

        $markup = [];
        $units = $this->dataHelper->getSlotConfiguration();
        $targeting = $this->dataHelper->getTargeting();

        if ($units) {
            return '<div id="dfp" data-td-dfp-units="' . json_encode($units) . '" data-td-dfp-targeting="' . json_encode($targeting) . '"></div>';
        }

        return '';
    }

    public function getName()
    {
        return 'the_drum_dfp';
    }
}
