<template>
  <v-container
    class="pa-4 pa-sm-6 pa-md-8"
    tag="section"
  >
    <v-responsive
      class="mx-auto overflow-visible"
      max-width="868"
    >
      <skeleton-loader
        v-if="!component"
        key="loader"
      />

      <!-- <keep-alive
        v-else
        max="3"
      > -->
      <component :is="component" :key="page" />
      <!-- </keep-alive> -->
    </v-responsive>
  </v-container>
</template>

<script>
  // Utilities
  import { error } from '@/util/routes'
  import { genMetaData } from '@/util/metadata'
  import { get, sync } from 'vuex-pathify'
  import { wait, waitForReadystate } from '@/util/helpers'
  import { localeLookup } from '@/i18n/util'

  async function load (route) {
    const { category, locale, page } = route.params

    const isApi = category === 'api'
    const namespace = isApi ? 'api' : 'pages'
    const path = [namespace, localeLookup(locale)]

    if (!isApi && category) path.push(category)

    path.push(!category ? 'home' : page)

    try {
      return import(
        /* webpackChunkName: "documentation-[request]" */
        `@/${path.join('/')}.md`
      )
    } catch (e) {
      return error()
    }
  }

  export default {
    name: 'DocumentationView',

    async beforeRouteEnter (to, from, next) {
      const md = await load(to)

      next(async vm => {
        const {
          attributes = {},
          toc = [],
          vue = {},
        } = md

        vue.component.name = vm.page

        vm.frontmatter = attributes
        vm.toc = toc
        vm.component = vue.component
      })
    },

    metaInfo () {
      // Check it fm exists
      if (!this.frontmatter) return {}

      // Check if meta exists
      const { meta } = this.frontmatter

      if (!meta) return

      const {
        description = '',
        keywords = '',
        title = '',
      } = meta

      return genMetaData(
        title,
        description,
        keywords,
      )
    },

    data: () => ({ component: undefined }),

    computed: {
      ...sync('pages', [
        'frontmatter',
        'loading',
        'toc',
      ]),
      ...get('route', [
        'hash',
        'params@category',
        'params@locale',
        'params@page',
      ]),
      initializing: sync('app/initializing'),
    },
  }
</script>
