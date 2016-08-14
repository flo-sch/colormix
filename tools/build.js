/**
 * ColorMix builder script
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 *
 * Inspired by Konstantin Tarkus
 * https://medium.com/@tarkus/how-to-build-and-publish-es6-modules-today-with-babel-and-rollup-4426d9c7ca71#.3m8cpe7eo
 */

'use strict';

const moduleName    = 'ColorMix';

const fs            = require('fs');
const del           = require('del');
const rollup        = require('rollup');
const babel         = require('rollup-plugin-babel');
const uglify        = require('rollup-plugin-uglify');

const packageFile   = require('../package.json');

// Clean up the output directory
let promise = Promise.resolve();
promise = promise.then(() => del(['dist/*']));

// Compile source code into distributable formats with Babel
const bundles = [
    {
        format: 'es',
        extension: '.mjs',
        plugins: [],
        babelPresets: [
            'stage-0'
        ],
        babelPlugins: [
            'external-helpers',
            'transform-es2015-destructuring',
            'transform-es2015-function-name',
            'transform-es2015-parameters'
        ]
    },
    {
        format: 'cjs',
        extension: '.js',
        plugins: [],
        babelPresets: [
            'stage-0'
        ],
        babelPlugins: [
            'external-helpers',
            'transform-es2015-destructuring',
            'transform-es2015-function-name',
            'transform-es2015-parameters'
        ]
    },
    {
        format: 'cjs',
        extension: '.browser.js',
        plugins: [],
        babelPresets: [
            'es2015-rollup',
            'stage-0'
        ],
        babelPlugins: [
            'external-helpers'
        ]
    },
    {
        format: 'umd',
        extension: '.js',
        plugins: [],
        babelPresets: [
            'es2015-rollup',
            'stage-0'
        ],
        babelPlugins: [
            'external-helpers'
        ],
        moduleName: moduleName
    },
    {
        format: 'umd',
        extension: '.min.js',
        plugins: [
            uglify()
        ],
        babelPresets: [
            'es2015-rollup',
            'stage-0'
        ],
        babelPlugins: [
            'external-helpers'
        ],
        moduleName: moduleName,
        minify: true
    }
];

bundles.map((config) => {
    promise = promise.then(() => rollup.rollup({
        entry: 'src/index.js',
        external: Object.keys(packageFile.dependencies),
        plugins: [
            babel({
                babelrc: false,
                exclude: 'node_modules/**',
                presets: config.babelPresets,
                plugins: config.babelPlugins,
            })
        ].concat(config.plugins),
    }).then(bundle => bundle.write({
        banner: `/***
 * ${moduleName} v${packageFile.version}
 *
 * ${packageFile.homepage}
 *
 * Copyright 2016 Florent Schildknecht
 * Licensed under the MIT license.
 **/`,
        format: config.format,
        sourceMap: !config.minify,
        moduleName: config.moduleName,
        dest: `dist/${config.moduleName ? packageFile.name : 'index'}${config.extension}`
    })));
});

// Copy package.json and LICENSE files into dist directory
promise = promise.then(() => {
    let propertiesToRemove = [
        'private',
        'scripts',
        'devDependencies',
        'babel',
        'eslintConfig'
    ];

    propertiesToRemove.map((propertyToRemove) => {
        delete packageFile[propertyToRemove];
    });

    fs.writeFileSync('dist/package.json', JSON.stringify(packageFile, null, '  '), 'utf-8');
    fs.writeFileSync('dist/LICENSE', fs.readFileSync('LICENSE', 'utf-8'), 'utf-8');
});

promise.catch(error => console.error(error));
