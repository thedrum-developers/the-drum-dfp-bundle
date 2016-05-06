<?php

namespace TheDrum\DfpBundle\Helper;

use Doctrine\Common\Util\Inflector;
use Symfony\Component\HttpFoundation\RequestStack;

class DfpDataHelper
{
    protected $networkId;
    protected $targeting = [];
    protected $positions = [];
    protected $units = [];
    protected $usedSlots = [];

    public function __construct(RequestStack $requestStack)
    {
        $this->requestStack = $requestStack;
        $this->request = $this->requestStack->getCurrentRequest();

        if ($this->request) {
            $this->addTargeting('path', substr($this->request->getPathInfo(), 1));
        }
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

    public function mergeTargeting($data = [])
    {
        if (!is_array($data)) {
            return;
        }

        $this->targeting = array_merge($this->targeting, $data);
    }

    public function getTargeting()
    {
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
        $this->buildAdSlotConfig();

        return $this->units;
    }

    public function setUsedSlots($slots = [])
    {
        $this->usedSlots = $slots;
    }

    protected function buildAdSlotConfig()
    {
        $adUnits = [];

        foreach ($this->positions as $key => $position) {
            $tmp = [];
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
}
