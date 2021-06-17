let Vue

class VueRouter {
  constructor (options) {
    this.$options = options

    this.current = '/'
    Vue.util.defineReactive(this, 'matched', [])
    this.match()
    // 监听hash变化
    window.addEventListener('hashchange', this.onHashChange.bind(this))
    window.addEventListener('load', this.onHashChange.bind(this))
  }
  onHashChange () {
    this.current = window.location.hash.slice(1)
    this.matched = []
    this.match()
  }
  match (routes) {
    const routesArr = routes || this.$options.routes
    for (let route of routesArr) {
      if (route.path === '/' && this.current === '/') {
        this.matched.push(route)
        return
      }
      if (route.path !== '/' && this.current.indexOf(route.path) !== -1) {
        this.matched.push(route)
        if (route.children) this.match(route.children)
        return
      }
    }
  }
}
VueRouter.install = function (_Vue) {
  Vue = _Vue
  Vue.mixin({
    beforeCreate () {
      if (this.$options.router) {
        Vue.prototype.$router = this.$options.router
      }
    }
  })
  Vue.component('router-link', {
    props: {
      to: {
        type: String,
        required: true
      }
    },
    render (h) {
      return h(
        'a',
        {
          attrs: {
            href: '#' + this.to
          }
        },
        this.$slots.default
      )
    }
  })
  Vue.component('router-view', {
    render (h) {
      this.$vnode.data.routerView = true
      let depth = 0
      let parent = this.$parent
      while (parent) {
        const vnodeData = parent.$vnode && parent.$vnode.data
        if (vnodeData) {
          if (vnodeData.routerView) {
            depth++
          }
        }
        parent = parent.$parent
      }

      let component = null
      const route = this.$router.matched[depth]
      console.log('matched', this.$router.matched)
      if (route) {
        component = route.component
      }
      return h(component)
    }
  })
}

export default VueRouter
