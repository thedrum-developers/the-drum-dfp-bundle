<?php

namespace TheDrum\DfpBundle\DependencyInjection;

use Symfony\Component\Config\Definition\Builder\TreeBuilder;
use Symfony\Component\Config\Definition\ConfigurationInterface;

/**
 * This is the class that validates and merges configuration from your app/config files.
 *
 * To learn more see {@link http://symfony.com/doc/current/cookbook/bundles/configuration.html}
 */
class Configuration implements ConfigurationInterface
{
    /**
     * {@inheritdoc}
     */
    public function getConfigTreeBuilder()
    {
        $treeBuilder = new TreeBuilder();
        $rootNode = $treeBuilder->root('the_drum_dfp');

        // Here you should define the parameters that are allowed to
        // configure your bundle. See the documentation linked above for
        // more information on that topic.

        $rootNode
            ->children()
                ->scalarNode('network_id')->end()
                ->scalarNode('domain')->end()
                ->arrayNode('positions')
                    ->prototype('array')
                        ->children()
                            ->scalarNode('slot_name')->end()
                            ->arrayNode('screen_sizes')
                                ->prototype('array')
                                    ->prototype('scalar')->end()
                                ->end()
                            ->end()
                            ->variableNode('ad_sizes')->end()
                            ->scalarNode('dom_name')->end()
                            ->scalarNode('position_name')->end()
                        ->end()
                    ->end()
                ->end()
            ->end();

        return $treeBuilder;
    }
}

