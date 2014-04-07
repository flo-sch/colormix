<?php

require_once __DIR__.'/vendor/autoload.php';

use Exception;
use SplFileInfo;

use Silex\Application;
use Silex\Provider\TwigServiceProvider;
use Silex\Provider\DoctrineServiceProvider;
use Silex\Provider\UrlGeneratorServiceProvider;
use Silex\Provider\SessionServiceProvider;
use Silex\Provider\SecurityServiceProvider;
use Symfony\Component\HttpFoundation\Request;
use Symfony\Component\Finder\Finder;
use Symfony\Component\HttpFoundation\File\File;

use Entea\Twig\Extension\AssetExtension;
use Neutron\Silex\Provider\FilesystemServiceProvider;

DEFINE(__VIEWS__, 'views');

$app = new Application();

// $app['debug'] = true;

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
$relativeBaseFolder = '../../build';
$app->get('/download', function () use ($app, $relativeBaseFolder) {
    $files = array();
    $basePath = __DIR__ . '/' . $relativeBaseFolder;
    $finder = new Finder();
    $finder->files()->in($basePath)->name('*.js')->sort(function (SplFileInfo $first, SplFileInfo $second) {
        return !strcmp($first->getRealPath(), $second->getRealPath());
    });

    foreach ($finder as $file) {
        $files[str_replace('v', 'version ', $file->getRelativePath())][] = $file;
    }

    return $app['twig']->render('/pages/download.html.twig', array(
        'relativeBaseFolder' => $relativeBaseFolder,
        'files' => $files
    ));
})->bind('download');

$app->get('/get/{filename}', function($filename) use ($app, $relativeBaseFolder) {
    $filename = __DIR__ . '/' . $relativeBaseFolder . '/' . $filename;
    if ($app['filesystem']->exists($filename)) {
        $file = new File($filename, true);
        $fileInfos = new SplFileInfo($filename);
        return $app->stream(function () use ($fileInfos) {
            readfile($fileInfos->getRealPath());
        }, 200, array(
            'Content-Type' => $file->getMimeType(),
            'Content-Length' => $fileInfos->getSize(),
            'Content-Disposition' => 'attachment; filename="' . $fileInfos->getFilename() . '"'
        ));
    } else {
        $app->abort(404, 'The file you are looking for cannot be found !');
    }
})->bind('get')->assert('filename', '[a-zA-Z0-9-_/.]*');

// Demonstrations
$app->get('/demonstrations', function () use ($app) {
    return $app['twig']->render('/pages/demonstrations.html.twig');
})->bind('demonstrations');

// Prices
$app->get('/prices', function () use ($app) {
    return $app['twig']->render('/pages/prices.html.twig');
})->bind('prices');

// Errors
$app->error(function (Exception $exception, $code) use ($app) {
    $message = '';
    $view = '/errors/' . $code . '.html.twig';
    if (!$app['filesystem']->exists($view)) {
        $view = '/errors/error.html.twig';
        switch ($code) {
            case '404':
                $message = 'The page you are looking for cannot be found...';
                break;
            default:
                $message = 'Something went wront...';
                break;
        }
    }
    return $app['twig']->render($view, array(
        'code' => $code,
        'message' => $message,
        'exception' => $exception
    ));
});

$app->run();
