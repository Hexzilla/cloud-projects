<template>
  <v-app-bar
    id="app-bar"
    absolute
    app
    color="transparent"
    flat
    height="75"
  >
    <v-btn
      class="mr-3"
      elevation="1"
      fab
      small
      @click="setDrawer(!drawer)"
    >
      <v-icon v-if="value">
        mdi-view-quilt
      </v-icon>

      <v-icon v-else>
        mdi-dots-vertical
      </v-icon>
    </v-btn>

    <v-toolbar-title
      class="hidden-sm-and-down font-weight-light"
      v-text="$route.name"
    />

    <v-spacer />

    <div class="mx-3" />

    <v-btn
      class="ml-2"
      min-width="0"
      text
      to="/"
    >
      <v-icon>mdi-view-dashboard</v-icon>
    </v-btn>

    <v-menu
      bottom
      left
      offset-y
      origin="top left"
      transition="scale-transition"
    >
      <template v-slot:activator="{ attrs, on }">
        <v-btn
          class="ml-2"
          min-width="0"
          text
          v-bind="attrs"
          v-on="on"
        >
          <v-icon>mdi-information-outline</v-icon>
        </v-btn>
      </template>

      <v-list
        nav
      >
        <div>
          <app-bar-item v-for="(e, i) in info" :key="i">
            <v-list-item-title>
              {{e}}
            </v-list-item-title>
          </app-bar-item>
        </div>
      </v-list>
    </v-menu>

    <v-menu
      bottom
      left
      offset-y
      origin="top right"
      transition="scale-transition"
    >
      <template v-slot:activator="{ attrs, on }">
        <v-btn
          class="ml-2"
          min-width="0"
          text
          v-bind="attrs"
          v-on="on"
        >
          <v-icon>mdi-account</v-icon>
        </v-btn>
      </template>

      <v-list
        :tile="false"
        nav
      >
        <div>
          <app-bar-item>
            <v-list-item-title>
              <div @click="logout">
                ({{ getCode }})&nbsp;&nbsp;&nbsp;Log Out <v-icon>mdi-logout</v-icon>
              </div>
            </v-list-item-title>
          </app-bar-item>
        </div>
      </v-list>
    </v-menu>
  </v-app-bar>
</template>

<script>
  import auth_api from "@/apis/auth.js";
  // Components
  import { VHover, VListItem } from 'vuetify/lib'

  // Utilities
  import { mapState, mapMutations } from 'vuex'

  export default {
    name: 'DashboardCoreAppBar',

    components: {
      AppBarItem: {
        render (h) {
          return h(VHover, {
            scopedSlots: {
              default: ({ hover }) => {
                return h(VListItem, {
                  attrs: this.$attrs,
                  class: {
                    'black--text': !hover,
                    'white--text secondary elevation-12': hover,
                  },
                  props: {
                    activeClass: '',
                    dark: hover,
                    link: true,
                    ...this.$attrs,
                  },
                }, this.$slots.default)
              },
            },
          })
        },
      },
    },

    props: {
      value: {
        type: Boolean,
        default: false,
      },
    },

    data: () => ({
      info: [],
    }),

    async created() {
      const temp = await auth_api.getInfo()
      for (const [key, value] of Object.entries(temp)) {
        this.info.push(key + ' : ' + value)
      }
    },

    computed: {
      ...mapState(['drawer']),
      getCode() {
        return localStorage.getItem('code')
      }
    },

    methods: {
      ...mapMutations({
        setDrawer: 'SET_DRAWER',
      }),

      logout: () => {
        localStorage.clear()
        window.location.href = "/"
      }
    },
  }
</script>
