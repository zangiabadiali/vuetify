// Imports
import { createApp } from './main'
import { IS_PROD } from '@/util/globals'

const path = require('path')
const resolve = file => path.resolve(__dirname, file)

// ENV Variables
require('dotenv').config({ path: resolve('../.env.local') })

global.fetch = require('node-fetch')

// This exported function will be called by `bundleRenderer`.
// This is where we perform data-prefetching to determine the
// state of our application before actually rendering it.
// Since data fetching is async, this function is expected to
// return a Promise that resolves to the app instance.
export default context => {
  /* eslint-disable-next-line no-async-promise-executor */
  return new Promise(async (resolve, reject) => {
    try {
      await createApp(({ app, router, store }) => {
        router.push(context.url)

        context.meta = app.$meta()

        router.onReady(() => resolve(app))
      }, context)
    } catch (e) {
      console.log('error in server try')

      reject(e)
    }
  })
}
