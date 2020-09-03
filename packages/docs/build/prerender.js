const { chunk } = require('lodash')
const os = require('os')
const fs = require('fs')
const path = require('path')
const util = require('util')
const mkdirp = require('mkdirp')
const { performance } = require('perf_hooks')
const {
  Worker,
  isMainThread,
  parentPort,
  workerData,
} = require('worker_threads')

const ProgressBar = require('progress')
const { createBundleRenderer } = require('vue-server-renderer')

const languages = require('../src/i18n/locales.js')
const availableLanguages = languages.map(lang => lang.alternate || lang.locale)

const threads = os.cpus().length
const resolve = file => path.resolve(__dirname, file)

function readFile (file) {
  return fs.readFileSync(resolve(file), 'utf-8')
}
const writeFile = fs.promises.writeFile

/**
 * Call cb for each item in arr, waiting for a returned
 * promise to resolve before calling on the next item
 *
 * @param {any[]} arr
 * @param {function(*): Promise<void>} cb
 * @return {Promise<void>}
 */
function forEachSequential (arr, cb) {
  return arr.reduce((p, val) => {
    return p.then(() => {
      return cb(val)
    })
  }, Promise.resolve())
}

function postMessage (data) {
  if (isMainThread) {
    onMessage(data)
  } else {
    parentPort.postMessage(data)
  }
}

let bar
function onMessage ({ message, error, lastFile, time }) {
  const interrupt = process.stdout.clearLine ? bar.interrupt.bind(bar) : console.log.bind(console)

  if (message) {
    interrupt(message)
  }
  if (error) {
    interrupt('\n' + lastFile + '\n' + error)
  }

  if (lastFile) {
    bar.tick({ lastFile, time })
  }
}

// const routes = require('./generate-routes')
const template = readFile('../src/ssr.template.html')
const bundle = JSON.parse(readFile('../dist/vue-ssr-server-bundle.json'))
const clientManifest = JSON.parse(readFile('../dist/vue-ssr-client-manifest.json'))

const renderer = createBundleRenderer(bundle, {
  runInNewContext: true,
  clientManifest,
  shouldPrefetch: () => false,
  template,
})

renderer.renderToString({
  url: '/',
  lang: 'en',
  meta: {},
}).then(html => {
  writeFile(
    resolve('../dist/test.html'),
    html,
    { encoding: 'utf-8' }
  ).then(() => process.exit(0))
})

// render({ routes, template, bundle, clientManifest }).then(() => process.exit(0))
