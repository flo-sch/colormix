<?php

require_once __DIR__.'/vendor/autoload.php';

use Symfony\Component\HttpFoundation\Request;

use Silex\Application;
use Silex\Provider\TwigServiceProvider;
use Silex\Provider\DoctrineServiceProvider;
use Silex\Provider\UrlGeneratorServiceProvider;
use Silex\Provider\SessionServiceProvider;
use Silex\Provider\SecurityServiceProvider;
use Symfony\Component\Finder\Finder;
use Symfony\Component\Routing\Exception\RouteNotFoundException;
use Symfony\Component\Security\Core\Encoder\MessageDigestPasswordEncoder;

use Entea\Twig\Extension\AssetExtension;
use Neutron\Silex\Provider\FilesystemServiceProvider;

DEFINE(__VIEWS__, 'views');

$app = new Application();

$app['debug'] = true;

// Session
$app->register(new SessionServiceProvider());
$app['session']->start();

$app->register(new TwigServiceProvider(), array(
    'twig.path' => __DIR__ . '/' . __VIEWS__,
    'twig.class_path' => __DIR__ . '/vendor/twig/lib'
));
$app['twig']->addExtension(new AssetExtension($app));

$app->register(new UrlGeneratorServiceProvider());

$app->register(new FilesystemServiceProvider());

// Security part
$app['security.encoder.digest'] = $app->share(function ($app) {
    return new MessageDigestPasswordEncoder('sha1', false, 1);
});

// Home page
$app->get('/', function () use ($app) {
    return $app['twig']->render('/pages/home.html.twig');
})->bind('home');

// How to use ?
$app->get('/get-started', function () use ($app) {
    return $app['twig']->render('/pages/getting-started.html.twig');
})->bind('getting-started');

// Documentation
$app->get('/documentation', function () use ($app) {
    return $app['twig']->render('/pages/documentation.html.twig');
})->bind('documentation');

// Download
$app->get('/download', function () use ($app) {
    return $app['twig']->render('/pages/download.html.twig');
})->bind('download');

// Demonstrations
$app->get('/demonstrations', function () use ($app) {
    return $app['twig']->render('/pages/demonstrations.html.twig');
})->bind('demonstrations');

$app->run();
