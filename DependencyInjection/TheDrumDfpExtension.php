<?php

namespace TheDrum\DfpBundle\DependencyInjection;

use Symfony\Component\DependencyInjection\ContainerBuilder;
use Symfony\Component\Config\FileLocator;
use Symfony\Component\HttpKernel\DependencyInjection\Extension;
use Symfony\Component\DependencyInjection\Loader;

/**
 * This is the class that loads and manages your bundle configuration.
 *
 * @link http://symfony.com/doc/current/cookbook/bundles/extension.html
 */
class TheDrumDfpExtension extends Extension
{
    /**
     * {@inheritdoc}
     */
    public function load(array $configs, ContainerBuilder $container)
    {
        $configuration = new Configuration();
        $config = $this->processConfiguration($configuration, $configs);

        $loader = new Loader\YamlFileLoader($container, new FileLocator(__DIR__.'/../Resources/config'));
        $loader->load('services.yml');

        // Once the services definition are read, get your service and add a method call to setConfig()
        $sillyServiceDefintion = $container->getDefinition('the_drum_dfp.helper.dfp_data');
        $sillyServiceDefintion->addMethodCall('setConfig', [ $config[ 'network_id' ], $config['domain'], $config['positions'] ]);
    }
}
