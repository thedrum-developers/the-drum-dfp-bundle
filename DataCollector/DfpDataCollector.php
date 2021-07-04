<?php

namespace TheDrum\DfpBundle\DataCollector;

use Symfony\Component\HttpKernel\DataCollector\DataCollector;
use Symfony\Component\HttpFoundation\Request;
use Symfony\Component\HttpFoundation\Response;

use TheDrum\DfpBundle\Helper\DfpDataHelperInterface;

class DfpDataCollector extends DataCollector
{
    protected $dfpDataHelper;
    protected $data = [];

    public function __construct(DfpDataHelperInterface $dfpDataHelper)
    {
        $this->dfpDataHelper = $dfpDataHelper;
    }

    public function collect(Request $request, Response $response, \Exception $exception = null)
    {
        foreach ($this->dfpDataHelper->getProfilerData() as $key => $value) {
            $this->data[$key] = $value;
        }
    }

    public function getTargetingData()
    {
        if (isset($this->data['targeting'])) {
            return $this->data['targeting'];
        } else {
            return array();
        }

    }

    public function getSlotData()
    {
        $data = $this->data['slots'];
        $usedSlots = $this->data['usage'];

        foreach ($data as &$slot) {
            if (in_array($slot['domName'], $usedSlots)) {
                $slot['usage'] = 'Used';
            } else {
                $slot['usage'] = 'Unused';
            }
        }

        return $data;
    }

    public function getName()
    {
        return 'the_drum_dfp.data_collector';
    }
}
