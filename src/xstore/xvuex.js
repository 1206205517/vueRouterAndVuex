let Vue

class Store {
  constructor (options) {
    this._mutations = options.mutations
    this._actions = options.actions
    this._wrappedGetters = options.getters
    this.commit = this.commit.bind(this)
    this.dispatch = this.dispatch.bind(this)

    // 定义computed选项
    const computed = {}
    this.getters = {}
    const store = this
    Object.keys(this._wrappedGetters).forEach(key => {
      const fn = store._wrappedGetters[key]
      computed[key] = function () {
        return fn(store.state)
      }
      Object.defineProperty(store.getters, key, {
        get: () => store._vm[key] // vm中key有代理
      })
    })

    this._vm = new Vue({
      data: {
        $$state: options.state
      },
      computed
    })
  }
  get state () {
    return this._vm._data.$$state
  }
  set state (val) {
    console.error('please use replaceState to reset state')
  }
  commit (type, payload) {
    const entry = this._mutations[type]
    if (!entry) {
      console.error('type error')
    }
    entry(this.state, payload)
  }
  dispatch (type, payload) {
    const entry = this._actions[type]
    if (!entry) {
      console.error('type error')
    }
    entry(this, payload)
  }
}
function install (_Vue) {
  Vue = _Vue
  Vue.mixin({
    beforeCreate () {
      if (this.$options.store) {
        Vue.prototype.$store = this.$options.store
      }
    }
  })
}

export default { Store, install }
