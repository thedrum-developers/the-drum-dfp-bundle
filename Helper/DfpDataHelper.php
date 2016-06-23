<?php

namespace TheDrum\DfpBundle\Helper;

use Doctrine\Common\Util\Inflector;
use Symfony\Component\HttpFoundation\RequestStack;

class DfpDataHelper implements DfpDataHelperInterface
{
    protected $networkId;
    protected $targeting = array();
    protected $positions = array();
    protected $units = array();
    protected $usedSlots = array();

    public function __construct(RequestStack $requestStack)
    {
        $this->requestStack = $requestStack;
    }

    public function setConfig($networkId, $domain, $positions = array())
    {
        $this->networkId = $networkId;
        $this->positions = $positions;

        $this->addTargeting('url', $domain);
    }

    public function addTargeting($key, $value)
    {
        $this->targeting[$key] = $value;
    }

    public function mergeTargeting($data = array())
    {
        if (!is_array($data)) {
            return;
        }

        $this->targeting = array_merge($this->targeting, $data);
    }

    public function getTargeting()
    {
        $this->setRequestTargetingValues();

        return $this->targeting;
    }


    public function getProfilerData()
    {
        $data = [
            'slots'     => $this->getSlotConfiguration(),
            'usage'     => $this->usedSlots,
            'targeting' => $this->getTargeting(),
        ];

        return $data;
    }

    public function getSlotConfiguration()
    {
        if (!$this->units) {
            $adUnits = array();

            foreach ($this->positions as $key => $position) {
                $tmp = array();
                foreach ($position as $attributeKey => $data) {
                    if ($attributeKey == 'slot_name') {
                        $data = "/{$this->networkId}/{$data}";
                    }
                    $tmp[Inflector::camelize($attributeKey)] = $data;
                }

                $adUnits[] = $tmp;
            }

            $this->units = $adUnits;
        }

        return $this->units;
    }

    public function setUsedSlots($slots = array())
    {
        $this->usedSlots = $slots;
    }

    protected function setRequestTargetingValues()
    {
        $currentRequest = $this->requestStack->getCurrentRequest();
        $request = $this->requestStack->getMasterRequest();

        if ($request && $request == $currentRequest) {
            $this->addTargeting('path', $request->getPathInfo());
        }
    }
}
