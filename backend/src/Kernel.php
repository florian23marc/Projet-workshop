<?php
namespace App;

use Symfony\Component\HttpKernel\Kernel as BaseKernel;
use Symfony\Component\Config\Loader\LoaderInterface;
use Symfony\Component\DependencyInjection\ContainerBuilder;
use Symfony\Component\Routing\RouteCollectionBuilder;

class Kernel extends BaseKernel
{
    public function registerBundles(): iterable
    {
        $contents = require $this->getProjectDir().'/config/bundles.php';
        foreach ($contents as $class => $envs) {
            if ($envs[$this->environment] ?? $envs['all'] ?? false) {
                yield new $class();
            }
        }
    }

    public function configureContainer(ContainerBuilder $container, LoaderInterface $loader): void
    {
        $loader->load($this->getProjectDir().'/config/{packages}/*.yaml', 'glob');
        $loader->load($this->getProjectDir().'/config/{packages}/'.$this->environment.'/*.yaml', 'glob');
        $loader->load($this->getProjectDir().'/config/{services}.yaml', 'glob');
        $loader->load($this->getProjectDir().'/config/{services}_'.$this->environment.'.yaml', 'glob');
    }

    public function registerContainerConfiguration(LoaderInterface $loader): void
    {
        $this->configureContainer(new ContainerBuilder(), $loader);
    }

    protected function configureRoutes(RouteCollectionBuilder $routes): void
    {
        $routes->import($this->getProjectDir().'/config/{routes}/*.yaml', '/', 'glob');
        $routes->import($this->getProjectDir().'/config/{routes}/'.$this->environment.'/*.yaml', '/', 'glob');
        $routes->import($this->getProjectDir().'/config/routes.yaml');
    }

    public function getProjectDir(): string
    {
        return dirname(__DIR__);
    }
}
