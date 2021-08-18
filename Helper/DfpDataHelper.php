<?php

namespace TheDrum\DfpBundle\Helper;

use Symfony\Component\HttpFoundation\RequestStack;

class DfpDataHelper implements DfpDataHelperInterface
{
    protected static $targeting = [];

    protected $networkId;
    protected $positions = [];
    protected $units = [];
    protected $usedSlots = [];

    public function __construct(RequestStack $requestStack)
    {
        $this->requestStack = $requestStack;
    }

    public function setConfig($networkId, $domain, $positions = [])
    {
        $this->networkId = $networkId;
        $this->positions = $positions;

        $this->addTargeting('url', $domain);
    }

    public function addTargeting($key, $value)
    {
        self::$targeting[$key] = $value;
    }

    public function mergeTargeting($data = [])
    {
        if (!is_array($data)) {
            return;
        }

        self::$targeting = array_merge(self::$targeting, $data);
    }

    public function getTargeting()
    {
        $this->setRequestTargetingValues();

        return self::$targeting;
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
            $adUnits = [];

            foreach ($this->positions as $key => $position) {
                $tmp = [];
                foreach ($position as $attributeKey => $data) {
                    if ($attributeKey == 'slot_name') {
                        $data = "/{$this->networkId}/{$data}";
                    }
                    $tmp[self::camelize($attributeKey)] = $data;
                }

                $adUnits[] = $tmp;
            }

            $this->units = $adUnits;
        }

        return $this->units;
    }

    public function setUsedSlots($slots = [])
    {
        $this->usedSlots = $slots;
    }

    /**
     * Convert a word in to the format for a Doctrine class name. Converts 'table_name' to 'TableName'
     *
     * @param string  $word  Word to classify
     * @return string $word  Classified word
     */
    public static function classify($word)
    {
        return str_replace(" ", "", ucwords(strtr($word, "_-", "  ")));
    }

    /**
     * Camelize a word. This uses the classify() method and turns the first character to lowercase
     *
     * @param string $word
     * @return string $word
     */
    public static function camelize($word)
    {
        return lcfirst(self::classify($word));
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
