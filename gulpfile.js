const gulp = require('gulp')
const webpack = require('webpack')
const webpackConfig = require('./webpack.config')

// to run the child process of cp models into dist/
const execSync = require('child_process').execSync;

const generateAplication = cb => {
    return new Promise((resolve, reject) => {
        // Callingn webpack to build the bundler 
        webpack(webpackConfig, (err, stats) => {
            // Verifying if there's any error while webpack compiling
            if (err) {
                return reject(err)
            }
            if (stats.hasErrors()) {
                return reject(new Error(stats.compilation.errors.join('\n')))
            }
            resolve()
        })
    })
}

const copyModels = cb => {
    return new Promise((resolve, reject) => {
        try {
            const output = execSync('cp -vr src/models dist/', { encoding: 'utf-8' });  // the default is 'buffer'
            console.log('Output was:\n', output);
            resolve()
        } catch (err) {
            reject(err)
        }
    })
}

const runDev = cb => {
    return new Promise((resolve, reject) => {
        
    })
}

exports.build = gulp.series(generateAplication, copyModels)