<?php

namespace TheDrum\DfpBundle\Twig\Extension;

use Symfony\Component\HttpKernel\KernelInterface;
use TheDrum\DfpBundle\Helper\DfpDataHelper;

class DfpExtension extends \Twig_Extension
{
    protected $dataHelper;
    protected $debug;
    protected $active;

    public function __construct(DfpDataHelper $dataHelper, $active = true)
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
            new \Twig_SimpleFunction('render_dfp', array($this, 'renderDfp'), array('is_safe' => array('html'))),
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
            $markup = [
                '<script language="javascript">',
                'var tdDfpUnits = ' . json_encode($units) . ";",
                'var tdDfpTargeting = ' . json_encode($targeting) . ";",
                '</script>',
            ];

            $markup[] = '<script async src="/bundles/thedrumdfp/js/dfp.js"></script>';
        }

        return implode('', $markup);
    }

    public function getName()
    {
        return 'the_drum_dfp';
    }
}
