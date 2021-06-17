import Vue from 'vue'
import Router from 'vue-router'
import HelloWorld from '@/components/HelloWorld'
import about from '@/components/About'
import info from '@/components/Info'

Vue.use(Router)

export default new Router({
  routes: [
    {
      path: '/',
      name: 'HelloWorld',
      component: HelloWorld
    },
    {
      path: '/about',
      name: 'about',
      component: about,
      children: [
        {
          path: '/about/info',
          // eslint-disable-next-line standard/object-curly-even-spacing
          component: { render (h) { return h('div', 'info page') }}
        }
      ]
    }
  ]
})
