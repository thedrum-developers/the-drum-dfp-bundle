<?php

namespace TheDrum\DfpBundle\EventListener;

use Symfony\Component\HttpKernel\Event\FilterResponseEvent;

use TheDrum\DfpBundle\Helper\DfpDataHelperInterface;

class ResponseListener
{
    protected $dfpDataHelper;

    public function __construct(DfpDataHelperInterface $dfpDataHelper)
    {
        $this->dfpDataHelper = $dfpDataHelper;
    }

    /**
     * @param \Symfony\Component\HttpKernel\Event\FilterResponseEvent $event
     */
    public function onKernelResponse(FilterResponseEvent $event)
    {
        if ($event->isMasterRequest()) {
            $response = $event->getResponse();
            if ($response instanceof \Symfony\Component\HttpFoundation\Response) {
                $content = $response->getContent();
                if (preg_match_all('/div.*"(DFP_.*?)"/', $content, $matches)) {
                    $this->dfpDataHelper->setUsedSlots($matches[1]);
                }
            }
        }
    }
}
